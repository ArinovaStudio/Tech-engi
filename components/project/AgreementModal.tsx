"use client";
import { useRef, useState } from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface AgreementModalProps {
  projectTitle: string;
  wasDeclined: boolean;
  submitting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function AgreementModal({
  projectTitle,
  wasDeclined,
  submitting,
  onAccept,
  onDecline,
}: AgreementModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const reachedEnd = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    if (reachedEnd) setScrolledToEnd(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-card border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-start gap-3">
          <div className="mt-0.5 shrink-0 w-9 h-9 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
            <ShieldCheck size={18} className="text-[var(--primary)]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              Builder Agreement & NDA Required
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              You must accept this agreement to view details for{" "}
              <span className="font-semibold text-[var(--text-primary)]">{projectTitle}</span>
            </p>
          </div>
        </div>

        {/* Declined notice */}
        {wasDeclined && (
          <div className="mx-6 mt-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2.5 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              You previously declined this agreement. Review it below and accept to continue.
            </span>
          </div>
        )}

        {/* Scrollable agreement text */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="mx-6 mt-4 h-72 overflow-y-auto text-xs leading-relaxed text-[var(--text-secondary)] border border-[var(--border)] rounded-lg p-4 bg-[var(--bg)] space-y-3"
        >
          <p className="font-semibold text-[var(--text-primary)]">
            Builder Agreement, Confidentiality (NDA) & Platform Rules — v1.0
          </p>
          <p>
            This Agreement governs the relationship between Tech Engi, operated by TSquareY1
            Private Limited, and every registered Builder. By accepting, you confirm you have
            read, understood, and agreed to this Agreement before accessing this project and any
            confidential client information tied to it.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Confidentiality:</span>{" "}
            You agree to treat all client and platform information — including source code,
            credentials, APIs, business and financial information, and client identity — as
            strictly confidential. You will not share, copy, sell, publish, screenshot, record,
            reverse engineer, or redistribute this information without prior written approval.
            This obligation survives for five years after project completion.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Non-Circumvention:</span>{" "}
            You will not accept direct payment from clients introduced through Tech Engi, ask
            clients to continue projects outside the platform, or attempt to bypass platform
            fees.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Escrow & Payment:</span>{" "}
            All payments are handled through the Tech Engi escrow system and released only after
            milestone completion, client approval, or dispute resolution.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">
              Code of Conduct:
            </span>{" "}
            You agree to maintain professional communication, deliver work on time, submit
            original work, and follow ethical engineering practices.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">
              IP & Ownership:
            </span>{" "}
            Unless otherwise agreed, all deliverables created under a paid project become the
            property of the client upon full payment. You may not reuse proprietary client code
            or publish confidential implementations.
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">
              Suspension & Termination:
            </span>{" "}
            Violations — including NDA breaches, fraud, platform bypass, or repeated missed
            deadlines — may result in suspension, permanent removal, forfeiture of pending
            payouts, and legal action.
          </p>
          <p>
            This Agreement is governed by the laws of the Republic of India. Disputes are first
            handled through Tech Engi's internal review process, and if unresolved, referred to
            arbitration under the Arbitration and Conciliation Act, 1996.
          </p>
          <p className="text-[var(--text-muted)] italic">
            This is a summary. The complete Builder Agreement, NDA, and Platform Rules apply in
            full and are binding upon acceptance.
          </p>
        </div>

        {!scrolledToEnd && (
          <p className="mx-6 mt-2 text-[10px] text-[var(--text-muted)]">
            Scroll to the bottom to enable acceptance.
          </p>
        )}

        {/* Actions */}
        <div className="px-6 py-5 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onDecline}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            disabled={submitting || !scrolledToEnd}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "I Agree & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}