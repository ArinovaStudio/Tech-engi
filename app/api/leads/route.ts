import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            userType,
            domain,
            blocker,
            stage,
            budget,
            timeline,
            name,
            email,
            phone,
            goal,
        } = body;

        if (
            !userType?.trim() ||
            !domain?.trim() ||
            !blocker?.trim() ||
            !stage?.trim() ||
            !budget?.trim() ||
            !timeline?.trim() ||
            !name?.trim() ||
            !email?.trim() ||
            !goal?.trim()
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
                blocker,
                stage,
                budget,
                timeline,
                name,
                email,
                phone,
                goal,
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