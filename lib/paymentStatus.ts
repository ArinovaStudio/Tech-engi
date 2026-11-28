import { prisma } from "@/lib/prisma";
interface PaymentStatusProject {
  id: string;
  status: string;
  advancePaid: boolean;
  isFinalPaymentMade: boolean;
  transactions: { type: string; amount: number; completedAt: Date | null }[];
}

export async function getPaymentStatus(project: PaymentStatusProject) {
  const pendingPayments = await prisma.transaction.count({
    where: {
      projectId: project.id,
      status: "PENDING",
      type: { in: ["ADVANCE_PAYMENT", "FINAL_PAYMENT"] },
    },
  });

  const paidFor = (type: "ADVANCE_PAYMENT" | "FINAL_PAYMENT") => {
    const rows = project.transactions.filter((t) => t.type === type);
    return {
      amount: rows.reduce((sum, t) => sum + t.amount, 0),
      paidAt: rows.reduce<Date | null>(
        (latest, t) => (t.completedAt && (!latest || t.completedAt > latest) ? t.completedAt : latest),
        null,
      ),
    };
  };
  const advance = paidFor("ADVANCE_PAYMENT");
  const final = paidFor("FINAL_PAYMENT");
  const awaitingFinal = project.status === "AWAITING_FINAL_PAYMENT" && !project.isFinalPaymentMade;

  return {
    projectStatus: project.status,
    advancePaid: project.advancePaid,
    isFinalPaymentMade: project.isFinalPaymentMade,
    // true while the status is expected to change soon (drives faster refresh)
    awaitingPayment: awaitingFinal || pendingPayments > 0 || !project.advancePaid,
    steps: [
      {
        key: "ADVANCE",
        label: "Advance payment (25%)",
        status: project.advancePaid ? "PAID" : pendingPayments > 0 ? "PROCESSING" : "DUE",
        amount: advance.amount,
        paidAt: advance.paidAt,
      },
      {
        key: "FINAL",
        label: "Final payment (75%)",
        status: project.isFinalPaymentMade
          ? "PAID"
          : awaitingFinal
            ? pendingPayments > 0 ? "PROCESSING" : "DUE"
            : "NOT_DUE",
        amount: final.amount,
        paidAt: final.paidAt,
      },
      {
        key: "COMPLETED",
        label: "Project completed",
        status: project.status === "COMPLETED" ? "DONE" : "PENDING",
        amount: 0,
        paidAt: null,
      },
    ],
  };
}
