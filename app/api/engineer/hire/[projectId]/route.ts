import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";
import { buildHirePreview } from "@/lib/hirePreview";

// Before payment: blurred preview data only. After verified payment: real profiles.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error } = await getEngineer();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const project = await prisma.project.findFirst({
      where: { id: projectId, client: { userId: user.id } },
    });
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    const base = {
      id: project.id,
      title: project.title,
      description: project.description,
      budget: project.budget,
      instruments: project.instruments,
      status: project.status,
    };

    if (!project.advancePaid) {
      const preview = buildHirePreview(project.id, project.instruments, project.budget);
      return NextResponse.json({ success: true, unlocked: false, project: base, preview });
    }

    const invitations = await prisma.projectInvitation.findMany({
      where: { projectId, engineerId: { not: null } },
      orderBy: { createdAt: "desc" },
      include: {
        engineer: {
          select: {
            id: true,
            skills: true,
            completedProjects: true,
            yearsOfExperience: true,
            qualification: true,
            github: true,
            linkedin: true,
            portfolio: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      unlocked: true,
      project: base,
      engineers: invitations.map((i) => ({ invitationId: i.id, status: i.status, ...i.engineer })),
    });
  } catch (error) {
    console.error("Error in GET /api/engineer/hire/[projectId]:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
