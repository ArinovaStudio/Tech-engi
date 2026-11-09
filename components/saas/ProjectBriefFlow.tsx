"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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

const MIN_PROJECT_BUDGET = 2000;
const BRIEF_DRAFT_KEY = "te_project_brief_draft";

type CategoryId = "software" | "cloud" | "ai" | "design" | "hardware" | "unsure";
type ModeId = "fix" | "build" | "finish" | "review" | "cowork";
type Step = 1 | 2 | 3 | 4;

interface ProjectBriefDraft {
  step: Step;
  categoryId: CategoryId | null;
  services: string[];
  otherDetails: Record<string, string>;
  modeId: ModeId | null;
  days: number;
  description: string;
  budget: string;
  email: string;
  phone: string;
}

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
    name: "Website / Apps development",
    description: "Web and mobile apps, custom software, bugs and integrations.",
    icon: Code2,
    groups: [
      {
        title: "Web development",
        options: ["Business Website", "SAAS Application", "Full-stack development", "Web app deployment", "Frontend development", "Backend development", "Apps Development", "something else"],
      },
      {
        title: "Debugging & maintenance",
        options: ["Production bug fixing", "Performance issues", "Legacy code takeover", "Refactoring", "Something else"],
      },
      {
        title: "Mobile development",
        options: ["Flutter", "React Native", "Native Android / iOS", "App store release", "Cross platform App", "Mobile app deployment", "SAAS App", "something else"],
      },
      {
        title: "Custom business software",
        options: ["ERP / CRM", "Billing & inventory", "Internal tools", "Admin dashboards", "something else"],
      },
      {
        title: "Integrations & testing",
        options: ["Payment gateways", "Third-party APIs", "Test automation", "Load testing", "something else"],
      },
    ],
  },
  {
    id: "cloud",
    name: "Deployment, Security & Fixes",
    description: "Deployments, reliability, cloud costs and security reviews.",
    icon: Cloud,
    groups: [
      {
        title: "Deployment & hosting",
        options: ["AWS", "GCP", "Azure", "VPS setup", "Domains & SSL", "something else"],
      },
      {
        title: "CI/CD & containers",
        options: ["GitHub Actions", "Docker", "Kubernetes", "something else"],
      },
      {
        title: "Reliability",
        options: ["Monitoring & logging", "Uptime & alerting", "Incident fixes", "something else"],
      },
      {
        title: "Optimisation & security",
        options: ["Cloud cost reduction", "Server migration", "Security audit", "Website hardening", "something else"],
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
        options: ["LLM chatbot", "AI features in an existing app", "Model training", "Computer vision", "something else"],
      },
      {
        title: "Data",
        options: ["ETL pipelines", "Database design", "Data cleaning", "Custom dashboards", "something else"],
      },
      {
        title: "Automation",
        options: ["Python scripting", "n8n / Zapier workflows", "Excel / Sheets automation", "something else"],
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
        options: ["Mobile app UI", "Web app UI", "Wireframes & prototypes", "Design systems", "something else"],
      },
      {
        title: "Product & industrial design",
        options: ["Concept sketches", "Form design", "Ergonomics", "something else"],
      },
      {
        title: "3D design",
        options: ["3D modelling", "Product rendering", "Product demo animation", "something else"],
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
        options: ["SolidWorks", "Fusion 360", "CATIA", "2D drawings & GD&T", "something else"],
      },
      {
        title: "Manufacturing & prototyping",
        options: ["DFM / DFA review", "Sheet metal", "Enclosures", "3D printing", "something else"],
      },
      {
        title: "Electronics",
        options: ["PCB design", "Embedded firmware", "IoT", "Robotics", "something else"],
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
    id: "build",
    name: "Build",
    description: "Start from an idea and create something new.",
    example: "A new app, tool or product design",
    icon: Cpu,
  },
  {
    id: "fix",
    name: "Fix",
    description: "Something is broken and needs to work again.",
    example: "A crash, error, wrong output or slow page",
    icon: Wrench,
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
  // {
  //   id: "cowork",
  //   name: "Co-worker for a day",
  //   description: "Work alongside a verified freelancer for a full working day.",
  //   example: "Pairing, debugging, reviews or an overloaded sprint",
  //   icon: Clock3,
  // },
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

function isStep(value: unknown): value is Step {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

function serviceSelectionKey(group: string, service: string): string {
  return `${group}::${service}`;
}

function isEmail(value: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(value.trim());
}

function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^[+\d()\s.-]+$/.test(value) && digits.length >= 7 && digits.length <= 15;
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
  const [otherDetails, setOtherDetails] = useState<Record<string, string>>({});
  const [modeId, setModeId] = useState<ModeId | null>(isModeId(initialMode) ? initialMode : null);
  const [days, setDays] = useState(1);
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const lastSentSnapshot = useRef<string | null>(null);

  const category = CATEGORIES.find((item) => item.id === categoryId) ?? null;
  const mode = MODES.find((item) => item.id === modeId) ?? null;
  const selectedServices = category?.groups.flatMap((group) =>
    group.options
      .filter((option) => services.includes(serviceSelectionKey(group.title, option)))
      .map((option) => ({ group: group.title, option })),
  ) ?? [];
  const serviceLabels = selectedServices.map(({ group, option }) => `${group}: ${option}`);
  const customServices = Object.entries(otherDetails)
    .filter(([, detail]) => detail.trim())
    .map(([group, detail]) => `${group}: ${detail.trim()}`);
  const hasInvalidBudget =
    budget.trim() !== "" &&
    (!Number.isFinite(Number(budget)) || Number(budget) < MIN_PROJECT_BUDGET);
  const totalBudget = modeId === "cowork" ? days * 3480 : Number(budget) || 0;
  const upfront = totalBudget ? Math.round(totalBudget * 0.25) : null;
  const remaining = totalBudget && upfront !== null ? totalBudget - upfront : null;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BRIEF_DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved) as Partial<ProjectBriefDraft>;
        if (draft && typeof draft === "object") {
          const savedCategory =
            typeof draft.categoryId === "string" ? draft.categoryId : undefined;
          if (!startCategory && isCategoryId(savedCategory)) {
            setCategoryId(savedCategory);
          }
          const canRestoreSelections = !startCategory || draft.categoryId === startCategory;
          if (canRestoreSelections && Array.isArray(draft.services)) {
            setServices(draft.services.filter((service): service is string => typeof service === "string"));
          }
          if (
            canRestoreSelections &&
            draft.otherDetails &&
            typeof draft.otherDetails === "object" &&
            !Array.isArray(draft.otherDetails)
          ) {
            setOtherDetails(
              Object.fromEntries(
                Object.entries(draft.otherDetails).filter(
                  (entry): entry is [string, string] => typeof entry[1] === "string",
                ),
              ),
            );
          }
          const savedMode = typeof draft.modeId === "string" ? draft.modeId : undefined;
          if (!initialMode && isModeId(savedMode)) setModeId(savedMode);
          if (typeof draft.days === "number" && Number.isInteger(draft.days)) {
            setDays(Math.min(30, Math.max(1, draft.days)));
          }
          if (typeof draft.description === "string") setDescription(draft.description);
          if (typeof draft.budget === "string") setBudget(draft.budget);
          if (typeof draft.email === "string") setEmail(draft.email);
          if (typeof draft.phone === "string") setPhone(draft.phone);
          if (!startCategory && isStep(draft.step)) setStep(draft.step);
        }
      }

      const heroDescription = localStorage.getItem("req")?.trim();
      if (heroDescription) {
        setDescription(heroDescription);
        localStorage.removeItem("req");
      }
    } catch (storageError) {
      console.error("Could not restore the project brief draft:", storageError);
    } finally {
      setDraftLoaded(true);
    }
  }, [initialMode, startCategory]);

  useEffect(() => {
    if (!draftLoaded) return;
    const draft: ProjectBriefDraft = {
      step,
      categoryId,
      services,
      otherDetails,
      modeId,
      days,
      description,
      budget,
      email,
      phone,
    };
    try {
      localStorage.setItem(BRIEF_DRAFT_KEY, JSON.stringify(draft));
    } catch (storageError) {
      console.error("Could not save the project brief draft:", storageError);
    }
  }, [
    budget,
    categoryId,
    days,
    description,
    draftLoaded,
    email,
    modeId,
    otherDetails,
    phone,
    services,
    step,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(`brief-step-${step}`)?.focus({ preventScroll: true });
  }, [step]);

  function chooseCategory(id: CategoryId) {
    if (categoryId !== id) {
      setServices([]);
      setOtherDetails({});
    }
    setCategoryId(id);
    setStep(id === "unsure" ? 3 : 2);
  }

  function toggleService(service: string, groupTitle: string) {
    const selectionKey = serviceSelectionKey(groupTitle, service);
    const isSelected = services.includes(selectionKey);
    setServices((selected) =>
      isSelected
        ? selected.filter((item) => item !== selectionKey)
        : [...selected, selectionKey],
    );
    if (service.toLowerCase() === "something else") {
      setOtherDetails((details) => {
        if (isSelected) {
          const next = { ...details };
          delete next[groupTitle];
          return next;
        }
        return details;
      });
    }
  }

  function buildLeadSnapshot() {
    return JSON.stringify({
      categoryId,
      services,
      otherDetails,
      modeId,
      days,
      description: description.trim(),
      budget: totalBudget || null,
      email: email.trim(),
      phone: phone.trim(),
    });
  }

  async function sendLead(allowPartialContact = false): Promise<boolean> {
    const snapshot = buildLeadSnapshot();
    if (lastSentSnapshot.current === snapshot) return true;

    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/project-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: category?.name ?? "",
          services: serviceLabels,
          otherDetails,
          mode: mode?.name ?? "",
          days: modeId === "cowork" ? days : undefined,
          budget: totalBudget || undefined,
          description: description.trim(),
          email: email.trim(),
          phone: phone.trim(),
          allowPartialContact,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "We couldn't send your brief. Please try again.");
        return false;
      }
      lastSentSnapshot.current = snapshot;
      return true;
    } catch (sendError) {
      console.error("Could not send the project brief:", sendError);
      setError("We couldn't send your brief right now. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBriefBack() {
    if (email.trim() || phone.trim()) {
      const sent = await sendLead(true);
      if (!sent) return;
      setSuccess("We've received your project details and will be in touch.");
    }
    setStep(3);
  }

  async function submitBrief(createAccount: boolean) {
    if (!isEmail(email)) {
      setError("Enter a valid email address to send your project brief.");
      return;
    }
    if (!isPhone(phone)) {
      setError("Enter a valid phone number to send your project brief.");
      return;
    }
    if (!categoryId || !modeId) {
      setError("Choose a category and approach before sending your brief.");
      return;
    }
    if (hasInvalidBudget) {
      setError("Budget must be at least ₹2,000, or leave it blank if you are not sure yet.");
      return;
    }
    if (!(await sendLead())) return;

    if (createAccount) {
      const params = new URLSearchParams({ cat: categoryId, mode: modeId });
      if (selectedServices.length) {
        params.set("svc", selectedServices.map(({ option }) => option).join("|"));
      }
      if (modeId === "cowork") params.set("days", String(days));
      if (totalBudget) params.set("budget", String(totalBudget));

      try {
        const accountDescription = [
          description.trim(),
          ...(customServices.length ? [`Other service details:\n${customServices.join("\n")}`] : []),
        ]
          .filter(Boolean)
          .join("\n\n");
        sessionStorage.setItem("te_brief", accountDescription);
      } catch (storageError) {
        console.error("Could not save the project description for registration:", storageError);
      }
      router.push(`/register/client?${params.toString()}`);
      return;
    }
    setSuccess("Your brief is on its way. Our team will contact you shortly.");
  }

  function continueToMode() {
    if (categoryId && categoryId !== "unsure" && services.length === 0) return;
    setStep(3);
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
                description="Choose the closest fit. You can change your selections before sending your brief."
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
                {category.groups.map((group) => {
                  const otherOption = group.options.find(
                    (option) => option.toLowerCase() === "something else",
                  );
                  const otherSelected =
                    otherOption !== undefined &&
                    services.includes(serviceSelectionKey(group.title, otherOption));
                  return (
                    <div
                      key={group.title}
                      className="rounded-3xl bg-slate-50 p-5 sm:p-6"
                    >
                    <h3 className="text-base font-semibold text-saas-ink">{group.title}</h3>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {group.options.map((option) => {
                        const selected = services.includes(serviceSelectionKey(group.title, option));
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleService(option, group.title)}
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
                    {otherSelected && (
                      <div className="mt-4">
                        <label
                          htmlFor={`other-service-${category.id}-${group.title}`}
                          className="block text-sm font-medium text-saas-tx"
                        >
                          What else do you need for {group.title.toLowerCase()}?
                        </label>
                        <input
                          id={`other-service-${category.id}-${group.title}`}
                          type="text"
                          value={otherDetails[group.title] ?? ""}
                          onChange={(event) =>
                            setOtherDetails((details) => ({
                              ...details,
                              [group.title]: event.target.value,
                            }))
                          }
                          maxLength={500}
                          placeholder="Tell us what you have in mind"
                          className="mt-2 min-h-11 w-full rounded-xl border border-saas-line bg-white px-3.5 py-2 text-sm text-saas-ink outline-none focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/40"
                        />
                      </div>
                    )}
                    </div>
                  );
                })}
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
                    setOtherDetails({});
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
              <BackButton
                onClick={handleBriefBack}
                label={isSubmitting ? "Sending before going back…" : "Back"}
                disabled={isSubmitting}
              />
              <StepHeading
                step={step}
                title="Tell us a little more."
                description="A few plain-language details help us understand what you need. Send your brief with or without creating an account."
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
                  Keep sensitive information out of this description.
                </p>

                <div className="mt-7 grid gap-4 border-t border-saas-line pt-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="project-email" className="block text-sm font-semibold text-saas-ink">
                      Email address <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="project-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      maxLength={254}
                      placeholder="you@example.com"
                      className="mt-2 min-h-12 w-full rounded-2xl border border-saas-line bg-white px-4 text-base text-saas-ink outline-none focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/40"
                    />
                  </div>
                  <div>
                    <label htmlFor="project-phone" className="block text-sm font-semibold text-saas-ink">
                      Phone number <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="project-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value);
                        setError("");
                      }}
                      maxLength={24}
                      placeholder="Include country code if outside India"
                      className="mt-2 min-h-12 w-full rounded-2xl border border-saas-line bg-white px-4 text-base text-saas-ink outline-none focus:border-[#FFDE21] focus:ring-2 focus:ring-[#FFDE21]/40"
                    />
                  </div>
                </div>
                <p className="mt-2 text-sm text-saas-tx">
                  We need both details to send your brief and follow up.
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
                        min={MIN_PROJECT_BUDGET}
                        step="500"
                        inputMode="numeric"
                        value={budget}
                        onChange={(event) => {
                          setBudget(event.target.value);
                          setError("");
                        }}
                        placeholder="Min ₹2,000"
                        className="min-h-12 w-full border-0 bg-transparent px-2 text-base text-saas-ink outline-none placeholder:text-saas-mut"
                      />
                    </div>
                    <p className={`mt-2 text-sm ${hasInvalidBudget ? "text-red-700" : "text-saas-tx"}`}>
                      {hasInvalidBudget
                        ? "Enter at least ₹2,000 or clear the field to continue without a budget."
                        : "A rough estimate is fine. You can leave this blank."}
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
              {success && (
                <p role="status" className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  {success}
                </p>
              )}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => void submitBrief(true)}
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FFDE21] px-6 font-semibold text-slate-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f2d01e] disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? "Sending your brief…" : "Get my project started"}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
                <br />
                {/* <p className="mt-3 text-sm text-saas-tx">
                  We’ll email your brief to our team, then you can create an account to manage your project.
                </p> */}
                <button
                  type="button"
                  onClick={() => void submitBrief(false)}
                  disabled={isSubmitting}
                  className="mt-3 inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium text-saas-tx underline underline-offset-4 transition-colors hover:text-saas-ink disabled:cursor-wait disabled:opacity-60"
                >
                  Send my brief without creating an account
                </button>
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
              value={serviceLabels.length ? serviceLabels.join(", ") : categoryId ? "Not selected" : "—"}
            />
            {customServices.map((service) => (
              <SummaryItem key={service} label="Something else" value={service} />
            ))}
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

function BackButton({
  onClick,
  label,
  disabled = false,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-saas-tx transition-colors hover:bg-slate-100 hover:text-saas-ink disabled:cursor-wait disabled:opacity-60"
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
