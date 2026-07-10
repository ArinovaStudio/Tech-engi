import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, number, email, domain, challenge, timeline, hear } = body;

    if (
      !name?.trim() ||
      !number?.trim() ||
      !email?.trim() ||
      !domain?.trim() ||
      !challenge?.trim() ||
      !timeline?.trim() ||
      !hear?.trim()
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
        name: name.trim(),
        number: number.trim(),
        email: email.trim(),
        domain: domain.trim(),
        challenge: challenge.trim(),
        timeline: timeline.trim(),
        hear: hear.trim(),
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

      if (!lead) {
        return NextResponse.json(
          {
            success: false,
            message: "Lead not found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          lead,
        },
        { status: 200 }
      );
    }

    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        leads,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lead Fetch Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const leadId = sp.get("id");

    if (!leadId) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead id is required.",
        },
        { status: 400 }
      );
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
    });

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found.",
        },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.delete({
      where: {
        id: leadId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Lead deleted successfully.",
        lead,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lead Deletion Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}