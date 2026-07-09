import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userType, domain, stage, goal, challenge, name, email } = body;

    if (
      !userType?.trim() ||
      !domain?.trim() ||
      !stage?.trim() ||
      !goal?.trim() ||
      !challenge?.trim() ||
      !name?.trim() ||
      !email?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        userType,
        domain,
        stage,
        goal,
        challenge,
        name,
        email,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead created successfully.",
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead Creation Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const leadId = sp.get("id");

    if (leadId) {
      const lead = await prisma.lead.findUnique({
        where: {
          id: leadId,
        },
      });
      return NextResponse.json({ success: true, lead }, { status: 200 });
    }

    const leads = await prisma.lead.findMany();
    return NextResponse.json({ success: true, leads }, { status: 200 });
  } catch (error) {
    console.error("Lead Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const leadId = sp.get("id");

    if (leadId) {
      const lead = await prisma.lead.delete({
        where: {
          id: leadId,
        },
      });
      return NextResponse.json({ success: true, lead }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, message: "Lead id is required." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Lead Deletion Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}