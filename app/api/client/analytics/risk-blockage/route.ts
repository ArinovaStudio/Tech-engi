import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const clientId = searchParams.get("clientId");

    let whereClause = {};

    if (projectId) {
      whereClause = { projectId };
    } else if (clientId) {
      whereClause = { clientId };
    }


    const risks = await prisma.riskBlockage.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" }
    });


    return NextResponse.json({ success: true, data: risks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch risks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
    const SOCKET_PORT = process.env.NEXT_PUBLIC_SOCKET_PORT;
    const { projectId, clientId, riskTitle } = await req.json();

    const risk = await prisma.riskBlockage.create({
      data: {
        projectId,
        clientId,
        riskTitle
      }
    });

    await fetch(`${SOCKET_URL}:${SOCKET_PORT}/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        clientId: clientId,
        notification: {
          title: "Risk blockage",
          message: `Risk alert: "${riskTitle}" has been added to your project. Please review and take action if needed.`,
          section: "/project",
          createdAt: new Date(),
          isRead: false,
        },
      }),
    });

    return NextResponse.json({ success: true, data: risk });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create risk" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    await prisma.riskBlockage.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: "Risk deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, riskTitle } = await req.json();

    const risk = await prisma.riskBlockage.update({
      where: { id },
      data: { riskTitle }
    });

    return NextResponse.json({ success: true, data: risk });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update risk" }, { status: 500 });
  }
}