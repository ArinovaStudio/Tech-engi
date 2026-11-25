import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getEngineer, getProjectOwner } from "@/lib/auth";

const MIN_BUDGET = 2000;

const hireSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide a more detailed description"),
  budget: z.number().min(MIN_BUDGET, "Budget must be at least ₹2,000"),
  instruments: z.array(z.string()).default([]),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

// Projects this engineer is hiring for
export async function GET() {
  try {
    const { user, error } = await getEngineer();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { client: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        budget: true,
        status: true,
        advancePaid: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("Error in GET /api/engineer/hire:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// Step 1: engineer creates the project (DRAFT, unpaid)
export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getProjectOwner();
    if (error || !user?.clientProfile || user.role !== "ENGINEER") {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const parsed = hireSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    }

    const { title, description, budget, instruments, startDate, endDate } = parsed.data;
    if (startDate && endDate && startDate > endDate) {
      return NextResponse.json({ success: false, message: "Start date must be before end date" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        clientId: user.clientProfile.id,
        title,
        description,
        budget,
        instruments,
        startDate,
        endDate,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, projectId: project.id }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/engineer/hire:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
