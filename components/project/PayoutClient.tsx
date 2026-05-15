"use client";

import React from "react";
import PayoutHistory from "./PayoutHistory";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <p className="text-sm " style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      <h2
        className="text-2xl font-bold mt-1"
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
  const { data, isLoading } = useSWR(`/api/payout/${projectId}`, fetcher);
  
  const stats = data?.stats ?? {};
  const transactions = data?.transactions ?? []; // Fetch transactions to pass to history
  
  const approved = stats?.approved ?? false;
  const budget = stats?.budget ?? 0;
  const projectProgress = stats?.progress ?? 0;
  const remaining = stats?.remaining ?? 0;
  
  const canPay = approved && projectProgress === 100;
  const lastTransaction = stats?.lastTransaction ?? {};
  const lastTransactionAmount = lastTransaction?.amount ?? 0;
  const lastTransactionDate = lastTransaction?.date ? new Date(lastTransaction.date).toLocaleDateString() : "No payments yet";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
          Client Payments
        </h2>
        <p className="text-sm mt-1 " style={{ color: "var(--text-muted)" }}>
          Manage your payments and remaining balance.
        </p>
      </div>

      {/* TOP BOXES */}
      <div className="grid md:grid-cols-2 gap-4">
        <SummaryCard
          title="Total Budget"
          value={`₹${budget.toLocaleString()}`}
        />
        <SummaryCard
          title="Last Payment"
          value={`₹${lastTransactionAmount.toLocaleString()} • ${lastTransactionDate}`}
        />
      </div>

      {/* LOWER SECTION */}
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* PAYMENT HISTORY (Read Only Mode) */}
        <div className="flex-1">
          <PayoutHistory 
            transactions={transactions} 
            readOnly={true} 
          />
        </div>

        {/* CONDITIONAL PAYMENT BOX */}
        <div className="rounded-xl w-full lg:w-96 border border-[var(--border)] bg-white p-6 flex flex-col h-fit">
          <div>
            <h3 className="text-lg font-semibold  mb-4" style={{ color: "var(--text-primary)" }}>
              Remaining Payment
            </h3>

            {!canPay ? (
              <p className="text-sm  text-[var(--text-muted)] bg-[var(--bg)] p-4 rounded-lg border border-[var(--border)]">
                No activity yet. Payment will be enabled once the project is
                approved and reaches 100% completion.
              </p>
            ) : (
              <>
                <p className="text-sm  text-[var(--text-muted)] mb-2">
                  You need to pay the remaining 60% amount.
                </p>

                <h2 className="text-3xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
                  ₹{remaining.toLocaleString()}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Transaction ID</label>
                    <input
                      placeholder="TXN_123456"
                      className="w-full border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--primary)] bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">Payment Source</label>
                    <input
                      placeholder="UPI / Bank"
                      className="w-full border border-[var(--border)] rounded-lg p-3 text-sm outline-none focus:border-[var(--primary)] bg-gray-50/50"
                    />
                  </div>

                  <button
                    className="w-full py-3 rounded-lg text-white text-sm font-bold shadow-md transition-colors mt-2"
                    style={{ background: "var(--primary)" }}
                  >
                    Submit Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}