'use client';

import { Check, Loader2, Clock, CircleDot } from 'lucide-react';

type Step = {
  key: string;
  label: string;
  status: 'PAID' | 'PROCESSING' | 'DUE' | 'NOT_DUE' | 'DONE' | 'PENDING';
  amount: number;
  paidAt: string | null;
};

const LABEL: Record<Step['status'], string> = {
  PAID: 'Paid',
  DONE: 'Done',
  PROCESSING: 'Processing',
  DUE: 'Payment due',
  NOT_DUE: 'Not due yet',
  PENDING: 'Pending',
};

const PaymentStatus = ({ data }: { data?: { steps: Step[] } }) => {
  if (!data?.steps?.length) return null;

  return (
    <div id="payment-status" className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Payment Status</h2>
      <ol className="space-y-4">
        {data.steps.map((step) => {
          const complete = step.status === 'PAID' || step.status === 'DONE';
          const processing = step.status === 'PROCESSING';
          const due = step.status === 'DUE';
          return (
            <li key={step.key} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  complete ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  : processing ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : due ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                }`}
              >
                {complete ? <Check size={16} /> : processing ? <Loader2 size={16} className="animate-spin" /> : due ? <Clock size={16} /> : <CircleDot size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{step.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {LABEL[step.status]}
                  {complete && step.paidAt ? ` · ${new Date(step.paidAt).toLocaleDateString()}` : ''}
                </p>
              </div>
              {step.amount > 0 && (
                <span className="text-sm font-semibold text-gray-900 dark:text-white">₹{step.amount.toLocaleString()}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default PaymentStatus;
