import React from "react";
import { ShieldCheck, Award, Lock, CheckCircle2 } from "lucide-react";

const TRUST_FACTS = [
  {
    icon: Award,
    badge: "Govt. Recognized",
    title: "DPIIT & MSME",
    subtitle: "TSquareY1 OPC Pvt Ltd, Chennai",
  },
  {
    icon: ShieldCheck,
    badge: "100% Identity Checked",
    title: "Aadhaar & PAN",
    subtitle: "Experience vetted before matching",
  },
  {
    icon: Lock,
    badge: "Escrow Protection",
    title: "Milestone Escrow",
    subtitle: "Released only on client sign-off",
  },
  {
    icon: CheckCircle2,
    badge: "Zero Hidden Costs",
    title: "0% Client Fee",
    subtitle: "Engineers keep 97% on 1st, 95% after",
  },
];

export default function StatsBar() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="mt-10 grid grid-cols-2 rounded-saas-4xl border border-saas-line bg-white p-4 shadow-saas-panel sm:mt-14 sm:p-6 md:mt-[72px] md:grid-cols-4 md:p-8">
        {TRUST_FACTS.map((fact, i) => {
          const Icon = fact.icon;
          return (
            <div
              key={fact.title}
              className={[
                "flex flex-col justify-between px-3 py-4 sm:px-5 md:py-2 lg:px-6",
                // mobile (2x2): vertical divider on right column, horizontal on bottom row
                i % 2 === 1 ? "border-l border-saas-line md:border-l-0" : "",
                i >= 2 ? "border-t border-saas-line md:border-t-0" : "",
                // desktop (1x4): vertical divider between all but the first
                i > 0 ? "md:border-l md:border-saas-line" : "",
              ].join(" ")}
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{fact.badge}</span>
              </div>
              <div className="mt-2 text-xl font-bold tracking-tight text-saas-ink sm:text-2xl">
                {fact.title}
              </div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {fact.subtitle}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}