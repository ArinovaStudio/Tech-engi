import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Record a visit
export async function POST(req: Request) {
  try {
    const { ref } = await req.json();

    if (!ref || typeof ref !== "string" || ref.length > 50) {
      return NextResponse.json({ error: "Invalid ref" }, { status: 400 });
    }

    const visit = await prisma.visit.create({
      data: { ref: ref.trim().toLowerCase() },
    });

    return NextResponse.json({ success: true, id: visit.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const stats = await prisma.visit.groupBy({
    by: ["ref"],
    _count: { ref: true },
    _max: { createdAt: true },
    orderBy: { _count: { ref: "desc" } },
  });

  return NextResponse.json(
    stats.map((s) => ({
      ref: s.ref,
      visits: s._count.ref,
      latestVisit: s._max.createdAt,
    }))
  );
}

export async function DELETE(req: Request) {
  try {
    const ref = new URL(req.url).searchParams.get("ref");

    if (!ref) {
      return NextResponse.json({ error: "ref is required" }, { status: 400 });
    }

    const result = await prisma.visit.deleteMany({
      where: { ref: ref.trim().toLowerCase() },
    });

    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}