import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fulfillPayment } from "@/lib/paymentFulfillment";
import { isValidPayuResponseHash } from "@/lib/payuHash";

// PayU -> server webhook (configure the same URL for success events in the PayU
// dashboard). Updates the database even if the customer never returns to the site.
export async function POST(req: NextRequest) {
  let fields: Record<string, string> = {};
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = await req.json();
      for (const [k, v] of Object.entries(json)) fields[k] = v == null ? "" : String(v);
    } else {
      const form = await req.formData();
      form.forEach((v, k) => { fields[k] = String(v); });
    }
  } catch {
    return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
  }

  const { status, txnid, amount, productinfo, firstname, email, hash, mihpayid } = fields;
  if (!txnid || !hash) {
    return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
  }

  const valid = isValidPayuResponseHash({
    status, txnid, amount, productinfo, firstname, email, hash,
    additionalCharges: fields.additionalCharges || null,
  });
  if (!valid) {
    return NextResponse.json({ success: false, message: "Invalid hash" }, { status: 400 });
  }
  if (status !== "success") {
    return NextResponse.json({ success: true, ignored: status });
  }

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { payuTransactionId: txnid },
      select: { id: true, amount: true },
    });
    if (!transaction) {
      return NextResponse.json({ success: true, ignored: "unknown transaction" });
    }
    if (Number(amount).toFixed(2) !== transaction.amount.toFixed(2)) {
      console.error("PayU webhook amount mismatch", txnid, amount, transaction.amount);
      return NextResponse.json({ success: true, ignored: "amount mismatch" });
    }

    const result = await fulfillPayment(transaction.id, { payuPaymentId: mihpayid || undefined });
    return NextResponse.json({ success: true, outcome: result.outcome });
  } catch (error) {
    console.error("PayU webhook failed:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
