import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const AFFILIATE_COOKIE = "te_ref";
export const AFFILIATE_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{3,31}$/;
export const MIN_WITHDRAWAL = 100;

export function generateAffiliateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calcCommission(
  type: "PERCENTAGE" | "FIXED",
  value: number,
  purchaseAmount: number,
) {
  const raw = type === "PERCENTAGE" ? (purchaseAmount * value) / 100 : value;
  // Never pay out more than the purchase itself.
  return round2(Math.min(Math.max(raw, 0), purchaseAmount));
}

/**
 * Call inside the payment-verification prisma.$transaction, right after the
 * transaction is marked SUCCESS. Idempotent: transactionId is unique.
 */
export async function creditAffiliateCommission(
  tx: Prisma.TransactionClient,
  transaction: { id: string; userId: string; amount: number; type: string },
) {
  if (transaction.type !== "ADVANCE_PAYMENT" && transaction.type !== "FINAL_PAYMENT") return;
  if (!(transaction.amount > 0)) return;

  const buyer = await tx.user.findUnique({
    where: { id: transaction.userId },
    select: {
      referredByLink: {
        select: { id: true, ownerId: true, commissionType: true, commissionValue: true, isActive: true },
      },
    },
  });
  const link = buyer?.referredByLink;
  if (!link || !link.isActive || link.ownerId === transaction.userId) return;

  const amount = calcCommission(link.commissionType, link.commissionValue, transaction.amount);
  if (amount <= 0) return;

  const exists = await tx.affiliateEarning.findUnique({
    where: { transactionId: transaction.id },
    select: { id: true },
  });
  if (exists) return;

  await tx.affiliateEarning.create({
    data: {
      linkId: link.id,
      referrerId: link.ownerId,
      referredUserId: transaction.userId,
      transactionId: transaction.id,
      purchaseAmount: transaction.amount,
      amount,
    },
  });
}

/** Balance = all earnings − withdrawals that are pending or paid. */
export async function getAffiliateBalance(
  userId: string,
  db: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const [earned, withdrawn, pending] = await Promise.all([
    db.affiliateEarning.aggregate({ where: { referrerId: userId }, _sum: { amount: true } }),
    db.affiliateWithdrawal.aggregate({
      where: { userId, status: { in: ["PENDING", "PAID"] } },
      _sum: { amount: true },
    }),
    db.affiliateWithdrawal.aggregate({
      where: { userId, status: "PENDING" },
      _sum: { amount: true },
    }),
  ]);
  const totalEarned = round2(earned._sum.amount ?? 0);
  const totalWithdrawn = round2(withdrawn._sum.amount ?? 0);
  return {
    totalEarned,
    pendingWithdrawal: round2(pending._sum.amount ?? 0),
    totalPaid: round2(totalWithdrawn - (pending._sum.amount ?? 0)),
    available: round2(totalEarned - totalWithdrawn),
  };
}
