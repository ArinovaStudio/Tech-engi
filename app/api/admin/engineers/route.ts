import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { error } = await getAdmin();
    if (error){
        return NextResponse.json({ success: false, message: error }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") as any;

    const engineers = await prisma.engineerProfile.findMany({
      where: statusFilter ? { status: statusFilter } : {},
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        }
      },
      orderBy: { userId: 'asc' }
    });

    return NextResponse.json({ success: true, engineers }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}