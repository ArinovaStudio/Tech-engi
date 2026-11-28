import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { fulfillPayment } from "@/lib/paymentFulfillment";

// Razorpay -> server webhook. Updates the database even if the customer closed
// the tab or lost network before the browser could call /api/razorpay/verify.
// Dashboard: Settings > Webhooks > URL: https://<domain>/api/razorpay/webhook
// Events: payment.captured, order.paid. Secret: RAZORPAY_WEBHOOK_SECRET.
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set; rejecting webhook.");
    return NextResponse.json({ success: false, message: "Webhook not configured" }, { status: 500 });
  }

  // The signature is computed over the exact raw body.
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }

  // Only successful-payment events change anything. Everything else is acknowledged.
  if (event.event !== "payment.captured" && event.event !== "order.paid") {
    return NextResponse.json({ success: true, ignored: event.event });
  }

  const payment = event.payload?.payment?.entity;
  const orderId: string | undefined = payment?.order_id;
  if (!payment?.id || !orderId || payment.status !== "captured") {
    return NextResponse.json({ success: true, ignored: "not captured" });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { razorpayOrderId: orderId },
      select: { id: true, amount: true },
    });
    if (!transaction) {
      // Not one of ours (or created elsewhere). Ack so Razorpay stops retrying.
      return NextResponse.json({ success: true, ignored: "unknown order" });
    }

    // Never trust an event whose amount differs from what we asked for.
    if (payment.amount !== Math.round(transaction.amount * 100)) {
      console.error("Razorpay webhook amount mismatch", orderId, payment.amount, transaction.amount);
      return NextResponse.json({ success: true, ignored: "amount mismatch" });
    }

    const result = await fulfillPayment(transaction.id, { razorpayPaymentId: payment.id });
    return NextResponse.json({ success: true, outcome: result.outcome });
  } catch (error) {
    // 500 makes Razorpay retry, which is what we want for a transient failure.
    console.error("Razorpay webhook failed:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
