import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";

// Search approved engineers by name or email so the project owner can invite them.
// Profiles are only visible once the advance is paid (same rule as the matched list).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { user, error } = await getEngineer();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized", engineers: [] }, { status: 401 });
    }

    const { projectId } = await params;
    const q = (new URL(req.url).searchParams.get("q") || "").trim();
    if (q.length < 2) {
      return NextResponse.json({ success: true, engineers: [] });
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, client: { userId: user.id } },
      select: { advancePaid: true, engineerId: true },
    });
    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found", engineers: [] }, { status: 404 });
    }
    if (!project.advancePaid) {
      return NextResponse.json({ success: false, message: "Pay the advance to search engineers", engineers: [] }, { status: 400 });
    }

    const users = await prisma.user.findMany({
      where: {
        role: "ENGINEER",
        id: { not: user.id },
        engineerProfile: { is: { status: "APPROVED" } },
        OR: [
          { email: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 8,
      orderBy: { lastActiveAt: "desc" },
      select: {
        name: true,
        email: true,
        image: true,
        engineerProfile: {
          select: {
            id: true,
            skills: true,
            completedProjects: true,
            yearsOfExperience: true,
            qualification: true,
            github: true,
            linkedin: true,
            portfolio: true,
          },
        },
      },
    });

    const profileIds = users.map((u) => u.engineerProfile!.id);
    const invitations = await prisma.projectInvitation.findMany({
      where: { projectId, engineerId: { in: profileIds } },
      select: { id: true, engineerId: true, status: true },
    });

    const engineers = users.map((u) => {
      const p = u.engineerProfile!;
      const inv = invitations.find((i) => i.engineerId === p.id);
      return {
        engineerId: p.id,
        invitationId: inv?.id ?? null,
        status: inv?.status ?? null,
        assigned: project.engineerId === p.id,
        name: u.name,
        email: u.email,
        image: u.image,
        skills: p.skills,
        completedProjects: p.completedProjects,
        yearsOfExperience: p.yearsOfExperience,
        qualification: p.qualification,
        github: p.github,
        linkedin: p.linkedin,
        portfolio: p.portfolio,
      };
    });

    return NextResponse.json({ success: true, engineers });
  } catch (error) {
    console.error("Error in GET /api/engineer/hire/[projectId]/search:", error);
    return NextResponse.json({ success: false, message: "Internal server error", engineers: [] }, { status: 500 });
  }
}
