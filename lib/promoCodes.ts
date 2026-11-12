import { prisma } from "@/lib/prisma";

export const PROMO_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]{2,31}$/;

export interface PromoQuote {
  id: string;
  code: string;
  percentage: number;
  discountAmount: number;
  amountDue: number;
}

export class PromoCodeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PromoCodeValidationError";
  }
}

export async function getPromoQuote(
  userId: string,
  rawCode: string,
  budget: number,
): Promise<PromoQuote> {
  const code = rawCode.trim().toUpperCase();
  if (!PROMO_CODE_PATTERN.test(code)) {
    throw new PromoCodeValidationError("Enter a valid promo code.");
  }
  if (!Number.isFinite(budget) || budget <= 0) {
    throw new PromoCodeValidationError("A valid project budget is required.");
  }

  const promoCode = await prisma.promoCode.findUnique({
    where: { code },
    select: { id: true, code: true, percentage: true, isActive: true },
  });
  if (!promoCode || !promoCode.isActive) {
    throw new PromoCodeValidationError("This promo code is invalid or inactive.");
  }

  const pendingAdvance = await prisma.transaction.findFirst({
    where: {
      userId,
      type: "ADVANCE_PAYMENT",
      status: "PENDING",
      promoCodeId: { not: null },
    },
    select: { id: true },
  });
  if (pendingAdvance) {
    throw new PromoCodeValidationError(
      "Complete your pending discounted advance payment first.",
    );
  }

  const redemption = await prisma.promoCodeRedemption.findUnique({
    where: {
      promoCodeId_userId: {
        promoCodeId: promoCode.id,
        userId,
      },
    },
    select: { id: true },
  });
  if (redemption) {
    throw new PromoCodeValidationError("You have already used this promo code.");
  }

  const advancePaise = Math.round(budget * 0.25 * 100);
  const discountPaise = Math.round((advancePaise * promoCode.percentage) / 100);

  return {
    id: promoCode.id,
    code: promoCode.code,
    percentage: promoCode.percentage,
    discountAmount: discountPaise / 100,
    amountDue: (advancePaise - discountPaise) / 100,
  };
}

export function getAdvanceAmount(budget: number) {
  return Math.round(budget * 0.25 * 100) / 100;
}
