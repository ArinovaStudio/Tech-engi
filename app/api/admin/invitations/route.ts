import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAdmin();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const whereClause: any = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const invitations = await prisma.projectInvitation.findMany({
      where: whereClause,
      include: {
        project: { 
          select: { id: true, title: true, budget: true, status: true } 
        },
        engineer: { 
          include: { user: { select: { name: true, email: true, image: true } } } 
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const formattedInvitations = invitations.map(inv => ({
      ...inv,
      engineerCut: inv.project.budget * 0.7,
      platformProfit: inv.project.budget * 0.3
    }));

    return NextResponse.json({ success: true, invitations: formattedInvitations }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}