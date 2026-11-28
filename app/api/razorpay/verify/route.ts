import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProjectOwner } from "@/lib/auth";
import crypto from "crypto";
import { fulfillPayment } from "@/lib/paymentFulfillment";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getProjectOwner();
    if (error || !user?.clientProfile) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      select: { id: true, userId: true },
    });

    if (!transaction || transaction.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
    }

    // Idempotent: if the Razorpay webhook already confirmed this payment, this
    // is still a success for the customer.
    const result = await fulfillPayment(transaction.id, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });
    if (result.outcome === "not_found") {
      return NextResponse.json({ success: false, message: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Failed to verify Razorpay payment:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
