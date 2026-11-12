import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdmin } from "@/lib/auth";
import { PROMO_CODE_PATTERN } from "@/lib/promoCodes";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  code: z.string().trim().toUpperCase().regex(
    PROMO_CODE_PATTERN,
    "Use 3–32 letters, numbers, hyphens, or underscores.",
  ),
  percentage: z.number().int().min(1).max(99),
});

export async function GET() {
  const { error } = await getAdmin();
  if (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 401 },
    );
  }

  try {
    const promoCodes = await prisma.promoCode.findMany({
      select: {
        id: true,
        code: true,
        percentage: true,
        isActive: true,
        createdAt: true,
        createdBy: { select: { name: true, email: true } },
        _count: { select: { redemptions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, promoCodes });
  } catch (error) {
    console.error("Failed to load promo codes:", error);
    return NextResponse.json(
      { success: false, message: "Could not load promo codes." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await getAdmin();
  if (error || !user) {
    return NextResponse.json(
      { success: false, message: error || "Unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const validation = createSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, message: validation.error.issues[0]?.message },
      { status: 400 },
    );
  }

  try {
    const promoCode = await prisma.promoCode.create({
      data: {
        ...validation.data,
        createdById: user.id,
      },
      select: {
        id: true,
        code: true,
        percentage: true,
        isActive: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ success: true, promoCode }, { status: 201 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "That promo code already exists." },
        { status: 409 },
      );
    }
    console.error("Failed to create promo code:", error);
    return NextResponse.json(
      { success: false, message: "Could not create promo code." },
      { status: 500 },
    );
  }
}

const updateSchema = z.object({
  id: z.string().uuid(),
  percentage: z.number().int().min(1).max(99).optional(),
  isActive: z.boolean().optional(),
}).refine(
  (value) => value.percentage !== undefined || value.isActive !== undefined,
  "Provide a percentage or active state to update.",
);

export async function PATCH(request: NextRequest) {
  const { error } = await getAdmin();
  if (error) {
    return NextResponse.json(
      { success: false, message: error },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  const validation = updateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, message: validation.error.issues[0]?.message },
      { status: 400 },
    );
  }

  const { id, ...data } = validation.data;
  try {
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data,
      select: {
        id: true,
        code: true,
        percentage: true,
        isActive: true,
      },
    });
    return NextResponse.json({ success: true, promoCode });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Promo code not found." },
        { status: 404 },
      );
    }
    console.error("Failed to update promo code:", error);
    return NextResponse.json(
      { success: false, message: "Could not update promo code." },
      { status: 500 },
    );
  }
}
