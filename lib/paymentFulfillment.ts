import { prisma } from "@/lib/prisma";
import { creditAffiliateCommission } from "@/lib/affiliate";
import sendEmail from "@/lib/email";
import { projectCompletedEngineerTemplate } from "@/lib/templates";

export interface GatewayPaymentFields {
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  payuPaymentId?: string;
}

export type FulfillResult =
  | { outcome: "fulfilled"; transactionId: string; projectId: string; type: string }
  | { outcome: "already_processed"; transactionId: string; projectId: string; type: string }
  | { outcome: "not_found" };

/**
 * Marks a gateway-confirmed payment as successful and updates the project.
 *
 * It is the single place that does this, and is called by the browser verify
 * routes AND the gateway webhooks. It is safe to call any number of times for
 * the same transaction (browser + webhook + webhook retries): only the call
 * that wins the atomic PENDING/FAILED -> SUCCESS claim applies side effects.
 *
 * Callers must have authenticated the payment themselves (signature / hash).
 */
export async function fulfillPayment(
  transactionId: string,
  gateway: GatewayPaymentFields,
): Promise<FulfillResult> {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { project: { include: { engineer: { include: { user: true } } } } },
  });
  if (!transaction) return { outcome: "not_found" };

  const base = {
    transactionId: transaction.id,
    projectId: transaction.projectId,
    type: transaction.type,
  };

  // Only customer payments are fulfilled here (never payouts / refunds).
  if (transaction.type !== "ADVANCE_PAYMENT" && transaction.type !== "FINAL_PAYMENT") {
    return { outcome: "already_processed", ...base };
  }

  const project = transaction.project;

  const claimed = await prisma.$transaction(async (tx) => {
    // Atomic claim. A payment the gateway confirms is authoritative, so a row
    // wrongly marked FAILED (e.g. checkout dismissed just before the payment
    // went through) is also recovered.
    const result = await tx.transaction.updateMany({
      where: { id: transaction.id, status: { in: ["PENDING", "FAILED"] } },
      data: { status: "SUCCESS", completedAt: new Date(), ...gateway },
    });
    if (result.count === 0) return false;

    await creditAffiliateCommission(tx, transaction);

    if (transaction.type === "ADVANCE_PAYMENT") {
      if (transaction.promoCodeId) {
        await tx.promoCodeRedemption.create({
          data: {
            promoCodeId: transaction.promoCodeId,
            userId: transaction.userId,
            transactionId: transaction.id,
            status: "SUCCESS",
          },
        });
      }
      await tx.project.update({
        where: { id: project.id },
        data: { advancePaid: true, status: "SEARCHING" },
      });
    } else {
      await tx.project.update({
        where: { id: project.id },
        data: { isFinalPaymentMade: true, status: "COMPLETED" },
      });

      await tx.projectResource.updateMany({
        where: { projectId: project.id, isLocked: true },
        data: { isLocked: false },
      });

      if (project.engineerId && project.engineer) {
        const existingPayout = await tx.transaction.findFirst({
          where: {
            projectId: project.id,
            type: "PAYOUT_ENGINEER",
            userId: project.engineer.userId,
          },
        });
        if (!existingPayout) {
          await tx.transaction.create({
            data: {
              projectId: project.id,
              userId: project.engineer.userId,
              amount: project.budget * 0.7,
              type: "PAYOUT_ENGINEER",
              status: "PENDING",
            },
          });
        }
      }
    }
    return true;
  });

  if (!claimed) return { outcome: "already_processed", ...base };

  // Emails run after commit and must never fail the payment.
  if (transaction.type === "FINAL_PAYMENT" && project.engineer?.user.email) {
    try {
      await sendEmail(
        project.engineer.user.email,
        `Project Completed: ${project.title}`,
        projectCompletedEngineerTemplate(project.title, project.budget * 0.7),
      );
    } catch (error) {
      console.error("Failed to send project completed email:", error);
    }
  }

  return { outcome: "fulfilled", ...base };
}
