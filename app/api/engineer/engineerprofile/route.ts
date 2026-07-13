import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEngineer } from "@/lib/auth";
import { getUser } from "@/lib/auth";

export async function GET() {
    try {
        const engineer = await getEngineer();
        if (!engineer.user) {
            return NextResponse.json({ success: false, error: engineer.error }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: engineer }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: "Failed to fetch engineer profile" }, { status: 500 });
    }
}