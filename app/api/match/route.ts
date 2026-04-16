import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import { getTopMatches } from "@/lib/matcher";
import sendEmail from "@/lib/email";
import { projectInvitationTemplate } from "@/lib/templates";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ success: false, message: "Missing project ID" }, { status: 400 });
    }

    // Fetch full project details
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        clientId: true,
        title: true,
        description: true,
        budget: true,
        advancePaid: true,
        engineerId: true,
        status: true,
      }
    });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.clientId !== user.clientProfile.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (!project.advancePaid) {
      return NextResponse.json({ success: false, message: "Advance payment required" }, { status: 400 });
    }

    if (project.engineerId) {
      return NextResponse.json({ success: false, message: "Project already assigned" }, { status: 400 });
    }

    // Update status to SEARCHING
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "SEARCHING" }
    });

    const topEngineerIds: string[] = await getTopMatches(projectId);

    if (topEngineerIds && topEngineerIds.length > 0) {
      // Calculate 70% for engineer
      const engineerEarnings = Math.floor(project.budget * 0.7);

      const invitationPromises = topEngineerIds.map(async (engId) => {
        try {
          // Create invitation
          await prisma.projectInvitation.create({
            data: {
              projectId,
              engineerId: engId,
              status: "SENT"
            }
          });

          // Get engineer details
          const engineer = await prisma.engineerProfile.findUnique({
            where: { id: engId },
            include: { 
              user: { 
                select: { email: true, name: true } 
              } 
            }
          });

          if (engineer?.user?.email) {
            const emailHtml = projectInvitationTemplate(
              engineer.user.name || "Engineer",
              project.title,
              project.description || "No description provided.",
              engineerEarnings
            );

            await sendEmail(
              engineer.user.email, 
              `New Project Match: ${project.title}`, 
              emailHtml
            );

            console.log(`Invitation email sent to engineer ${engId}`);
          }
        } catch (invErr) {
          console.error(`Failed for engineer ${engId}:`, invErr);
        }
      });

      await Promise.all(invitationPromises);
    }

    return NextResponse.json({
      success: true,
      message: "Matching completed successfully",
      matchedEngineers: topEngineerIds.length,
    });

  } catch (err: any) {
    console.error("=== MATCH API ERROR ===", err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: err.message
    }, { status: 500 });
  }
}