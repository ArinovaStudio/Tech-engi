import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopMatches } from "@/lib/matcher";
import sendEmail from "@/lib/email";
import { projectInvitationTemplate } from "@/lib/templates";

const EXPIRE_TIME_MS = 3 * 60 * 60 * 1000; // 3hrs

async function processRematches(activeProjects: any[]) {
  for (const project of activeProjects) {

    if (project.invitations.some((inv: any) => inv.status === "ACCEPTED")) {
      await prisma.project.update({ where: { id: project.id }, data: { status: "IN_PROGRESS" } });
      continue;
    }

    const latestInvite = project.invitations[0];
    if (!latestInvite || (Date.now() - new Date(latestInvite.createdAt).getTime()) > EXPIRE_TIME_MS) {
      
      await prisma.projectInvitation.updateMany({
        where: { projectId: project.id, status: "SENT" },
        data: { status: "EXPIRED" }
      });

      const newEngineerIds = await getTopMatches(project.id);
      
      const emailPromises = newEngineerIds.map(async (engId) => {
        await prisma.projectInvitation.create({
          data: { projectId: project.id, engineerId: engId, status: "SENT" }
        });

        const engineer = await prisma.engineerProfile.findUnique({
          where: { id: engId },
          include: { user: { select: { email: true, name: true } } }
        });

        if (engineer?.user.email) {
          const emailHtml = projectInvitationTemplate(engineer.user.name || "Engineer", project.title);
          await sendEmail(engineer.user.email, `New Match: ${project.title}`, emailHtml);
        }
      });

      await Promise.all(emailPromises); 
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const activeProjects = await prisma.project.findMany({
      where: { status: "SEARCHING", advancePaid: true },
      include: {
        invitations: { orderBy: { createdAt: "desc" } }
      }
    });

    processRematches(activeProjects).catch(console.error);

    return NextResponse.json({ success: true, message: `Matching started` }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}