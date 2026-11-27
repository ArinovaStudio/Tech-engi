import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { error } = await getAdmin();
  if (error) return NextResponse.json({ success: false, message: error }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role")?.toUpperCase();
  const search = searchParams.get("search")?.trim();

  const users = await prisma.user.findMany({
    where: {
      role: role === "CLIENT" || role === "ENGINEER" ? role : { in: ["CLIENT", "ENGINEER"] },
      isSuspended: false,
      ...(search
        ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
        : {}),
    },
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
    take: 20,
  });
  return NextResponse.json({ success: true, users });
}
