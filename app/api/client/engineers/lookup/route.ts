import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const queryParam = searchParams.get("q") || searchParams.get("query") || searchParams.get("email");
    const projectId = searchParams.get("projectId");

    if (!queryParam || !queryParam.trim()) {
      return NextResponse.json({ success: false, message: "Search term is required", engineers: [] }, { status: 400 });
    }

    const cleanQuery = queryParam.trim();

    // Find users with role ENGINEER and active engineerProfile
    const matchingUsers = await prisma.user.findMany({
      where: {
        role: "ENGINEER",
        engineerProfile: {
          isNot: null,
        },
        OR: [
          {
            email: {
              contains: cleanQuery,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: cleanQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 8,
      include: {
        engineerProfile: {
          select: {
            id: true,
            status: true,
            skills: true,
            completedProjects: true,
          },
        },
      },
      orderBy: {
        lastActiveAt: "desc",
      },
    });

    if (matchingUsers.length === 0) {
      return NextResponse.json({
        success: true,
        engineers: [],
        engineer: null,
        message: "No Engineer is available with this email",
      });
    }

    let projectEngineerId: string | null = null;
    let projectInvitations: { engineerId: string | null; status: string }[] = [];

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { engineerId: true },
      });
      projectEngineerId = project?.engineerId || null;

      projectInvitations = await prisma.projectInvitation.findMany({
        where: { projectId },
        select: { engineerId: true, status: true },
      });
    }

    const formattedEngineers = matchingUsers.map((targetUser) => {
      const isAssigned = Boolean(projectEngineerId && targetUser.engineerProfile?.id === projectEngineerId);
      const inv = projectInvitations.find((i) => i.engineerId === targetUser.engineerProfile?.id);
      const isInvited = Boolean(inv && ["SENT", "PENDING_ADMIN"].includes(inv.status));

      return {
        id: targetUser.id,
        engineerProfileId: targetUser.engineerProfile?.id || "",
        name: targetUser.name || "Engineer",
        email: targetUser.email,
        image: targetUser.image || null,
        skills: targetUser.engineerProfile?.skills || [],
        status: targetUser.engineerProfile?.status || "PENDING",
        completedProjects: targetUser.engineerProfile?.completedProjects || 0,
        alreadyAssigned: isAssigned,
        alreadyInvited: isInvited,
      };
    });

    return NextResponse.json({
      success: true,
      engineers: formattedEngineers,
      engineer: formattedEngineers[0] || null,
      message: null,
    });
  } catch (err: unknown) {
    console.error("ENGINEER_LOOKUP_ERROR", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Internal server error", engineers: [] },
      { status: 500 }
    );
  }
}
