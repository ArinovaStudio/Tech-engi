"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { CustomSelect } from "../ui/select";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/s";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export interface ProjectReviewFormData {
  name: string;
  email: string;
  number: string;
  domain: string;
  challenge: string;
  timeline: string;
  hear: string;
}

export interface ProjectReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<ProjectReviewFormData>;
}

/* ---------------------------------- */
/* Static options                     */
/* ---------------------------------- */

const USER_TYPES = [
  "Student",
  "Freelancer",
  "Startup",
  "Company",
  "Researcher",
];

const DOMAINS = [
  "Embedded Systems",
  "ESP32",
  "Arduino",
  "PCB Design",
  "Firmware",
  "AI",
  "IoT",
  "Robotics",
  "Drone",
];

const TIMELINE = [
  "Today",
  "Within 3 Days",
  "This Week",
  "This Month",
  "No Hurry",
];

const HEAR = [
  "Instagram",
  "Facebook",
  "Linkedin",
  "YouTube",
  "Google",
  "Friend",
  "Other",
];

const STAGES = ["Idea", "Prototype", "Development", "Testing", "Manufacturing"];

const GOALS = [
  "Complete College Project",
  "Freelance Delivery",
  "Startup MVP",
  "Production Issue",
  "Need Engineer",
];

const EMPTY_FORM: ProjectReviewFormData = {
  name: "",
  email: "",
  number: "",
  domain: "",
  challenge: "",
  timeline: "",
  hear: "",
};

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateForm(data: ProjectReviewFormData) {
  if (!data.domain) return "Please select your project domain.";
  if (!data.number) return "Please provide your Number.";
  if (!data.hear) return "Please select about hear.";
  if (!data.challenge.trim()) return "Please describe your challenge.";
  if (!data.name.trim()) return "Please enter your name.";
  if (!data.email.trim()) return "Please enter your email address.";
  if (!validateEmail(data.email)) return "Please enter a valid email address.";
  return null;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* ---------------------------------- */
/* Small reusable field components    */
/* ---------------------------------- */

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  isRequired = true,
  error,
}: {
  label: string;
  name: keyof ProjectReviewFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: "text" | "email" | "tel" | "number";
  error?: string;
  isRequired?: boolean;
}) {
  const isPhone = type === "tel" || type === "number";
  const isEmail = type === "email";

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-800"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={isPhone ? "tel" : type}
        required={isRequired}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={isEmail ? "email" : isPhone ? "tel" : undefined}
        inputMode={isPhone ? "numeric" : undefined}
        pattern={
          isPhone
            ? "^[0-9]{10}$"
            : isEmail
              ? "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
              : undefined
        }
        maxLength={isPhone ? 10 : undefined}
        className={cx(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
          "focus:border-orange-400 focus:ring-4 focus:ring-orange-100",
          error ? "border-red-400" : "border-slate-200",
        )}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  name: keyof ProjectReviewFormData;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-800"
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={6}
        placeholder={placeholder}
        className={cx(
          "w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition",
          "focus:border-orange-400 focus:ring-4 focus:ring-orange-100",
          error ? "border-red-400" : "border-slate-200",
        )}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

/* ---------------------------------- */
/* Main component                     */
/* ---------------------------------- */

export default function ProjectReviewModal({
  isOpen,
  onClose,
  initialData,
}: ProjectReviewModalProps) {
  const [formData, setFormData] = useState<ProjectReviewFormData>({
    ...EMPTY_FORM,
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ProjectReviewFormData, string>>
  >({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      ...EMPTY_FORM,
      ...initialData,
    });
    setLoading(false);
    setFormError(null);
    setFieldErrors({});
    setShowDetails(false);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, loading, onClose]);

  const challengePlaceholder = useMemo(
    () =>
      [
        "Describe your challenge...",
        "",
        "Examples:",
        "• ESP32 won't connect to WiFi",
        "• PCB doesn't power ON",
        "• Firmware crashes after OTA",
        "• AI model accuracy is poor",
        "• Need prototype before investor meeting",
        "• Looking for Embedded Engineer",
      ].join("\n"),
    [],
  );

  if (!isOpen) return null;

  const setSingleField = (name: keyof ProjectReviewFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (formError) setFormError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    let { name, value, type } = e.target;
    if (type === "number") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setSingleField(name as keyof ProjectReviewFormData, value);
  };

  const buildFieldErrors = (data: ProjectReviewFormData) => {
    const errors: Partial<Record<keyof ProjectReviewFormData, string>> = {};

    if (!data.hear) errors.hear = "Required";
    if (!data.domain) errors.domain = "Required";
    if (!data.number) errors.number = "Required";
    if (!data.timeline) errors.timeline = "Required";
    if (!data.challenge.trim()) errors.challenge = "Required";
    if (!data.name.trim()) errors.name = "Required";
    if (!data.email.trim()) {
      errors.email = "Required";
    } else if (!validateEmail(data.email)) {
      errors.email = "Invalid email";
    }

    return errors;
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const validationMessage = validateForm(formData);
    const errors = buildFieldErrors(formData);
    setFieldErrors(errors);

    if (validationMessage) {
      setFormError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    setFormError(null);
    setLoading(true);

    try {
      const payload: ProjectReviewFormData = {
        number: formData.number.trim(),
        domain: formData.domain.trim(),
        timeline: formData.timeline.trim(),
        hear: formData.hear.trim(),
        challenge: formData.challenge.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
      };
      
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      const raw = await response.text();
      let result: any = null;

      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        result = raw;
      }

      if (!response.ok) {
        const message =
          (typeof result === "object" && (result?.message || result?.error)) ||
          (typeof result === "string" && result) ||
          `Failed to submit form. (${response.status})`;

        throw new Error(message);
      }

      toast.success("Your request has been submitted successfully!");

      setFormData({
        ...EMPTY_FORM,
        ...initialData,
      });
      setFieldErrors({});
      setFormError(null);
      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting the form.";

      console.error("Lead submit error:", err);
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/70 backdrop-blur-sm"
      style={{ fontFamily: "Inter, sans-serif" }}
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div className="flex min-h-full items-start justify-center p-4 py-6 lg:items-center">
        <div
          className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - solid bg so it stays visible over either panel */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close modal"
            className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white bg-slate-800 shadow-lg backdrop-blur transition hover:bg-slate-900 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left panel: order-2 on mobile (shown after the form), order-1 on desktop */}
            <div className="relative order-1 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-6 pt-20 text-white sm:px-8 lg:order-1 lg:px-10 lg:py-10">
              <div className="pointer-events-none absolute -left-16 top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -right-16 bottom-10 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl" />

              <div className="relative z-10">
                {/* Mobile-only toggle header for the collapsible details */}
                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  aria-expanded={showDetails}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 lg:hidden"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-white">
                    <Zap className="h-4 w-4 text-orange-300" />
                    Why request a free review?
                  </span>
                  <ChevronDown
                    className={cx(
                      "h-4 w-4 flex-shrink-0 text-white/70 transition-transform",
                      showDetails && "rotate-180",
                    )}
                  />
                </button>

                {/* Collapsible on mobile, always visible on desktop */}
                <AnimatePresence initial={false}>
                  {(showDetails || true) && (
                    <motion.div
                      key="details-content"
                      initial={false}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      className={cx(
                        "overflow-hidden lg:!block lg:!h-auto lg:!opacity-100",
                        !showDetails && "hidden lg:block",
                      )}
                    >
                      <div className="pt-4 lg:pt-0">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                          <Zap className="h-3.5 w-3.5 text-orange-300" />
                          Free engineering review
                        </div>

                        <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                          Stuck on an engineering project?
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-[15px]">
                          Tell us what you’re building, where you’re stuck, and
                          what outcome you need. Our team will review it and
                          send practical next steps within 24 hours.
                        </p>

                        <div className="mt-8 grid gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl bg-orange-500/15 p-2 text-orange-300">
                                <Wrench className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold">
                                  Possible root cause
                                </h3>
                                <p className="mt-1 text-sm text-slate-300">
                                  We identify what’s actually blocking the
                                  project technically.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl bg-blue-500/15 p-2 text-blue-300">
                                <CheckCircle2 className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold">
                                  Suggested solution path
                                </h3>
                                <p className="mt-1 text-sm text-slate-300">
                                  You’ll get actionable recommendations, not
                                  generic advice.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
                                <ShieldCheck className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="text-sm font-semibold">
                                  Right expert if needed
                                </h3>
                                <p className="mt-1 text-sm text-slate-300">
                                  If the problem needs hands-on help, we’ll
                                  point you to the right engineer.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4">
                          <h4 className="text-sm font-semibold text-orange-200">
                            What happens next
                          </h4>
                          <ol className="mt-3 space-y-2 text-sm text-orange-50/90">
                            <li>
                              1. Submit your challenge and current project
                              details.
                            </li>
                            <li>2. Our engineers review it within 24 hours.</li>
                            <li>
                              3. You receive practical recommendations and next
                              steps.
                            </li>
                            <li>
                              4. If needed, we connect you with the right
                              engineering expert.
                            </li>
                          </ol>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right panel: order-1 on mobile (shown first), order-2 on desktop */}
            <div className="order-1 bg-slate-50 px-6 py-8 sm:px-8 lg:order-2 lg:px-10 lg:py-10">
              <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                    Project review request
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Fill in the details below and we’ll get back to you with a
                    review of your engineering challenge.
                  </p>
                </div>

                <form
                  onSubmit={handleLeadSubmit}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <InputField
                      label="Your name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      error={fieldErrors.name}
                    />

                    <InputField
                      label="Whatsapp Number"
                      name="number"
                      type="number"
                      value={formData.number}
                      onChange={handleChange}
                      placeholder="Enter your Whatsapp Number"
                      error={fieldErrors.number}
                    />
                    <InputField
                      label="Email address (optional)"
                      isRequired={false}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      error={fieldErrors.email}
                    />

                    <CustomSelect
                      label="What are you Building?"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      options={DOMAINS}
                      placeholder="Choose"
                      error={fieldErrors.domain}
                    />
                  </div>

                  <TextareaField
                    label="Describe your challenge"
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                    placeholder={challengePlaceholder}
                    error={fieldErrors.challenge}
                  />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <CustomSelect
                      label="When do you need help?"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      options={TIMELINE}
                      placeholder="Select Timeline"
                      error={fieldErrors.timeline}
                    />

                    <CustomSelect
                      label="How did you hear about us?"
                      name="hear"
                      value={formData.hear}
                      onChange={handleChange}
                      options={HEAR}
                      placeholder="Choose Source"
                      error={fieldErrors.hear}
                    />
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap gap-2.5 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        🔒 Your information stays confidential
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        ⚡ No payment required
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1.5">
                        👨‍💻 Reviewed by experienced engineers
                      </span>
                    </div>
                  </div>

                  {formError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {formError}
                    </div>
                  ) : null}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Maybe later
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Get My Free Engineering Review"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
