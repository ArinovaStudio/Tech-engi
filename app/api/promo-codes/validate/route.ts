import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/auth";
import {
  getPromoQuote,
  PromoCodeValidationError,
} from "@/lib/promoCodes";

export async function POST(request: NextRequest) {
  const { user, error } = await getClient();
  if (error || !user) {
    return NextResponse.json(
      { success: false, message: error || "Unauthorized" },
      { status: 401 },
    );
  }

  let body: { code?: unknown; budget?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (
    typeof body.code !== "string" ||
    typeof body.budget !== "number" ||
    !Number.isFinite(body.budget)
  ) {
    return NextResponse.json(
      { success: false, message: "Promo code and project budget are required." },
      { status: 400 },
    );
  }

  try {
    const promo = await getPromoQuote(user.id, body.code, body.budget);
    return NextResponse.json({
      success: true,
      promo: {
        code: promo.code,
        percentage: promo.percentage,
        discountAmount: promo.discountAmount,
        amountDue: promo.amountDue,
      },
    });
  } catch (validationError) {
    if (!(validationError instanceof PromoCodeValidationError)) {
      console.error("Failed to validate promo code:", validationError);
      return NextResponse.json(
        { success: false, message: "Could not validate promo code." },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: validationError.message,
      },
      { status: 400 },
    );
  }
}
