import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import sendEmail from "@/lib/email";
import { clientProjectInvitationEmailTemplate } from "@/lib/templates";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: user.clientProfile.id,
      },
      include: {
        engineer: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    const invitations = await prisma.projectInvitation.findMany({
      where: {
        projectId,
      },
      include: {
        engineer: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
    const inviteUrl = `${baseUrl}/invite/project/${projectId}`;

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        budget: project.budget,
        status: project.status,
        advancePaid: project.advancePaid,
        assignedEngineer: project.engineer
          ? {
              id: project.engineer.id,
              name: project.engineer.user.name,
              email: project.engineer.user.email,
              image: project.engineer.user.image,
            }
          : null,
      },
      inviteUrl,
      invitations,
    });
  } catch (err: unknown) {
    console.error("GET_CLIENT_INVITATIONS_ERROR", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        clientId: user.clientProfile.id,
      },
      include: {
        engineer: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.engineerId) {
      return NextResponse.json(
        {
          success: false,
          message: "This project already has an assigned engineer. Please unassign or contact admin if you need to change engineers.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { type, email, note } = body;

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
    const inviteUrl = `${baseUrl}/invite/project/${projectId}`;

    // Link generation mode
    if (type === "LINK") {
      // If project is DRAFT and advance is paid, ensure it is in SEARCHING so it can be accepted
      if (project.status === "DRAFT" && project.advancePaid) {
        await prisma.project.update({
          where: { id: projectId },
          data: { status: "SEARCHING" },
        });
      }

      return NextResponse.json({
        success: true,
        inviteUrl,
        message: "Invite link generated successfully",
      });
    }

    // Email invitation mode
    if (type === "EMAIL") {
      const { emails } = body;
      const emailList: string[] = Array.isArray(emails)
        ? emails.filter((e) => typeof e === "string" && e.includes("@"))
        : typeof email === "string" && email.includes("@")
        ? [email]
        : [];

      if (emailList.length === 0) {
        return NextResponse.json(
          { success: false, message: "Please select at least 1 engineer to invite." },
          { status: 400 }
        );
      }

      if (emailList.length > 3) {
        return NextResponse.json(
          { success: false, message: "You can select a maximum of 3 engineers at a time." },
          { status: 400 }
        );
      }

      // If project is in DRAFT status and advance is paid, mark as SEARCHING
      if (project.status === "DRAFT" && project.advancePaid) {
        await prisma.project.update({
          where: { id: projectId },
          data: { status: "SEARCHING" },
        });
      }

      const engineerEarnings = Math.floor(project.budget * 0.7);
      const clientName = user.name || "Client";
      const emailHtml = clientProjectInvitationEmailTemplate(
        clientName,
        project.title,
        project.description,
        engineerEarnings,
        inviteUrl,
        note
      );

      const results = [];
      for (const rawEmail of emailList) {
        const normalizedEmail = rawEmail.toLowerCase().trim();

        const targetUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { engineerProfile: true },
        });

        if (targetUser?.engineerProfile) {
          const existingInvitation = await prisma.projectInvitation.findUnique({
            where: {
              projectId_engineerId: {
                projectId,
                engineerId: targetUser.engineerProfile.id,
              },
            },
          });

          if (existingInvitation) {
            if (existingInvitation.status !== "ACCEPTED") {
              await prisma.projectInvitation.update({
                where: { id: existingInvitation.id },
                data: { status: "SENT", updatedAt: new Date() },
              });
            }
          } else {
            await prisma.projectInvitation.create({
              data: {
                projectId,
                engineerId: targetUser.engineerProfile.id,
                status: "SENT",
              },
            });
          }
        }

        const emailSent = await sendEmail(
          normalizedEmail,
          `Project Invitation: ${project.title} from ${clientName}`,
          emailHtml
        );

        results.push({ email: normalizedEmail, sent: emailSent });
      }

      return NextResponse.json({
        success: true,
        message: `Invitations sent successfully to ${emailList.length} engineer${emailList.length > 1 ? "s" : ""}!`,
        inviteUrl,
        results,
      });
    }

    return NextResponse.json({ success: false, message: "Invalid invitation type" }, { status: 400 });
  } catch (err: unknown) {
    console.error("POST_CLIENT_INVITATION_ERROR", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json({ success: false, message: "Invitation ID required" }, { status: 400 });
    }

    const invitation = await prisma.projectInvitation.findUnique({
      where: { id: invitationId },
      include: { project: true },
    });

    if (!invitation || invitation.projectId !== projectId) {
      return NextResponse.json({ success: false, message: "Invitation not found" }, { status: 404 });
    }

    if (invitation.project.clientId !== user.clientProfile.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (invitation.status === "ACCEPTED") {
      return NextResponse.json(
        { success: false, message: "Cannot revoke an invitation that has already been accepted" },
        { status: 400 }
      );
    }

    await prisma.projectInvitation.delete({
      where: { id: invitationId },
    });

    return NextResponse.json({
      success: true,
      message: "Invitation revoked successfully",
    });
  } catch (err: unknown) {
    console.error("DELETE_CLIENT_INVITATION_ERROR", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
