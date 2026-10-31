"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Code2,
  Cloud,
  Cpu,
  DraftingCompass,
  CircleHelp,
  Minus,
  Plus,
  ShieldCheck,
  Users,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

type CategoryId = "software" | "cloud" | "ai" | "design" | "hardware" | "unsure";
type ModeId = "fix" | "build" | "finish" | "review" | "cowork";
type Step = 1 | 2 | 3 | 4;

interface ServiceGroup {
  title: string;
  options: string[];
}

interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
  groups: ServiceGroup[];
}

interface WorkMode {
  id: ModeId;
  name: string;
  description: string;
  example: string;
  icon: LucideIcon;
}

const CATEGORIES: Category[] = [
  {
    id: "software",
    name: "Software engineering",
    description: "Web and mobile apps, custom software, bugs and integrations.",
    icon: Code2,
    groups: [
      {
        title: "Debugging & maintenance",
        options: ["Production bug fixing", "Performance issues", "Legacy code takeover", "Refactoring"],
      },
      {
        title: "Web development",
        options: ["Frontend development", "Backend development", "REST / GraphQL APIs"],
      },
      {
        title: "Mobile development",
        options: ["Flutter", "React Native", "Native Android / iOS", "App store release"],
      },
      {
        title: "Custom business software",
        options: ["ERP / CRM", "Billing & inventory", "Internal tools", "Admin dashboards"],
      },
      {
        title: "Integrations & testing",
        options: ["Payment gateways", "Third-party APIs", "Test automation", "Load testing"],
      },
    ],
  },
  {
    id: "cloud",
    name: "Cloud, DevOps & security",
    description: "Deployments, reliability, cloud costs and security reviews.",
    icon: Cloud,
    groups: [
      {
        title: "Deployment & hosting",
        options: ["AWS", "GCP", "Azure", "VPS setup", "Domains & SSL"],
      },
      {
        title: "CI/CD & containers",
        options: ["GitHub Actions", "Docker", "Kubernetes"],
      },
      {
        title: "Reliability",
        options: ["Monitoring & logging", "Uptime & alerting", "Incident fixes"],
      },
      {
        title: "Optimisation & security",
        options: ["Cloud cost reduction", "Server migration", "Security audit", "Website hardening"],
      },
    ],
  },
  {
    id: "ai",
    name: "AI, data & automation",
    description: "AI features, data pipelines, analytics and everyday automation.",
    icon: Zap,
    groups: [
      {
        title: "AI & machine learning",
        options: ["LLM chatbot", "AI features in an existing app", "Model training", "Computer vision"],
      },
      {
        title: "Data",
        options: ["ETL pipelines", "Database design", "Data cleaning", "Custom dashboards"],
      },
      {
        title: "Automation",
        options: ["Python scripting", "n8n / Zapier workflows", "Excel / Sheets automation"],
      },
    ],
  },
  {
    id: "design",
    name: "Design",
    description: "Digital interfaces, product concepts and three-dimensional design.",
    icon: DraftingCompass,
    groups: [
      {
        title: "UI/UX design",
        options: ["Mobile app UI", "Web app UI", "Wireframes & prototypes", "Design systems"],
      },
      {
        title: "Product & industrial design",
        options: ["Concept sketches", "Form design", "Ergonomics"],
      },
      {
        title: "3D design",
        options: ["3D modelling", "Product rendering", "Product demo animation"],
      },
    ],
  },
  {
    id: "hardware",
    name: "Mechanical & electronics",
    description: "CAD, manufacturing design, electronics, embedded systems and IoT.",
    icon: Cpu,
    groups: [
      {
        title: "Mechanical CAD",
        options: ["SolidWorks", "Fusion 360", "CATIA", "2D drawings & GD&T"],
      },
      {
        title: "Manufacturing & prototyping",
        options: ["DFM / DFA review", "Sheet metal", "Enclosures", "3D printing"],
      },
      {
        title: "Electronics",
        options: ["PCB design", "Embedded firmware", "IoT", "Robotics"],
      },
    ],
  },
  {
    id: "unsure",
    name: "Not sure yet",
    description: "Describe the problem in your own words and we will help you scope it.",
    icon: CircleHelp,
    groups: [],
  },
];

const MODES: WorkMode[] = [
  {
    id: "fix",
    name: "Fix",
    description: "Something is broken and needs to work again.",
    example: "A crash, error, wrong output or slow page",
    icon: Wrench,
  },
  {
    id: "build",
    name: "Build",
    description: "Start from an idea and create something new.",
    example: "A new app, tool or product design",
    icon: Cpu,
  },
  {
    id: "finish",
    name: "Finish",
    description: "Continue a project that is already underway.",
    example: "A handover, unfinished build or close deadline",
    icon: Code2,
  },
  {
    id: "review",
    name: "Review & mentor",
    description: "Get guidance while you build and learn.",
    example: "Student projects, capstones, hackathons or code review",
    icon: Users,
  },
  {
    id: "cowork",
    name: "Co-worker for a day",
    description: "Work alongside a verified freelancer for a full working day.",
    example: "Pairing, debugging, reviews or an overloaded sprint",
    icon: Clock3,
  },
];

const STEP_NAMES = ["What", "Service", "Approach", "Brief"];

function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function isCategoryId(value: string | undefined): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}

function isModeId(value: string | undefined): value is ModeId {
  return MODES.some((mode) => mode.id === value);
}

export default function ProjectBriefFlow({
  initialCategory,
  initialMode,
}: {
  initialCategory?: string;
  initialMode?: string;
}) {
  const router = useRouter();
  const startCategory = isCategoryId(initialCategory) ? initialCategory : null;
  const [step, setStep] = useState<Step>(startCategory ? (startCategory === "unsure" ? 3 : 2) : 1);
  const [categoryId, setCategoryId] = useState<CategoryId | null>(startCategory);
  const [services, setServices] = useState<string[]>([]);
  const [modeId, setModeId] = useState<ModeId | null>(isModeId(initialMode) ? initialMode : null);
  const [days, setDays] = useState(1);
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");

  const category = CATEGORIES.find((item) => item.id === categoryId) ?? null;
  const mode = MODES.find((item) => item.id === modeId) ?? null;
  const totalBudget = modeId === "cowork" ? days * 3480 : Number(budget) || 0;
  const upfront = totalBudget ? Math.round(totalBudget * 0.25) : null;
  const remaining = totalBudget && upfront !== null ? totalBudget - upfront : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(`brief-step-${step}`)?.focus({ preventScroll: true });
  }, [step]);

  function chooseCategory(id: CategoryId) {
    if (categoryId !== id) {
      setServices([]);
    }
    setCategoryId(id);
    setStep(id === "unsure" ? 3 : 2);
  }

  function toggleService(service: string) {
    setServices((selected) =>
      selected.includes(service)
        ? selected.filter((item) => item !== service)
        : [...selected, service],
    );
  }

  function continueToMode() {
    if (categoryId && categoryId !== "unsure" && services.length === 0) return;
    setStep(3);
  }

  function continueToRegister() {
    if (!categoryId || !modeId) return;

    const params = new URLSearchParams({ cat: categoryId, mode: modeId });
    if (services.length) params.set("svc", services.join("|"));
    if (modeId === "cowork") params.set("days", String(days));
    if (totalBudget) params.set("budget", String(totalBudget));

    try {
      sessionStorage.setItem("te_brief", description.trim());
    } catch {
      setError("Your browser could not save this brief. Please allow session storage and try again.");
      return;
    }

    router.push(`/register/client?${params.toString()}`);
  }

  return (
    <>
      <header className="sticky top-16 z-[8] bg-white/95 backdrop-blur-sm md:top-[76px]">
        <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <div className="mb-2 flex justify-between text-xs font-medium text-saas-tx">
              <span>Step {step} of 4</span>
              <span>{STEP_NAMES[step - 1]}</span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Project brief progress"
              aria-valuemin={1}
              aria-valuemax={4}
              aria-valuenow={step}
            >
              <div
                className="h-full rounded-full bg-[#FFDE21] transition-[width] duration-300"
                style={{ width: `${step * 25}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-8">
        <div>
          {step === 1 && (
            <section aria-labelledby="brief-step-1">
              <StepHeading
                step={step}
                title="What do you need help with?"
                description="Choose the closest fit. You can change your selections before creating an account."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {CATEGORIES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => chooseCategory(item.id)}
                      aria-pressed={categoryId === item.id}
                      className="group flex min-h-48 flex-col items-start rounded-3xl bg-slate-50 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFDE21]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFDE21] aria-pressed:bg-[#FFDE21]/30 aria-pressed:ring-2 aria-pressed:ring-[#FFDE21]"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFDE21]/40 text-amber-950 transition-colors group-hover:bg-[#FFDE21]/70">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="mt-4 font-semibold text-saas-ink">{item.name}</span>
                      <span className="mt-2 text-sm leading-relaxed text-saas-tx">
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 2 && category && (
            <section aria-labelledby="brief-step-2">
              <BackButton onClick={() => setStep(1)} label="Change category" />
              <StepHeading
                step={step}
                title="Which services are closest?"
                description="Select one or more. If you are not sure, you can skip this and explain in your own words."
              />
              <div className="space-y-4">
                {category.groups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-3xl bg-slate-50 p-5 sm:p-6"
                  >
                    <h3 className="text-base font-semibold text-saas-ink">{group.title}</h3>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {group.options.map((option) => {
                        const selected = services.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleService(option)}
                            aria-pressed={selected}
                            className="flex min-h-11 items-center gap-3 rounded-xl bg-white px-3.5 py-2 text-left text-sm text-saas-tx transition-colors hover:bg-[#FFDE21]/15 aria-pressed:bg-[#FFDE21]/30 aria-pressed:text-saas-ink"
                          >
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${
                                selected
                                  ? "bg-[#FFDE21] text-slate-950"
                                  : "bg-slate-100"
                              }`}
                            >
                              {selected && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={continueToMode}
                  disabled={services.length === 0}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFDE21] px-6 font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f2d01e] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Continue{services.length ? ` with ${services.length} selected` : ""}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setServices([]);
                    setStep(3);
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 font-medium text-saas-ink transition-colors hover:bg-[#FFDE21]/35"
                >
                  Skip for now
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section aria-labelledby="brief-step-3">
              <BackButton
                onClick={() => setStep(categoryId === "unsure" ? 1 : 2)}
                label="Back"
              />
              <StepHeading
                step={step}
                title="Where are you starting from?"
                description="This helps us find the right kind of engineer for the work."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {MODES.map((item) => {
                  const Icon = item.icon;
                  const isCowork = item.id === "cowork";
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setModeId(item.id);
                        setStep(4);
                      }}
                      aria-pressed={modeId === item.id}
                      className={`flex min-h-48 items-start gap-4 rounded-3xl bg-slate-50 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FFDE21]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFDE21] aria-pressed:bg-[#FFDE21]/30 aria-pressed:ring-2 aria-pressed:ring-[#FFDE21] ${
                        isCowork ? "sm:col-span-2" : ""
                      }`}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFDE21]/40 text-amber-950">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-saas-ink">{item.name}</span>
                        <span className="mt-2 block text-sm leading-relaxed text-saas-tx">
                          {item.description}
                        </span>
                        <span className="mt-3 block text-sm text-saas-mut">{item.example}</span>
                      </span>
                      {isCowork && (
                        <span className="shrink-0 text-right">
                          <span className="block text-xl font-bold text-saas-ink">₹3,480</span>
                          <span className="text-xs text-saas-tx">per working day</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {step === 4 && mode && (
            <section aria-labelledby="brief-step-4">
              <BackButton onClick={() => setStep(3)} label="Back" />
              <StepHeading
                step={step}
                title="Tell us a little more."
                description="A few plain-language details help us understand what you need. You can add more after creating your account."
              />
              <div className="rounded-3xl bg-slate-50 p-5 sm:p-7">
                <label htmlFor="project-description" className="block text-sm font-semibold text-saas-ink">
                  {modeId === "fix"
                    ? "What is broken?"
                    : modeId === "build"
                      ? "What would you like to build?"
                      : modeId === "finish"
                        ? "What is done, and what is left?"
                        : modeId === "review"
                          ? "What are you working on, and where are you stuck?"
                          : "What should you work on together?"}
                </label>
                <textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setError("");
                  }}
                  rows={5}
                  placeholder="A short description is enough to get started."
                  className="mt-2 w-full resize-y rounded-2xl border border-saas-line bg-white px-4 py-3 text-base text-saas-ink outline-none transition-colors placeholder:text-saas-mut focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/40"
                />
                <p className="mt-2 text-sm text-saas-tx">
                  Optional. Keep sensitive information out of this description.
                </p>

                {modeId === "cowork" ? (
                  <div className="mt-7 border-t border-saas-line pt-6">
                    <label className="text-sm font-semibold text-saas-ink">Number of working days</label>
                    <div className="mt-3 flex items-center gap-4">
                      <button
                        type="button"
                        aria-label="Fewer days"
                        disabled={days <= 1}
                        onClick={() => setDays((count) => Math.max(1, count - 1))}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-saas-ink transition-colors hover:bg-[#FFDE21]/35 disabled:opacity-40"
                      >
                        <Minus aria-hidden="true" className="h-5 w-5" />
                      </button>
                      <span aria-live="polite" className="min-w-24 text-center font-semibold text-saas-ink">
                        {days} {days === 1 ? "day" : "days"}
                      </span>
                      <button
                        type="button"
                        aria-label="More days"
                        disabled={days >= 30}
                        onClick={() => setDays((count) => Math.min(30, count + 1))}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-saas-ink transition-colors hover:bg-[#FFDE21]/35 disabled:opacity-40"
                      >
                        <Plus aria-hidden="true" className="h-5 w-5" />
                      </button>
                      <span className="text-sm text-saas-tx">₹3,480 per working day</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-7 border-t border-saas-line pt-6">
                    <label htmlFor="project-budget" className="text-sm font-semibold text-saas-ink">
                      Your budget
                    </label>
                    <div className="mt-2 flex items-center rounded-2xl border border-saas-line px-4 focus-within:border-slate-500">
                      <span className="text-saas-tx">₹</span>
                      <input
                        id="project-budget"
                        type="number"
                        min="0"
                        step="500"
                        inputMode="numeric"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        placeholder="Not sure yet"
                        className="min-h-12 w-full border-0 bg-transparent px-2 text-base text-saas-ink outline-none placeholder:text-saas-mut"
                      />
                    </div>
                    <p className="mt-2 text-sm text-saas-tx">
                      A rough estimate is fine. You can leave this blank.
                    </p>
                  </div>
                )}

                <div className="mt-7 rounded-2xl bg-slate-50 p-4 sm:p-5" aria-live="polite">
                  <div className="flex justify-between gap-4 py-2 text-sm text-saas-tx">
                    <span>Client platform fee</span>
                    <span className="font-semibold text-slate-700">₹0</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-saas-line py-2 text-sm text-saas-tx">
                    <span>Upfront to confirm (25%)</span>
                    <span className="font-semibold text-saas-ink">
                      {upfront === null ? "Based on your budget" : formatInr(upfront)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 py-2 text-sm text-saas-tx">
                    <span>Released by milestone (75%)</span>
                    <span className="font-semibold text-saas-ink">
                      {remaining === null ? "Based on your budget" : formatInr(remaining)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-saas-line pt-3 text-sm font-semibold text-saas-ink">
                    <span>Total project budget</span>
                    <span>{totalBudget ? formatInr(totalBudget) : "Your budget"}</span>
                  </div>
                </div>
              </div>

              {error && (
                <p role="alert" className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </p>
              )}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={continueToRegister}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFDE21] px-6 font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f2d01e]"
                >
                  Create account &amp; get matched
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
                <p className="mt-3 text-sm text-saas-tx">
                  Free to create an account. Nothing is charged until you confirm a project.
                </p>
              </div>
            </section>
          )}
        </div>

        <aside className="rounded-3xl bg-slate-50 p-5 lg:sticky lg:top-28">
          <h2 className="text-lg font-semibold text-saas-ink">Your project so far</h2>
          <dl className="mt-4 divide-y divide-slate-200">
            <SummaryItem label="Category" value={category?.name ?? "Choose a category"} />
            <SummaryItem
              label="Services"
              value={services.length ? services.join(", ") : categoryId ? "Not selected" : "—"}
            />
            <SummaryItem label="Approach" value={mode?.name ?? "—"} />
            <SummaryItem
              label="Budget"
              value={totalBudget ? formatInr(totalBudget) : "Not set"}
            />
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-saas-tx">
            You pay the agreed project budget. The first 25% is held in escrow, and the rest is
            released as you approve milestones.
          </p>
          <div className="mt-5 flex items-start gap-2 border-t border-saas-line pt-4 text-sm text-saas-tx">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
            <span>Verified freelancers, no bidding, and milestone-based payments.</span>
          </div>
        </aside>
      </main>
    </>
  );
}

function StepHeading({
  step,
  title,
  description,
}: {
  step: Step;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-sm font-medium text-saas-mut">Step {step} · {STEP_NAMES[step - 1]}</p>
      <h1
        id={`brief-step-${step}`}
        tabIndex={-1}
        className="mt-2 text-balance font-sans text-3xl font-bold tracking-tight text-saas-ink outline-none sm:text-4xl"
      >
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-saas-tx">{description}</p>
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-saas-tx transition-colors hover:bg-slate-100 hover:text-saas-ink"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3">
      <dt className="text-xs font-medium text-saas-mut">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-saas-ink">{value}</dd>
    </div>
  );
}
