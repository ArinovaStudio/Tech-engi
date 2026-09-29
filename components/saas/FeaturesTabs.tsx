"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Wallet,
  Stack,
  ArrowsLeftRight,
  Target,
  LockKey,
} from "@phosphor-icons/react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Vetted engineers",
    subtitle: "Reviewed before paid work",
    body: "Portfolios and skill checks are reviewed before anyone can take paid work.",
    points: ["Portfolio review", "Skill checks by discipline", "Reviews from past clients"],
    rows: [
      { label: "Mechanical", value: "Verified" },
      { label: "Embedded", value: "Verified" },
      { label: "Reviews", value: "From past clients" },
    ],
  },
  {
    icon: Wallet,
    title: "Milestone payments",
    subtitle: "Held until you approve",
    body: "Funds are held and released only when you approve the work.",
    points: ["Pay per milestone", "Funds held until approval", "Clear release history"],
    rows: [
      { label: "Milestone 1", value: "Released" },
      { label: "Milestone 2", value: "Held" },
      { label: "Milestone 3", value: "Upcoming" },
    ],
  },
  {
    icon: Stack,
    title: "Shared workspace",
    subtitle: "Files, tasks and chat",
    body: "Files, versions, tasks and chat for every project in one place.",
    points: ["Versioned files", "Task board", "Team chat"],
    rows: [
      { label: "Tasks", value: "12 of 18 done" },
      { label: "Files", value: "24 versions" },
      { label: "Chat", value: "3 unread" },
    ],
  },
  {
    icon: ArrowsLeftRight,
    title: "Design and code reviews",
    subtitle: "A second pair of eyes",
    body: "A second engineer checks your circuit, CAD model or pull request.",
    points: ["Request a review in one click", "Comments on the file itself", "Sign-off before payment"],
    rows: [
      { label: "PCB layout", value: "In review" },
      { label: "Gripper CAD", value: "Approved" },
      { label: "Firmware", value: "Changes requested" },
    ],
  },
  {
    icon: Target,
    title: "Skill-gap matching",
    subtitle: "Fill the gaps fast",
    body: "Tell us what your team is missing and we find who fills it.",
    points: ["List the missing skills", "Matched by discipline and past work", "Approve before they join"],
    rows: [
      { label: "Needed", value: "Power electronics" },
      { label: "Match", value: "Found" },
      { label: "Status", value: "Invited" },
    ],
  },
  {
    icon: LockKey,
    title: "NDA and IP templates",
    subtitle: "Ownership from day one",
    body: "Ready-made agreements so ownership is clear from day one.",
    points: ["NDA before files are shared", "IP terms per project", "Credit and revenue split in writing"],
    rows: [
      { label: "NDA", value: "Signed" },
      { label: "IP terms", value: "Agreed" },
      { label: "Split", value: "Recorded" },
    ],
  },
];

export default function FeaturesTabs() {
  const [active, setActive] = useState(0);
  const feature = FEATURES[active];

  return (
    <section>
      <div className="mx-auto max-w-[1200px] px-8">
        <h2 className="reveal max-w-[820px]">
          Everything a project needs, <span className="text-saas-mut">in one workspace.</span>
        </h2>

        <div className="reveal mt-[60px] grid gap-7 md:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-2">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.title}
                  type="button"
                  data-active={active === i}
                  onClick={() => setActive(i)}
                  className="tab-btn"
                >
                  <span className="icon-tile mb-0 h-[46px] w-[46px] flex-none">
                    <Icon size={22} weight="regular" color="#4F6BEA" />
                  </span>
                  <span>
                    <b className="block text-[1.1rem] font-medium text-saas-ink">{f.title}</b>
                    <small className="text-[0.9rem] text-saas-mut">{f.subtitle}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="min-h-[460px] rounded-saas-5xl border border-saas-line bg-white p-11 shadow-saas-panel-lg">
            <h3 className="text-[2rem]">{feature.title}</h3>
            <p>{feature.body}</p>
            <ul className="check-list">
              {feature.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <div className="mock-panel mt-7">
              {feature.rows.map((row) => (
                <div key={row.label} className="mock-row">
                  <span>{row.label}</span>
                  <b className="pill-value">{row.value}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
