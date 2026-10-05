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
          Verified Engineers <span className="text-saas-mut">see every open task. First to respond gets it.</span>
        </h2>
        <p className="reveal">
          Every client project is different, so each one is quoted on its own. Engineers on a
          subscription see every open lead and can respond to the ones that fit.
        </p>

        <div className="bento">
          <div className="card reveal relative bento-4 bento-row-2 justify-start! overflow-hidden p-0!">
            <div className="flex items-center justify-between border-b border-saas-line px-7 py-5 text-saas-ink">
              <b>Leads panel</b>
              <span className="text-sm text-saas-mut">All · New · Saved</span>
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
                  Open
                </em>
              </div>
            ))}
            <div 
            onClick={() => setIsOpen(true)}
            className="absolute bottom-8 left-1/2 hover:scale-90 transition-all cursor-pointer -translate-x-1/2 whitespace-nowrap rounded-full bg-saas-nav px-[22px] py-3 font-medium text-white shadow-saas-btn">
              Full panel with a subscription
            </div>
          </div>

          <div className="card reveal bento-2">
            <span className="icon-tile">
              <Briefcase size={26} weight="regular" color="#4F6BEA" />
            </span>
            <h3>Clients get a custom quote</h3>
            <p>Post your brief and get a quote based on scope, skills and timeline.</p>
            <Link href="/register/client" className="btn-outline mt-6 inline-flex">
              Request a quote
            </Link>
          </div>

          <div className="card reveal bento-2">
            <span className="icon-tile">
              <Key size={26} weight="regular" color="#4F6BEA" />
            </span>
            <h3>Engineers Register free and see every open task </h3>
            <p>Filter by domain, respond before it’s taken. </p>
            <Link href="/register/engineer" className="btn mt-6 inline-flex">
              Subscribe for leads
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
