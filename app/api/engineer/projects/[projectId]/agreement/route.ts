import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";
import z from "zod";

const agreementSchema = z.object({
  action: z.enum(["accept", "decline"])
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { user, error } = await getEngineer();
    if (error || !user?.engineerProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await params;
    const body = await req.json();
    const validation = agreementSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.engineerId !== user.engineerProfile.id) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const status = validation.data.action === "accept" ? "ACCEPTED" : "DECLINED";

    const agreement = await prisma.projectAgreement.upsert({
      where: {
        projectId_engineerId: {
          projectId,
          engineerId: user.engineerProfile.id
        }
      },
      update: { status, respondedAt: new Date() },
      create: {
        projectId,
        engineerId: user.engineerProfile.id,
        status,
        respondedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, agreement }, { status: 200 });

  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}