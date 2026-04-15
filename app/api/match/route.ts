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

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, clientId: true, title: true, advancePaid: true, engineerId: true }
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

    // Update status
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "SEARCHING" }
    });

    console.log("Starting matching for project:", projectId);

    const topEngineerIds: string[] = await getTopMatches(projectId);

    console.log("Top engineer IDs returned:", topEngineerIds);

    if (topEngineerIds && topEngineerIds.length > 0) {
      const invitationPromises = topEngineerIds.map(async (engId) => {
        try {
          await prisma.projectInvitation.createMany({
            data: topEngineerIds.map((engId) => ({
              projectId,
              engineerId: engId,
              status: "SENT"
            })),
            skipDuplicates: true
          });

          const engineer = await prisma.engineerProfile.findUnique({
            where: { id: engId },
            include: { user: { select: { email: true, name: true } } }
          });

          if (engineer?.user?.email) {
            const emailHtml = projectInvitationTemplate(engineer.user.name || "Engineer", project.title);
            await sendEmail(engineer.user.email, `New Match: ${project.title}`, emailHtml);
            console.log(`Email sent to engineer ${engId}`);
          }
        } catch (invErr) {
          console.error(`Failed to process invitation for engineer ${engId}:`, invErr);
        }
      });

      await Promise.all(invitationPromises);
    }

    return NextResponse.json({
      success: true,
      message: "Matching completed",
      matchedEngineers: topEngineerIds.length
    });

  } catch (err: any) {
    console.error("=== MATCH API ERROR ===");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      error: err.message   // ← This will help you see the real error
    }, { status: 500 });
  }
}