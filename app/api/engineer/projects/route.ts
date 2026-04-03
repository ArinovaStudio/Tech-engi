import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";

export async function GET() {
  try {
    const { user, error } = await getEngineer();
    if (error || !user || !user.engineerProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 403 });
    }
    const assignedProjects = await prisma.project.findMany({
      where: { engineerId: user.engineerProfile.id },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    const projectsWithEarnings = assignedProjects.map((project) => {
      const { budget, ...publicProjectData } = project;
      
      const engineerEarnings = budget * 0.7;

      return { ...publicProjectData, earnings: engineerEarnings };
    });

    return NextResponse.json({ success: true, projects: projectsWithEarnings }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}