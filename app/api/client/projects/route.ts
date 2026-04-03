import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import { uploadFile } from "@/lib/uploads";
import { z } from "zod";

export async function GET() {
  try {
    const { user, error } = await getClient();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    if (!user.clientProfile) {
      return NextResponse.json({ success: false, message: "Please complete your profile first" }, { status: 403 });
    }

    const projects = await prisma.project.findMany({
      where: { clientId: user.clientProfile.id },
      include: {
        engineer: {
          include: { user: { select: { name: true, image: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, projects }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

const projectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Please provide a more detailed description"),
  budget: z.number().min(500, "Minimum budget must be ₹500"), 
  instruments: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getClient();
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    if (!user.clientProfile) {
      return NextResponse.json({ success: false, message: "Please complete your profile first" }, { status: 403 });
    }

    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const budget = Number(formData.get("budget"));
    const instrumentsRaw = formData.get("instruments") as string;
    const instruments = instrumentsRaw ? JSON.parse(instrumentsRaw) : [];

    const validation = projectSchema.safeParse({ title, description, budget, instruments });
    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const files = formData.getAll("files") as File[];
    
    if (files.length > 5) {
      return NextResponse.json({ success: false, message: "Maximum 5 files allowed" }, { status: 400 });
    }

    const roadmapFileUrls: string[] = [];
    
    for (const file of files) {
      if (file.size > 0) { 
        const fileUrl = await uploadFile(file, "projects");
        roadmapFileUrls.push(fileUrl);
      }
    }

    await prisma.project.create({
      data: {
        clientId: user.clientProfile.id,
        title: validation.data.title,
        description: validation.data.description,
        budget: validation.data.budget,
        instruments: validation.data.instruments,
        roadmapFiles: roadmapFileUrls,
        status: "AWAITING_ADVANCE"
      }
    });

    return NextResponse.json({ success: true, message: "Project created successfully" }, { status: 201 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}