import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    
    const { user, error } = await getClient();
    const userId = user?.clientProfile?.id;

    if (error || !userId) {
      return NextResponse.json(
        { success: false, message: error || "Unauthorized" },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        clientId: userId,
        status: "IN_REVIEW",
      },
      include: {
        engineer: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, projects },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}