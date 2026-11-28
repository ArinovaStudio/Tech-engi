import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { fulfillPayment } from "@/lib/paymentFulfillment";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const status = formData.get("status") as string;
    const txnid = formData.get("txnid") as string;
    const amount = formData.get("amount") as string;
    const productinfo = formData.get("productinfo") as string;
    const firstname = formData.get("firstname") as string;
    const email = formData.get("email") as string;
    const payuHash = formData.get("hash") as string;
    const mihpayid = formData.get("mihpayid") as string;
    const additionalCharges = formData.get("additionalCharges") as string | null;

    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const baseUrl = process.env.NEXTAUTH_URL;

    const transaction = await prisma.transaction.findUnique({
      where: { payuTransactionId: txnid },
      select: { id: true, projectId: true, amount: true, status: true }
    });

    if (!transaction){
        return NextResponse.redirect(new URL('/client?error=txn_not_found', baseUrl));
    }

    const projectId = transaction.projectId;

    const targetBaseUrl = redirectParam || `/client/project/${projectId}`;

    let reverseHashString = `${process.env.PAYU_MERCHANT_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`;
    if (additionalCharges) {
      reverseHashString = `${additionalCharges}|${reverseHashString}`;
    }

    const calculatedHash = crypto.createHash('sha512').update(reverseHashString).digest('hex');

    if (calculatedHash === payuHash && Number(amount).toFixed(2) === transaction.amount.toFixed(2) && status === "success") {
      
      // Idempotent: the PayU webhook may already have confirmed this payment.
      await fulfillPayment(transaction.id, { payuPaymentId: mihpayid });

      const successUrl = new URL(targetBaseUrl, baseUrl);
      successUrl.searchParams.set("payment", "success");
      return NextResponse.redirect(successUrl);
    } 
    else {

      // Failed payment
      if (calculatedHash === payuHash && transaction.status === "PENDING") {
        await prisma.$transaction(async (tx) => {
          await tx.transaction.update({
            where: { id: transaction.id },
            data: { status: "FAILED" }
          });
        });
      }
      const failedUrl = new URL(targetBaseUrl, baseUrl);
      failedUrl.searchParams.set("payment", "failed");
      return NextResponse.redirect(failedUrl);
    }

  } catch (error) {
    console.error("Failed to verify PayU payment:", error);
    return NextResponse.redirect(new URL('/client?error=payment_error', process.env.NEXTAUTH_URL));
  }
}