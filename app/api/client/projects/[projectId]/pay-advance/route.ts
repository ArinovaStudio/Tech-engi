import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import { getTopMatches } from "@/lib/matcher";
import sendEmail from "@/lib/email";
import { projectInvitationTemplate } from "@/lib/templates";

export async function POST( req: NextRequest, { params }: { params: Promise<{ projectId: string }> } ) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { client: true }
    });

    if (!project){
        return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.clientId !== user.clientProfile.id){
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (project.advancePaid) {
      return NextResponse.json({ success: false, message: "Advance already paid for this project" }, { status: 400 });
    }
    
    // payment integration left for now

    await prisma.project.update({
      where: { id: projectId },
      data: {
        advancePaid: true,
        status: "SEARCHING",
      }
    });

    const topEngineerIds: string[] = await getTopMatches(projectId);

    if (topEngineerIds && topEngineerIds.length > 0) {

      for (const engId of topEngineerIds) {
        await prisma.projectInvitation.create({
            data: {
            projectId: projectId,
            engineerId: engId,
            status: "SENT"
            }
        });

        const engineer = await prisma.engineerProfile.findUnique({
            where: { id: engId },
            include: { user: { select: { email: true, name: true } } }
        });

        if (engineer?.user.email) {
            const emailHtml = projectInvitationTemplate(engineer.user.name || "Engineer", project.title);
            await sendEmail(engineer.user.email, `New Match: ${project.title}`, emailHtml );
        }
      }
    }

    return NextResponse.json({ success: true, message: "Advance paid successfully" }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}