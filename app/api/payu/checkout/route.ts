import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import crypto from "crypto";
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
    const { projectId, redirectUrl, promoCode } = body;
    if (typeof projectId !== "string" || !projectId){
        return NextResponse.json({ success: false, message: "Project ID required" }, { status: 400 });
    }
    if (promoCode !== undefined && typeof promoCode !== "string") {
      return NextResponse.json({ success: false, message: "Invalid promo code" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project || project.clientId !== user.clientProfile.id) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    if (!["DRAFT", "AWAITING_FINAL_PAYMENT"].includes(project.status)) {
      return NextResponse.json({ success: false, message: "Project is not ready for payment" }, { status: 400 });
    }

    const targetUrl = redirectUrl || `/client/project/${projectId}`;
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
      if (pendingPromoTransaction.projectId !== project.id || !pendingPromoTransaction.payuTransactionId) {
        return NextResponse.json(
          { success: false, message: "Complete your pending discounted advance payment first." },
          { status: 409 },
        );
      }
      const actionUrl = process.env.PAYU_TEST_SANDBOX === "true"
        ? "https://test.payu.in/_payment"
        : "https://secure.payu.in/_payment";
      const baseUrl = process.env.NEXTAUTH_URL;
      return NextResponse.json({
        success: true,
        data: {
          key: process.env.PAYU_MERCHANT_KEY,
          txnid: pendingPromoTransaction.payuTransactionId,
          amount: pendingPromoTransaction.amount.toFixed(2),
          productinfo: `Project_${projectId}`,
          firstname: pendingPromoTransaction.payuFirstName || user.name?.split(" ")[0] || "Client",
          email: user.email,
          phone: user.phone || "0000000000",
          hash: pendingPromoTransaction.payuHash,
          surl: `${baseUrl}/api/payu/verify?redirect=${encodeURIComponent(targetUrl)}`,
          furl: `${baseUrl}/api/payu/verify?redirect=${encodeURIComponent(targetUrl)}`,
          actionUrl,
        },
      }, { status: 200 });
    }

    if (promoCode && !isAdvance) {
      return NextResponse.json({ success: false, message: "Promo codes apply only to advance payments." }, { status: 400 });
    }
    const promo = promoCode ? await getPromoQuote(user.id, promoCode, project.budget) : null;
    const amountToPay = promo?.amountDue ?? (isAdvance
      ? getAdvanceAmount(project.budget)
      : Math.round(project.budget * 0.75 * 100) / 100);
    const transactionType = isAdvance ? "ADVANCE_PAYMENT" : "FINAL_PAYMENT";

    const txnid = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const amountStr = amountToPay.toFixed(2);
    const productInfo = `Project_${projectId}`;
    const firstName = user.name?.split(" ")[0] || "Client";

    const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amountStr}|${productInfo}|${firstName}|${user.email}|||||||||||${process.env.PAYU_MERCHANT_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

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
        payuTransactionId: txnid,
        payuHash: hash,
        payuFirstName: firstName,
      },
    });

    const actionUrl = process.env.PAYU_TEST_SANDBOX === "true" ? "https://test.payu.in/_payment" : "https://secure.payu.in/_payment";
    const baseUrl = process.env.NEXTAUTH_URL;

    return NextResponse.json({
      success: true,
      data: {
        key: process.env.PAYU_MERCHANT_KEY,
        txnid,
        amount: amountStr,
        productinfo: productInfo,
        firstname: firstName,
        email: user.email,
        phone: user.phone || "0000000000",
        hash,
        surl: `${baseUrl}/api/payu/verify?redirect=${encodeURIComponent(targetUrl)}`,
        furl: `${baseUrl}/api/payu/verify?redirect=${encodeURIComponent(targetUrl)}`,
        actionUrl
      }
    }, { status: 200 });

  } catch (error) {
    if (error instanceof PromoCodeValidationError) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
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
    console.error("Failed to create PayU checkout:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}