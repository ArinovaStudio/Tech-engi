import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import { z } from "zod";

export async function GET( req: NextRequest, { params }: { params: Promise<{ projectId: string }> } ) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        engineer: { include: { user: { select: { name: true, image: true, email: true } } } },
        resources: { orderBy: { createdAt: "desc" } },
        deletionRequest: true,
        invitations: {
          include: { engineer: { include: { user: { select: { name: true, image: true, email: true } } } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!project){ 
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.clientId !== user.clientProfile.id){
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const acceptedInvitation = project.invitations.find(inv => inv.status === "ACCEPTED");
    const filteredInvitations = acceptedInvitation ? [acceptedInvitation] : project.invitations.filter(inv => inv.status === "SENT" || inv.status === "EXPIRED");

    return NextResponse.json({ success: true, project: { ...project, invitations: filteredInvitations } }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const updateProjectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide a more detailed description"),
  budget: z.number().min(500, "Minimum budget must be ₹500"), 
  instruments: z.array(z.string()).default([]),
});

export async function PUT( req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { user, error } = await getClient();
    if (error || !user || !user.clientProfile){
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const existingProject = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existingProject){
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (existingProject.clientId !== user.clientProfile.id){
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validation = updateProjectSchema.safeParse(body);
    
    if (!validation.success){
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        title: validation.data.title,
        description: validation.data.description,
        budget: validation.data.budget,
        instruments: validation.data.instruments,
      }
    });

    return NextResponse.json({ success: true, message: "Project updated successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE( req: NextRequest, { params }: { params: Promise<{ projectId: string }> } ) {
  try {
    const { user, error } = await getClient();
    if (error || !user || !user.clientProfile){
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const { reason } = body;

    const project = await prisma.project.findUnique({ where: { id: projectId }, include: { deletionRequest: true } });

    if (!project){
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.clientId !== user.clientProfile.id){
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (project.deletionRequest && project.deletionRequest.status === "PENDING") {
      return NextResponse.json({ success: false, message: "A deletion request is already pending" }, { status: 400 });
    }

    
    if (!reason || reason.length < 10) { // 10 char reason
      return NextResponse.json({ success: false, message: "A valid reason is required to delete a project" }, { status: 400 });
    }

    await prisma.projectDeletionRequest.upsert({
      where: { projectId },
      update: { reason: body.reason, status: "PENDING" },
      create: { projectId, reason: body.reason }
    });

    return NextResponse.json({ success: true, message: "Deletion request sent to admin for review" }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}