"use client";

import Link from "next/link";

import { Briefcase, Key } from "@phosphor-icons/react/dist/ssr";
import UpgradeProModal from "../PricingPop";
import { useState } from "react";

const LEADS = [
  { title: "production API returning 500s ", meta: "Urgent · From scratch", locked: false },
  { title: "Payment gateway webhook failing", meta: "Embedded · Half built", locked: false },
  { title: "Cloud deployment broken on release", meta: "Student project · Competition", locked: false },
  { title: "PCB redesign for a motor driver", meta: "Electronics · Half built", locked: true },
  { title: "Vision system for a sorting line", meta: "Software · From scratch", locked: true },
];

export default function LeadsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="leads" className="relative dot-grid">
      <UpgradeProModal 
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onUpgrade={() => {}}
      />
      <div className="section-glow" />
      <div className="relative mx-auto max-w-[1200px] px-8">
        <h2 className="reveal max-w-[820px]">
          AI-Matched Projects. <span className="text-saas-mut">No bidding, no race. Matched by stack & domain.</span>
        </h2>
        <p className="reveal">
          Every client project is analyzed and matched with verified engineers based on domain expertise,
          technical stack, and verified experience. No bidding wars, no proposal spam.
        </p>

        <div className="bento">
          <div className="card reveal relative bento-4 bento-row-2 justify-start! overflow-hidden p-0!">
            <div className="flex items-center justify-between border-b border-saas-line px-7 py-5 text-saas-ink">
              <b>Verified project matching</b>
              <span className="text-sm text-saas-mut">AI Matched · Escrow Protected</span>
            </div>
            {LEADS.map((lead) => (
              <div
                key={lead.title}
                className={`flex items-center justify-between gap-4 border-b border-saas-line px-7 py-5 last:border-0 ${
                  lead.locked ? "select-none opacity-55 blur-[4px]" : ""
                }`}
              >
                <div>
                  <b className="block font-medium text-saas-ink">{lead.title}</b>
                  <small className="text-saas-mut">{lead.meta}</small>
                </div>
                <em className="rounded-full bg-[#6EA8FF]/18 px-3 py-1 text-[0.8rem] not-italic text-saas-accent-2">
                  Matched
                </em>
              </div>
            ))}
            <div 
            onClick={() => setIsOpen(true)}
            className="absolute bottom-8 left-1/2 hover:scale-95 transition-all cursor-pointer -translate-x-1/2 whitespace-nowrap rounded-full bg-saas-nav px-[22px] py-3 font-medium text-white shadow-saas-btn">
              Explore engineer matching
            </div>
          </div>

          <div className="card reveal bento-2">
            <span className="icon-tile">
              <Briefcase size={26} weight="regular" color="#4F6BEA" />
            </span>
            <h3>Post a project — 0% client fee</h3>
            <p>Tell us your bug, stack, or project scope. Get an AI-matched engineer in 2 to 24 hours.</p>
            <Link href="/register" className="btn-outline mt-6 inline-flex">
              Request a quote
            </Link>
          </div>

          <div className="card reveal bento-2">
            <span className="icon-tile">
              <Key size={26} weight="regular" color="#4F6BEA" />
            </span>
            <h3>Engineers register free and get matched</h3>
            <p>Keep 97% on your first project (95% after). No bidding credits, no cut-rate contests.</p>
            <Link href="/register" className="btn mt-6 inline-flex">
              Join as an engineer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
