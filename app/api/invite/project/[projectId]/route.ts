import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        description: true,
        budget: true,
        instruments: true,
        priority: true,
        status: true,
        advancePaid: true,
        createdAt: true,
        startDate: true,
        endDate: true,
        engineerId: true,
        client: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    const earnings = Math.floor(project.budget * 0.7);
    const isAssigned = project.engineerId !== null;

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        instruments: project.instruments,
        priority: project.priority,
        status: project.status,
        advancePaid: project.advancePaid,
        startDate: project.startDate,
        endDate: project.endDate,
        createdAt: project.createdAt,
        clientName: project.client?.user?.name || "Client",
        clientImage: project.client?.user?.image || null,
        earnings,
        isAssigned,
      },
    });
  } catch (err: unknown) {
    console.error("GET_INVITE_PROJECT_ERROR", err);
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
