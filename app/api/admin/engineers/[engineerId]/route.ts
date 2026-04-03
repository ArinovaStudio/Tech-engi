import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";
import { z } from "zod";
import { engineerApprovalTemplate, engineerRejectionTemplate } from "@/lib/templates";
import sendEmail from "@/lib/email";

export async function GET( req: NextRequest, { params }: { params: Promise<{ engineerId: string }> } ) {
  try {
    const { error } = await getAdmin();
    if (error){
        return NextResponse.json({ success: false, message: error }, { status: 403 });
    }

    const { engineerId } = await params;

    const engineer = await prisma.engineerProfile.findUnique({
      where: { id: engineerId },
      include: {
        user: true,
        assignedWork: true
      }
    });

    if (!engineer){
        return NextResponse.json({ success: false, message: "Engineer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, engineer }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const statusSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
  rejectionReason: z.string().optional(),
});


export async function PATCH( req: NextRequest, { params }: { params: Promise<{ engineerId: string }> } ) {
  try {
    const { error } = await getAdmin();
    if (error){
        return NextResponse.json({ success: false, message: error }, { status: 403 });
    }

    const { engineerId } = await params;
    const body = await req.json();

    const validation = statusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const { status, rejectionReason } = validation.data;

    const updatedEngineer = await prisma.engineerProfile.update({
      where: { id: engineerId },
      data: { status, rejectionReason: status === "REJECTED" ? rejectionReason : null },
      include: { user: { select: { email: true, name: true } } }
    });

    const userEmail = updatedEngineer.user.email;
    const userName = updatedEngineer.user.name || "Engineer";

    let emailSubject = "";
    let emailHtml = "";

    if (status === "APPROVED") {
      emailSubject = "Your Account is Approved!";
      emailHtml = engineerApprovalTemplate(userName);
    } else if (status === "REJECTED") {
      emailSubject = "Update on your Engineer Application";
      emailHtml = engineerRejectionTemplate(userName, rejectionReason || "No reason provided");
    }

    if (emailHtml) {
      await sendEmail(userEmail, emailSubject, emailHtml);
    }

    return NextResponse.json({ success: true, message: `Engineer ${status.toLowerCase()} successfully` }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}