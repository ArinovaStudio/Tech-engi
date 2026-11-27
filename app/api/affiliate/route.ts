import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAffiliateBalance, MIN_WITHDRAWAL } from "@/lib/affiliate";

async function getAffiliateUser() {
  const { user, error } = await getUser();
  if (error || !user) return { user: null, error: error || "Unauthorized" };
  if (user.role !== "CLIENT" && user.role !== "ENGINEER") return { user: null, error: "Not available for this role." };
  return { user, error: null };
}

export async function GET() {
  const { user, error } = await getAffiliateUser();
  if (error || !user) return NextResponse.json({ success: false, message: error }, { status: 401 });

  const [links, earnings, withdrawals, balance, payoutDetails] = await Promise.all([
    prisma.affiliateLink.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, code: true, commissionType: true, commissionValue: true, isActive: true, createdAt: true,
        _count: { select: { referredUsers: true } },
      },
    }),
    prisma.affiliateEarning.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, purchaseAmount: true, amount: true, createdAt: true },
    }),
    prisma.affiliateWithdrawal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, amount: true, status: true, method: true, note: true, createdAt: true, processedAt: true },
    }),
    getAffiliateBalance(user.id),
    prisma.payoutDetail.findUnique({ where: { userId: user.id }, select: { id: true } }),
  ]);

  return NextResponse.json({
    success: true,
    links,
    earnings,
    withdrawals,
    balance,
    hasPayoutDetails: !!payoutDetails,
    minWithdrawal: MIN_WITHDRAWAL,
  });
}

const withdrawSchema = z.object({ amount: z.number().positive() });

export async function POST(request: NextRequest) {
  const { user, error } = await getAffiliateUser();
  if (error || !user) return NextResponse.json({ success: false, message: error }, { status: 401 });

  const parsed = withdrawSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Enter a valid amount." }, { status: 400 });
  }
  const amount = Math.round(parsed.data.amount * 100) / 100;
  if (amount < MIN_WITHDRAWAL) {
    return NextResponse.json({ success: false, message: `Minimum withdrawal is ₹${MIN_WITHDRAWAL}.` }, { status: 400 });
  }

  const details = await prisma.payoutDetail.findUnique({ where: { userId: user.id } });
  if (!details) {
    return NextResponse.json(
      { success: false, message: "Add your payout details in Profile before withdrawing." },
      { status: 400 },
    );
  }
  const payoutInfo =
    details.preferredMethod === "UPI"
      ? `UPI: ${details.upiId}`
      : `${details.accountHolder} | ${details.bankName} | A/C ${details.accountNumber} | IFSC ${details.ifscCode}`;

  try {
    await prisma.$transaction(
      async (tx) => {
        const { available } = await getAffiliateBalance(user.id, tx);
        if (amount > available) throw new Error("INSUFFICIENT");
        await tx.affiliateWithdrawal.create({
          data: { userId: user.id, amount, method: details.preferredMethod, payoutInfo },
        });
      },
      { isolationLevel: "Serializable" },
    );
    return NextResponse.json({ success: true, message: "Withdrawal requested." }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "INSUFFICIENT") {
      return NextResponse.json({ success: false, message: "Amount exceeds your available balance." }, { status: 400 });
    }
    console.error("Withdrawal failed:", e);
    return NextResponse.json({ success: false, message: "Could not request withdrawal. Try again." }, { status: 500 });
  }
}
