import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClient } from "@/lib/auth";
import crypto from "crypto";
import sendEmail from "@/lib/email";
import { projectCompletedEngineerTemplate } from "@/lib/templates";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getClient();
    if (error || !user?.clientProfile) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Invalid signature detected");
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Find transaction
    const transaction = await prisma.transaction.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: {
        project: {
          include: {
            engineer: {
              include: { user: true },
            },
            client: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    if (transaction.status !== "PENDING") {
      return NextResponse.json(
        { success: false, message: "Transaction already processed" },
        { status: 400 }
      );
    }

    const project = transaction.project;

    // Update transaction and project in transaction
    await prisma.$transaction(async (tx) => {
      // Mark transaction as successful
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
      });

      if (transaction.type === "ADVANCE_PAYMENT") {
        // Update project: mark advance paid, change status to SEARCHING
        await tx.project.update({
          where: { id: project.id },
          data: {
            advancePaid: true,
            status: "SEARCHING",
          },
        });
      } else if (transaction.type === "FINAL_PAYMENT") {
        // Update project: mark final payment made, change status to COMPLETED
        await tx.project.update({
          where: { id: project.id },
          data: {
            isFinalPaymentMade: true,
            status: "COMPLETED",
          },
        });

        // Unlock resources
        await tx.projectResource.updateMany({
          where: { projectId: project.id, isLocked: true },
          data: { isLocked: false },
        });

        // Create engineer payout (if engineer assigned)
        if (project.engineerId) {
          const payoutAmount = project.budget * 0.7; // Engineer gets 70%
          await tx.transaction.create({
            data: {
              projectId: project.id,
              userId: project.engineer!.userId,
              amount: payoutAmount,
              type: "PAYOUT_ENGINEER",
              status: "PENDING",
            },
          });
        }
      }
    });

    // Send email to engineer if final payment
    if (
      transaction.type === "FINAL_PAYMENT" &&
      project.engineer?.user.email
    ) {
      try {
        const payoutAmount = project.budget * 0.7;
        const engineerEmailHtml = projectCompletedEngineerTemplate(
          project.title,
          payoutAmount
        );
        await sendEmail(
          project.engineer.user.email,
          `Project Completed: ${project.title}`,
          engineerEmailHtml
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the transaction if email fails
      }
    }

    return NextResponse.json(
      { success: true, message: "Payment verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/razorpay/verify error:", error);
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    );
  }
}