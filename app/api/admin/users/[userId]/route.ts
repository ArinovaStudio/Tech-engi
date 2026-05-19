import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";
import { deleteFile } from "@/lib/uploads";
import { z } from "zod";
import { generateEmbedding } from "@/lib/embeddings";
import { engineerApprovalTemplate, engineerRejectionTemplate } from "@/lib/templates";
import sendEmail from "@/lib/email";

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { error } = await getAdmin();
    if (error){
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        engineerProfile: true,
        payoutDetail: true,
        clientProfile: {
          include: { projects: { select: { id: true } } }
        },
        transactions: {
          where: {
            status: "SUCCESS",
            type: { in: ["ADVANCE_PAYMENT", "FINAL_PAYMENT"] }
          },
          select: { amount: true }
        }
      }
    });

    if (!userDetails){
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (userDetails.role === "CLIENT" && userDetails.clientProfile) {
      const clientProjects = userDetails.clientProfile.projects || [];
      const successfulPayments = userDetails.transactions || [];
      
      userDetails.clientProfile.totalProjects = clientProjects.length;
      userDetails.clientProfile.totalBudget = successfulPayments.reduce((sum, tx) => sum + (tx.amount || 0), 0);

      delete (userDetails.clientProfile as any).projects;
      delete (userDetails as any).transactions;
    }

    return NextResponse.json({ success: true, user: userDetails }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const updateUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  expertise: z.array(z.string()).optional(), 
  skills: z.array(z.string()).optional(), 
  qualification: z.enum(["UG", "EMPLOYED", "UNEMPLOYED"]).optional(), 
  idType: z.enum(["STUDENT_ID", "AADHAAR", "PAN", "PAY_SLIP"]).optional(),
  idNumber: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  approvalStatus: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(), 
  rejectionReason: z.string().optional().nullable(),
  
  payoutDetail: z.object({
    preferredMethod: z.enum(["UPI", "BANK"]).optional(),
    upiId: z.string().optional().nullable(),
    accountNumber: z.string().optional().nullable(),
    ifscCode: z.string().optional().nullable(),
    bankName: z.string().optional().nullable(),
    accountHolder: z.string().optional().nullable(),
  }).optional()
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { error } = await getAdmin();
    if (error){
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const body = await req.json();

    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const { 
      name, phone, bio, 
      expertise, skills, qualification, idType, idNumber, certifications, 
      approvalStatus, rejectionReason, 
      payoutDetail 
    } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { engineerProfile: true, clientProfile: true }
    });

    if (!existingUser){
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    await prisma.user.update({ where: { id: userId }, data: { name, phone, bio } });

    if (existingUser.role === "CLIENT" && expertise) {
        await prisma.clientProfile.upsert({
            where: { userId: userId },
            update: { expertise },
            create: { userId: userId, expertise }
        });
    }

    if (existingUser.role === "ENGINEER") {
        await prisma.engineerProfile.upsert({
            where: { userId: userId },
            update: { 
                skills, 
                qualification, 
                idType,
                idNumber,
                certifications,
                status: approvalStatus, 
                rejectionReason 
            },
            create: {
                userId: userId,
                skills: skills || [],
                qualification: qualification || "UG",
                status: approvalStatus || "PENDING",
                rejectionReason: rejectionReason || null,
                idType: idType || "PAN", 
                idNumber: idNumber || "ADMIN_UPSERTED",
                idFile: "ADMIN_UPSERTED",
                certifications: certifications || []
            }
        });

        if (skills && skills.length > 0){
          generateEmbedding(`Skills: ${skills.join(", ")}`)
          .then((embeddingVector) => {
            const vectorString = JSON.stringify(embeddingVector);
            return prisma.$executeRaw`
              UPDATE "EngineerProfile"
              SET embedding = ${vectorString}::vector
              WHERE "userId" = ${userId};
            `;
          })
        }

        const previousStatus = existingUser.engineerProfile?.status;
        const statusChanged = approvalStatus && approvalStatus !== previousStatus;

        if (statusChanged && ["APPROVED", "REJECTED"].includes(approvalStatus)){
          let emailSubject = "";
          let emailHtml = "";

          if (approvalStatus === "APPROVED") {
            emailSubject = "Your Account is Approved!";
            emailHtml = engineerApprovalTemplate(existingUser.name || name || "Engineer", "Your account has been approved by an administrator");
          } else if (approvalStatus === "REJECTED") {
            emailSubject = "Update on your Engineer Application";
            emailHtml = engineerRejectionTemplate(existingUser.name || name || "Engineer", rejectionReason || "No reason provided");
          }

          if (emailHtml) {
            sendEmail(existingUser.email, emailSubject, emailHtml);
          }
        }
    }

    if (payoutDetail) {
      await prisma.payoutDetail.upsert({
        where: { userId: userId },
        update: { ...payoutDetail },
        create: { 
          userId: userId, 
          preferredMethod: payoutDetail.preferredMethod || "UPI",
          upiId: payoutDetail.upiId,
          accountNumber: payoutDetail.accountNumber,
          ifscCode: payoutDetail.ifscCode,
          bankName: payoutDetail.bankName,
          accountHolder: payoutDetail.accountHolder
        }
      });
    }

    return NextResponse.json({ success: true, message: "User updated successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { error } = await getAdmin();
    if (error){
        return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      include: { engineerProfile: true, clientProfile: true, addedResources: true, milestones: true, createdKanbanTasks: true }
    });

    if (!userToDelete){
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // delete all associated files
    const filesToDelete: string[] = [];

    if (userToDelete.image) filesToDelete.push(userToDelete.image);

    if (userToDelete.role === "ENGINEER" && userToDelete.engineerProfile?.idFile) {
      filesToDelete.push(userToDelete.engineerProfile.idFile);
    }

    if (userToDelete.addedResources.length > 0) {
      userToDelete.addedResources.forEach(res => {
        if (res.type === "FILE" || res.type === "IMAGE") {
          filesToDelete.push(res.content);
        }
      });
    }

    if (userToDelete.milestones.length > 0) {
      userToDelete.milestones.forEach(m => {
        if (m.type !== "LINK" && m.content) filesToDelete.push(m.content);
      });
    }

    if (userToDelete.createdKanbanTasks.length > 0) {
      userToDelete.createdKanbanTasks.forEach(t => {
        if (t.attachments && t.attachments.length > 0) filesToDelete.push(...t.attachments);
      });
    }

    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map(url => deleteFile(url)));
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: "User and all associated data permanently deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}