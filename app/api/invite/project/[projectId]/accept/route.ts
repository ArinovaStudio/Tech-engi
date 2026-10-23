import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";
import sendEmail from "@/lib/email";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error } = await getEngineer(true);
    if (error || !user?.engineerProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized as engineer" }, { status: 403 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        client: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (!project.advancePaid) {
      return NextResponse.json(
        {
          success: false,
          message: "This project is awaiting advance payment from the client before an engineer can be assigned.",
        },
        { status: 400 }
      );
    }

    if (project.engineerId) {
      if (project.engineerId === user.engineerProfile.id) {
        return NextResponse.json({ success: true, message: "You are already assigned to this project" });
      }
      return NextResponse.json(
        { success: false, message: "This project has already been assigned to another engineer." },
        { status: 400 }
      );
    }

    // Check if engineer already has an active project in progress
    const activeProject = await prisma.project.findFirst({
      where: {
        engineerId: user.engineerProfile.id,
        status: { in: ["IN_PROGRESS", "IN_REVIEW"] },
      },
    });

    if (activeProject) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot accept this project because you already have an active project in progress.",
        },
        { status: 400 }
      );
    }

    // Assign engineer to project and update status to IN_PROGRESS
    await prisma.project.update({
      where: { id: projectId },
      data: {
        engineerId: user.engineerProfile.id,
        status: "IN_PROGRESS",
      },
    });

    // Upsert invitation record for this engineer
    await prisma.projectInvitation.upsert({
      where: {
        projectId_engineerId: {
          projectId,
          engineerId: user.engineerProfile.id,
        },
      },
      update: {
        status: "ACCEPTED",
      },
      create: {
        projectId,
        engineerId: user.engineerProfile.id,
        status: "ACCEPTED",
      },
    });

    // Expire other pending invitations for this project
    await prisma.projectInvitation.updateMany({
      where: {
        projectId,
        engineerId: { not: user.engineerProfile.id },
        status: { in: ["SENT", "PENDING_ADMIN"] },
      },
      data: {
        status: "EXPIRED",
      },
    });

    // Notify client via email
    if (project.client?.user?.email) {
      const engineerName = user.name || "An engineer";
      await sendEmail(
        project.client.user.email,
        `Engineer Assigned: ${project.title}`,
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 12px;">
          <h2 style="color: #10b981;">Engineer Accepted Your Project! 🎉</h2>
          <p>Great news! <strong>${engineerName}</strong> has accepted your invitation for <strong>${project.title}</strong>.</p>
          <p>Your project is now in progress. You can communicate with your engineer, view milestones, and track progress from your dashboard.</p>
          <div style="margin: 25px 0;">
            <a href="${process.env.NEXTAUTH_URL || ''}/client" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Go to Project Dashboard
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">Tech-Engi Team</p>
        </div>
        `
      );
    }

    return NextResponse.json({
      success: true,
      message: "Congratulations! You have accepted the project and are now assigned.",
    });
  } catch (err: unknown) {
    console.error("ACCEPT_PROJECT_INVITATION_ERROR", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
