"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Tag, X } from "lucide-react";

export interface PromoQuoteView {
  code: string;
  percentage: number;
  discountAmount: number;
  amountDue: number;
}

interface PromoCodeFieldProps {
  budget: number;
  disabled?: boolean;
  onPromoChange: (promo: PromoQuoteView | null) => void;
}

export function PromoCodeField({
  budget,
  disabled = false,
  onPromoChange,
}: PromoCodeFieldProps) {
  const [code, setCode] = useState("");
  const [promo, setPromo] = useState<PromoQuoteView | null>(null);
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const onPromoChangeRef = useRef(onPromoChange);

  useEffect(() => {
    onPromoChangeRef.current = onPromoChange;
  }, [onPromoChange]);

  useEffect(() => {
    setCode("");
    setPromo(null);
    setError("");
    onPromoChangeRef.current(null);
  }, [budget]);

  const applyCode = async () => {
    setValidating(true);
    setError("");
    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, budget }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || "Could not apply promo code.");
        return;
      }

      setPromo(data.promo);
      setCode(data.promo.code);
      onPromoChangeRef.current(data.promo);
    } catch {
      setError("Could not validate promo code. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  const removeCode = () => {
    setPromo(null);
    setCode("");
    setError("");
    onPromoChangeRef.current(null);
  };

  const inputCls =
    "min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)]";

  return (
    <div className="rounded-lg border border-[var(--border)] p-3">
      <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
        <Tag size={13} /> Promo code for your advance
      </label>
      {promo ? (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
          <span className="flex min-w-0 items-center gap-2">
            <Check size={15} className="shrink-0" />
            <span className="truncate">
              <strong>{promo.code}</strong> · {promo.percentage}% off (−₹
              {promo.discountAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              )
            </span>
          </span>
          <button
            type="button"
            onClick={removeCode}
            disabled={disabled}
            aria-label="Remove promo code"
            className="shrink-0 rounded p-1 hover:bg-green-100 disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            className={inputCls}
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setError("");
            }}
            placeholder="Enter code"
            maxLength={32}
            disabled={disabled || validating}
            aria-label="Promo code"
          />
          <button
            type="button"
            onClick={applyCode}
            disabled={disabled || validating || !code.trim()}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg)] disabled:opacity-50"
          >
            {validating && <Loader2 size={13} className="animate-spin" />}
            Apply
          </button>
        </div>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
