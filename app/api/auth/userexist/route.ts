import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Body {
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email }: Body = await req.json();
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      success: true,
      exists: !!user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}