import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";
import {
  getAdvanceAmount,
  getPromoQuote,
  PromoCodeValidationError,
} from "@/lib/promoCodes";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const projectId = body.projectId;
    const promoCode = body.promoCode;
    if (typeof projectId !== "string" || !projectId) {
      return NextResponse.json({ success: false, message: "Project ID required" }, { status: 400 });
    }
    if (promoCode !== undefined && typeof promoCode !== "string") {
      return NextResponse.json({ success: false, message: "Invalid promo code" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.clientId !== user.clientProfile.id) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (project.status !== "DRAFT" && project.status !== "AWAITING_FINAL_PAYMENT") {
      return NextResponse.json({ success: false, message: "Project is not ready for payment" }, { status: 400 });
    }

    const isAdvance = !project.advancePaid;
    const pendingPromoTransaction = isAdvance
      ? await prisma.transaction.findFirst({
          where: {
            userId: user.id,
            type: "ADVANCE_PAYMENT",
            status: "PENDING",
            promoCodeId: { not: null },
          },
          orderBy: { createdAt: "desc" },
        })
      : null;
    if (pendingPromoTransaction) {
      if (
        pendingPromoTransaction.projectId !== project.id ||
        !pendingPromoTransaction.razorpayOrderId
      ) {
        return NextResponse.json(
          { success: false, message: "Complete your pending discounted advance payment first." },
          { status: 409 },
        );
      }

      const order = await razorpay.orders.fetch(pendingPromoTransaction.razorpayOrderId);
      return NextResponse.json({ success: true, order }, { status: 200 });
    }

    if (promoCode && !isAdvance) {
      return NextResponse.json({ success: false, message: "Promo codes apply only to advance payments." }, { status: 400 });
    }
    const promo = promoCode ? await getPromoQuote(user.id, promoCode, project.budget) : null;
    const amountToPay = promo?.amountDue ?? (isAdvance
      ? getAdvanceAmount(project.budget)
      : Math.round(project.budget * 0.75 * 100) / 100);

    const transactionType = isAdvance ? "ADVANCE_PAYMENT" : "FINAL_PAYMENT";

    const order = await razorpay.orders.create({
      amount: Math.round(amountToPay * 100),
      currency: "INR",
      receipt: `${transactionType === "ADVANCE_PAYMENT" ? "adv" : "fin"}_${projectId}`,
      notes: {
        projectId,
        type: transactionType,
      },
    });

    await prisma.transaction.create({
      data: {
        projectId: project.id,
        userId: user.id,
        amount: amountToPay,
        promoCodeId: promo?.id,
        promoPercentage: promo?.percentage,
        promoDiscount: promo?.discountAmount ?? 0,
        type: transactionType,
        status: "PENDING",
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, message: "There is already a pending payment or this promo code has been used." },
        { status: 409 },
      );
    }
    if (error instanceof PromoCodeValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
    console.error("Failed to create Razorpay order:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}