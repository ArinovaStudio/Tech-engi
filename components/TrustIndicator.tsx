"use client";
import { useState } from "react";
import { ShieldCheck, BadgeCheck, Lock, FolderGit2 } from "lucide-react";

const indicators = [
  {
    key: "nda",
    label: "NDA Protected",
    description: "Your project details stay confidential.",
    icon: ShieldCheck,
    cardBg: "#2563EB",
    peekBg: "#1D4ED8",
  },
  {
    key: "verified",
    label: "Verified Clients",
    description: "Every client identity is screened.",
    icon: BadgeCheck,
    cardBg: "#F5A623",
    peekBg: "#D88A0F",
  },
  {
    key: "secure",
    label: "Secure Payments",
    description: "Funds held safely until work is approved.",
    icon: Lock,
    cardBg: "#0EA5E9",
    peekBg: "#0284C7",
  },
  {
    key: "portfolio",
    label: "Portfolio Building",
    description: "Showcase real, completed work.",
    icon: FolderGit2,
    cardBg: "#9333EA",
    peekBg: "#7E22CE",
  },
];

export default function TrustIndicatorCarousel() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center leading-none mb-14">
          <h2 className="text-[50px] lg:text-[85px] font-semibold text-black text-center mb-2 font-sans">
            Why clients
          </h2>
          <span className="text-[#FFAE58] font-semibold text-[3rem] lg:text-[5rem] leading-none font-sans">
            trust us
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
          {indicators.map((item, i) => {
            const Icon = item.icon;
            const isActive = active === i;

            return (
              <div key={item.key} className="relative pt-6">
                {/* Peeking shape behind the card */}
                <div
                  className="absolute left-2 right-2 bottom-0 top-10 rounded-3xl -z-10"
                  style={{ backgroundColor: item.peekBg }}
                />

                {/* Main card */}
                <div
                  onClick={() => setActive(i)}
                  style={{ backgroundColor: item.cardBg }}
                  className={`
                    relative rounded-3xl pt-10 pb-7 px-6 flex flex-col items-center text-center
                    cursor-pointer transition-transform duration-300 ease-out font-sans
                    ${isActive ? "scale-[1.03] shadow-xl" : "shadow-md hover:scale-[1.02]"}
                  `}
                >
                  {/* Icon badge */}
                  <div className="relative mb-7">
                    <div className="relative w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-md">
                      <Icon className="h-9 w-9 text-[#0f172a]" strokeWidth={2} />
                    </div>
                  </div>

                  <p className="text-white text-lg font-semibold tracking-tight mb-2 leading-snug font-sans">
                    {item.label}
                  </p>
                  <p className="text-white/70 text-xs leading-relaxed font-sans mb-2">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}