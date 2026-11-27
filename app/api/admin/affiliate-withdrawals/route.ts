import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { error } = await getAdmin();
  if (error) return NextResponse.json({ success: false, message: error }, { status: 401 });

  const withdrawals = await prisma.affiliateWithdrawal.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: { user: { select: { name: true, email: true, role: true } } },
  });
  return NextResponse.json({ success: true, withdrawals });
}

const schema = z.object({
  id: z.string().uuid(),
  status: z.enum(["PAID", "REJECTED"]),
  note: z.string().trim().max(300).optional(),
});

export async function PATCH(request: NextRequest) {
  const { error } = await getAdmin();
  if (error) return NextResponse.json({ success: false, message: error }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const { id, status, note } = parsed.data;

  // Only a PENDING request can be settled; a REJECTED one frees the balance again.
  const result = await prisma.affiliateWithdrawal.updateMany({
    where: { id, status: "PENDING" },
    data: { status, note, processedAt: new Date() },
  });
  if (result.count === 0) {
    return NextResponse.json({ success: false, message: "Request not found or already processed." }, { status: 409 });
  }
  return NextResponse.json({ success: true });
}
