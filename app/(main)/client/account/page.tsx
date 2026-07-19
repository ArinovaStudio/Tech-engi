"use client";
import { useState, useEffect } from "react";
import { DollarSign, CreditCard, TrendingUp, Clock, CheckCircle, Wallet, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  project: { title: string } | null;
}

interface Stats {
  totalSpent: number;
  totalRefunded: number;
  pendingRefunds: number;
  totalBudget: number;
  totalProjects: number;
  pendingAmount: number;
}

interface PendingProject {
  id: string;
  title: string;
  budget: number;
  status: string;
  endDate?: string;
}

export default function ClientAccountPage() {
  const { user } = useAuth();
  const { processPayment, loading: isPaying } = usePayment();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingProjects, setPendingProjects] = useState<PendingProject[]>([]);
  const [paying, setPaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  async function fetchData() {
    try {
      setLoading(true);
      const historyRes = await fetch("/api/payout/history");

      if (historyRes.ok) {
        const data = await historyRes.json();
        if (data.success) {
          setTransactions(data.transactions || []);
          setStats(data.stats);
          setPendingProjects(data.pendingProjects || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch account data:", err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (!user?.id) return;
    if (loading) return;

    const tourKey = `tour_seen_account_${user.id}`;
    const isHandoff = sessionStorage.getItem("start_payout_tour") === "true";

    if (!isHandoff && localStorage.getItem(tourKey)) return;

    const startTour = () => {
      const history = document.querySelector("#payment-history-section");
      const activity = document.querySelector("#new-activity-section");
      if (!history || !activity) return;

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
          localStorage.setItem(tourKey, "true");
        },
        steps: [
          {
            element: "#payment-history-section",
            popover: {
              title: "Payment History",
              description:
                "Every transaction across all your projects lives here — advance payments, final payments, and refunds — each with its status and date.",
            },
          },
          {
            element: "#new-activity-section",
            popover: {
              title: "New Activity",
              description:
                "Any pending payments you owe show up here, with the exact amount due. Hit Pay Now to settle an advance or final payment directly.",
              onNextClick: (_el, _step, opts) => {
                opts.driver.destroy();
                window.dispatchEvent(new Event("go-to-profile-tour"));
              },
            },
          },
        ],
      });

      driverObj.drive();
    };

    const timer = setTimeout(startTour, isHandoff ? 0 : 1000);
    return () => clearTimeout(timer);
  }, [user?.id, loading]);
  async function handlePay(project: PendingProject) {
    setPaying(project.id);

    const isAdvance = project.status === "DRAFT";
    const description = isAdvance ? "Advance Payment (40%)" : "Final Payment (60%)";

    processPayment({
      projectId: project.id,
      redirectPath: `/client/account`,
      user: { name: user?.name, email: user?.email },
      description,
      onSuccess: () => {
        fetchData();
        setPaying(null);
      },
      onError: () => {
        fetchData();
        setPaying(null);
      },
      onDismiss: () => {
        setPaying(null);
      }
    });
  }

  const formatDate = (d: string) => {
    const date = new Date(d);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getTypeLabel = (type: string) => ({
    ADVANCE_PAYMENT: "Advance Payment",
    FINAL_PAYMENT: "Final Payment",
    REFUND_CLIENT: "Refund",
  }[type] || type);

  const getStatusStyle = (status: string) =>
    status === "SUCCESS" ? "bg-green-50 text-green-700 border-green-200"
      : status === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
        : "bg-red-50 text-red-700 border-red-200";

  const successTxns = transactions.filter(t => t.status === "SUCCESS" && (t.type === "ADVANCE_PAYMENT" || t.type === "FINAL_PAYMENT"));
  const totalPaymentsCount = successTxns.length;
  const lastTxn = successTxns[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* <h1 className="text-2xl font-bold " style={{ color: "var(--text-primary)" }}>Account Overview</h1> */}

      {/* 5 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

        {/* 1. Total Budget */}
        <div className="rounded-xl p-5 text-white col-span-1" style={{ background: "var(--primary)" }}>
          <Wallet size={28} className="opacity-70 mb-3" />
          <p className="text-xs opacity-80 ">Total Budget</p>
          <p className="text-2xl font-bold  mt-0.5">₹{(stats?.totalBudget || 0).toLocaleString()}</p>
          <p className="text-xs opacity-60 mt-1 ">All projects</p>
        </div>

        {/* 2. Total Spent */}
        <div className="rounded-xl p-5 text-white col-span-1 bg-white border border-[var(--border)] dark:bg-card">
          <Wallet size={28} className="text-green-400 mb-3" />
          <p className="text-xs text-[var(--text-muted)] ">Total Spent</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]  mt-0.5">₹{(stats?.totalSpent || 0).toLocaleString()}</p>
          <p className="text-xs mt-1 text-[var(--text-muted)] ">Confirmed payments</p>
        </div>

        {/* 3. Pending Amount */}
        <div className="rounded-xl p-5 bg-white border border-[var(--border)] dark:bg-card">
          <Clock size={28} className="text-yellow-400 mb-3" />
          <p className="text-xs text-[var(--text-muted)] ">Remaining to Pay</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]  mt-0.5">
            ₹{(stats?.pendingAmount || 0).toLocaleString()}
          </p>
          <p className="text-xs mt-1 text-[var(--text-muted)] ">Across all projects</p>
        </div>

        {/* 4. Total Payments */}
        <div className="rounded-xl p-5 bg-white border border-[var(--border)] dark:bg-card">
          <CreditCard size={28} className="text-blue-400 mb-3" />
          <p className="text-xs text-[var(--text-muted)] ">Total Payments</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]  mt-0.5">
            {totalPaymentsCount}
          </p>
          <p className="text-xs mt-1 text-[var(--text-muted)] ">Successful transactions</p>
        </div>

        {/* 5. Total Projects */}
        <div className="rounded-xl p-5 bg-white border border-[var(--border)] dark:bg-card">
          <TrendingUp size={28} className="text-green-400 mb-3" />
          <p className="text-xs text-[var(--text-muted)] ">Total Projects</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]  mt-0.5">
            {stats?.totalProjects || 0}
          </p>
          <p className="text-xs mt-1 text-[var(--text-muted)] ">All time</p>
        </div>

        {/* 6. Last Payment */}
        <div className="rounded-xl p-5 bg-white border border-[var(--border)] dark:bg-card">
          <CheckCircle size={28} className="text-green-500 mb-3" />
          <p className="text-xs text-[var(--text-muted)] ">Last Payment</p>
          {lastTxn ? (
            <>
              <p className="text-sm font-bold text-[var(--text-primary)]  mt-0.5 truncate">
                ₹{lastTxn.amount.toLocaleString()}
              </p>
              <p className="text-xs text-[var(--text-muted)]  mt-0.5 truncate">
                {lastTxn.project?.title || "—"}
              </p>
              <p className="text-xs text-[var(--text-muted)]  mt-0.5">
                {formatDate(lastTxn.createdAt)}
              </p>
            </>
          ) : (
            <p className="text-sm  mt-1" style={{ color: "var(--text-muted)" }}>No payments yet</p>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History */}
        <div id="payment-history-section" className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-[var(--border)] h-[600px] flex flex-col dark:bg-card">
          <div className="p-5 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold " style={{ color: "var(--text-primary)" }}>Payment History</h2>
            <p className="text-sm  mt-0.5" style={{ color: "var(--text-muted)" }}>All your transactions</p>
          </div>

          {transactions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <DollarSign className="mx-auto mb-3" size={40} style={{ color: "var(--border)" }} />
              <p className=" text-sm" style={{ color: "var(--text-muted)" }}>No transactions yet</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-[var(--bg)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--primary-light)" }}>
                      <CreditCard size={16} style={{ color: "var(--primary)" }} />
                    </div>
                    <div>
                      <p className="font-semibold  text-sm" style={{ color: "var(--text-primary)" }}>
                        {t.project?.title || "—"}
                      </p>
                      <p className="text-xs  mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {getTypeLabel(t.type)} · {formatDate(t.createdAt)}
                      </p>
                      <p className="text-xs font-mono mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {t.id.slice(0, 18)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <p className="font-bold " style={{ color: "var(--text-primary)" }}>
                      ₹{t.amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border  ${getStatusStyle(t.status)}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Activity */}
        <div id="new-activity-section" className="col-span-1 lg:col-span-1 bg-white rounded-xl border border-[var(--border)] h-[600px] flex flex-col dark:bg-card">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold " style={{ color: "var(--text-primary)" }}>New Activity</h2>
              <p className="text-sm  mt-0.5" style={{ color: "var(--text-muted)" }}>Payments due</p>
            </div>
            {pendingProjects.length > 0 && (
              <span className="text-xs  px-2 py-0.5 rounded-full text-white" style={{ background: "var(--primary)" }}>
                {pendingProjects.length} pending
              </span>
            )}
          </div>

          {pendingProjects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-5 text-center">
              <CheckCircle size={36} className="mb-3 text-green-400" />
              <p className="text-sm  font-semibold" style={{ color: "var(--text-primary)" }}>All caught up!</p>
              <p className="text-xs  mt-1" style={{ color: "var(--text-muted)" }}>No pending payments</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--border)]">
              {pendingProjects.map((p) => {
                const isAdvance = p.status === "DRAFT";
                const amount = isAdvance ? p.budget * 0.4 : p.budget * 0.6;
                return (
                  <div key={p.id} className="p-4 hover:bg-[var(--bg)] transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "var(--primary-light)" }}>
                        <AlertCircle size={14} style={{ color: "var(--primary)" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold  truncate" style={{ color: "var(--text-primary)" }}>{p.title}</p>
                        <p className="text-xs  mt-0.5" style={{ color: "var(--text-muted)" }}>
                          {isAdvance ? "Advance (40%)" : "Final payment (60%)"}
                        </p>
                        <p className="text-sm font-bold  mt-1" style={{ color: "var(--primary)" }}>
                          ₹{amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePay(p)}
                      disabled={paying === p.id || isPaying}
                      className="w-full py-2 text-white rounded-lg text-xs  font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                      style={{ background: "var(--primary)" }}
                    >
                      {paying === p.id ? <Loader2 size={12} className="animate-spin" /> : null}
                      {paying === p.id ? "Processing..." : "Pay Now"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}