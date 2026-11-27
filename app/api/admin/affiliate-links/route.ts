import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AFFILIATE_CODE_PATTERN, generateAffiliateCode } from "@/lib/affiliate";

const commissionRefine = (v: { commissionType?: string; commissionValue?: number }) =>
  !(v.commissionType === "PERCENTAGE" && v.commissionValue !== undefined && v.commissionValue > 100);

const createSchema = z
  .object({
    ownerId: z.string().uuid("Select a client or engineer."),
    commissionType: z.enum(["PERCENTAGE", "FIXED"]),
    commissionValue: z.number().positive("Commission must be greater than 0."),
    code: z.string().trim().toUpperCase().regex(AFFILIATE_CODE_PATTERN, "Use 4–32 letters, numbers, hyphens or underscores.").optional(),
  })
  .refine(commissionRefine, "Percentage cannot exceed 100.");

const updateSchema = z
  .object({
    id: z.string().uuid(),
    commissionType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
    commissionValue: z.number().positive().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(commissionRefine, "Percentage cannot exceed 100.");

export async function GET() {
  const { error } = await getAdmin();
  if (error) return NextResponse.json({ success: false, message: error }, { status: 401 });

  try {
    const links = await prisma.affiliateLink.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        code: true,
        commissionType: true,
        commissionValue: true,
        isActive: true,
        createdAt: true,
        owner: { select: { id: true, name: true, email: true, role: true } },
        _count: { select: { referredUsers: true, earnings: true } },
        earnings: { select: { amount: true } },
      },
    });
    return NextResponse.json({
      success: true,
      links: links.map(({ earnings, ...l }) => ({
        ...l,
        totalEarned: Math.round(earnings.reduce((s, e) => s + e.amount, 0) * 100) / 100,
      })),
    });
  } catch (e) {
    console.error("Failed to load affiliate links:", e);
    return NextResponse.json({ success: false, message: "Could not load affiliate links." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await getAdmin();
  if (error || !user) return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const { ownerId, commissionType, commissionValue, code } = parsed.data;

  const owner = await prisma.user.findUnique({ where: { id: ownerId }, select: { role: true } });
  if (!owner || (owner.role !== "CLIENT" && owner.role !== "ENGINEER")) {
    return NextResponse.json({ success: false, message: "Owner must be a client or an engineer." }, { status: 400 });
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const link = await prisma.affiliateLink.create({
        data: {
          ownerId,
          commissionType,
          commissionValue,
          code: code ?? generateAffiliateCode(),
          createdById: user.id,
        },
        select: { id: true, code: true },
      });
      return NextResponse.json({ success: true, link }, { status: 201 });
    } catch (e) {
      const dup = typeof e === "object" && e !== null && "code" in e && e.code === "P2002";
      if (dup && code) {
        return NextResponse.json({ success: false, message: "That code already exists." }, { status: 409 });
      }
      if (!dup) {
        console.error("Failed to create affiliate link:", e);
        return NextResponse.json({ success: false, message: "Could not create affiliate link." }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ success: false, message: "Could not generate a unique code. Try again." }, { status: 500 });
}

export async function PATCH(request: NextRequest) {
  const { error } = await getAdmin();
  if (error) return NextResponse.json({ success: false, message: error }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body." }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const { id, ...data } = parsed.data;
  try {
    const existing = await prisma.affiliateLink.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Link not found." }, { status: 404 });
    const type = data.commissionType ?? existing.commissionType;
    const value = data.commissionValue ?? existing.commissionValue;
    if (type === "PERCENTAGE" && value > 100) {
      return NextResponse.json({ success: false, message: "Percentage cannot exceed 100." }, { status: 400 });
    }
    const link = await prisma.affiliateLink.update({ where: { id }, data });
    return NextResponse.json({ success: true, link });
  } catch (e) {
    console.error("Failed to update affiliate link:", e);
    return NextResponse.json({ success: false, message: "Could not update affiliate link." }, { status: 500 });
  }
}
