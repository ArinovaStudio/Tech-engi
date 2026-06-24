"use client";

import React, { useEffect } from "react";
import PayoutHistory from "./PayoutHistory";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/hooks/useAuth";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <p className="text-sm font-inter" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      <h2
        className="text-2xl font-bold mt-1 font-inter"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </h2>
    </div>
  );
}

interface Props {
  projectId: string;
}

export default function PayoutClient({ projectId }: Props) {
  const { data, isLoading, mutate } = useSWR(`/api/payout/${projectId}`, fetcher);
  const { processPayment, loading: paymentLoading } = usePayment();
  const { user } = useAuth() as { user: { id: string } };
  const stats = data?.stats ?? {};
  const transactions = data?.transactions ?? [];

  const clientTransactions = transactions.filter((t: any) =>
    ["ADVANCE_PAYMENT", "FINAL_PAYMENT", "REFUND_CLIENT"].includes(t.type)
  );

  const budget = stats?.budget ?? 0;
  const projectProgress = stats?.progress ?? 0;
  const remaining = stats?.remaining ?? 0;

  const canPay = projectProgress === 100 && remaining > 0;

  const lastTransaction = stats?.lastTransaction ?? {};
  const lastTransactionAmount = lastTransaction?.amount ?? 0;
  const lastTransactionDate = lastTransaction?.date
    ? new Date(lastTransaction.date).toLocaleDateString()
    : "No payments yet";

  const handlePayment = () => {
    processPayment({
      projectId,
      redirectPath: `/client`,
      description: "Final Payment (60%)",
      onSuccess: () => {
        mutate();
      }
    });
  };
  useEffect(() => {
  if (!user?.id) return;

  // For the sessionStorage handoff case, don't block on isLoading.
  // The setInterval inside already polls until elements exist.
  const isHandoff = sessionStorage.getItem("start_payout_tour") === "true";
  if (!isHandoff && isLoading) return;

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      popoverClass: "custom-tour-popover",
      overlayOpacity: 0.35,
      nextBtnText: "Next →",
      prevBtnText: "← Prev",
      doneBtnText: "Done ✓",
      onPopoverRender: (popover) => {
        const style = (el: HTMLElement) => {
          el.style.setProperty("background", "var(--primary)", "important");
          el.style.setProperty("color", "#ffffff", "important");
          el.style.setProperty("opacity", "1", "important");
          el.style.setProperty("border", "none", "important");
        };
        if (popover.nextButton) style(popover.nextButton);
        if (popover.previousButton) {
          popover.previousButton.style.setProperty("background", "transparent", "important");
          popover.previousButton.style.setProperty("color", "var(--text-secondary)", "important");
          popover.previousButton.style.setProperty("border", "1px solid var(--border)", "important");
        }
      },
      onDestroyed: () => {
        sessionStorage.removeItem("tour_in_progress");
        sessionStorage.removeItem("start_payout_tour");
        const tourKey = `tour_seen_payout_${user.id}`;
        if (!localStorage.getItem(tourKey)) {
          localStorage.setItem(tourKey, "true");
        }
      },
      steps: [
        {
          element: "#payout-summary-cards",
          popover: {
            title: "Payment Overview",
            description: "Your total project budget and the most recent payment made, at a glance.",
          },
        },
        {
          element: "#payout-history",
          popover: {
            title: "Payment History",
            description: "A full log of all advance payments, final payments, and refunds tied to this project.",
          },
        },
        {
          element: "#payout-pending-action",
          popover: {
            title: "Pending Action",
            description: "Any outstanding payment due will appear here. The final 60% payment unlocks automatically once your project hits 100% completion.",
          },
        },
        ...(canPay ? [{
          element: "#payout-pay-btn",
          popover: {
            title: "Make a Payment",
            description: "Your project is complete — click here to release the final 60% payment securely.",
          },
        }] : []),
      ],
    });
    driverObj.drive();
  };

  // Case 1: Handoff from Assets page — poll until DOM elements exist
  if (sessionStorage.getItem("start_payout_tour") === "true") {
    const timer = setInterval(() => {
      const summary = document.querySelector("#payout-summary-cards");
      const history = document.querySelector("#payout-history");
      const pending = document.querySelector("#payout-pending-action");
      if (summary && history && pending) {
        clearInterval(timer);
        sessionStorage.removeItem("start_payout_tour");
        setTimeout(() => startTour(), 100);
      }
    }, 100);
    return () => clearInterval(timer);
  }

  // Case 2: First-time visitor
  const tourKey = `tour_seen_payout_${user.id}`;
  if (!localStorage.getItem(tourKey)) {
    const timeout = setTimeout(() => startTour(), 500);
    return () => clearTimeout(timeout);
  }

  // Case 3: Manual Start Tour
  const handleManualTour = () => startTour();
  window.addEventListener("start-payout-tour", handleManualTour);
  return () => window.removeEventListener("start-payout-tour", handleManualTour);

}, [user?.id, isLoading, canPay]);
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div id="payout-page-header">
        <h2 className="text-2xl font-bold font-inter" style={{ color: "var(--text-primary)" }}>
          Client Payments
        </h2>
        <p className="text-sm mt-1 font-inter" style={{ color: "var(--text-muted)" }}>
          Manage your payments and remaining balance.
        </p>
      </div>

      {/* TOP BOXES */}
      <div id="payout-summary-cards" className="grid md:grid-cols-2 gap-4">
        <SummaryCard
          title="Total Budget"
          value={`₹${budget.toLocaleString()}`}
        />
        <SummaryCard
          title="Last Payment"
          value={lastTransactionAmount > 0 ? `₹${lastTransactionAmount.toLocaleString()} • ${lastTransactionDate}` : "No payments yet"}
        />
      </div>

      {/* LOWER SECTION */}
      <div className="flex flex-col lg:flex-row gap-4">

        <div id="payout-history" className="flex-1">
          <PayoutHistory
            transactions={clientTransactions}
            readOnly={true}
          />
        </div>

        {/* CONDITIONAL PAYMENT BOX */}
        <div id="payout-pending-action" className="rounded-xl w-full lg:w-96 border border-[var(--border)] bg-white p-6 flex flex-col h-fit">
          <div>
            <h3 className="text-lg font-semibold font-inter mb-4" style={{ color: "var(--text-primary)" }}>
              Pending Action
            </h3>

            {!canPay ? (
              <p className="text-sm font-inter text-[var(--text-muted)] bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)] text-center">
                No pending payments.
                {remaining > 0 && " Final payment will be enabled once the project reaches 100% completion."}
              </p>
            ) : (
              <>
                <p className="text-sm font-inter text-[var(--text-muted)] mb-2">
                  You need to pay the remaining 60% amount for project completion.
                </p>

                <h2 className="text-3xl font-bold mb-6 font-inter" style={{ color: "var(--text-primary)" }}>
                  ₹{remaining.toLocaleString()}
                </h2>

                <button
                  id="payout-pay-btn"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full py-3 rounded-lg text-white text-sm font-bold shadow-md transition-colors mt-2 disabled:opacity-50 flex justify-center items-center font-inter"
                  style={{ background: "var(--primary)" }}
                >
                  {paymentLoading ? "Processing..." : `Pay ₹${remaining.toLocaleString()}`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}