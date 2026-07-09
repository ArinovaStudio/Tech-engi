"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

/* ---------------------------------- */
/* Types                              */
/* ---------------------------------- */

export interface ProjectReviewFormData {
  userType: string;
  domain: string;
  stage: string;
  goal: string;
  challenge: string;
  name: string;
  email: string;
}

export interface ProjectReviewModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Called when the modal should close (X button, backdrop, "Maybe Later") */
  onClose: () => void;
  /**
   * Called with the form data on submit. Throw inside this handler
   * to surface an error to the user — the modal stays open and
   * re-enables the submit button on failure.
   */
  onSubmit: (data: ProjectReviewFormData) => Promise<void> | void;
  /** Optional: prefill the form (e.g. logged-in user's name/email) */
  initialData?: Partial<ProjectReviewFormData>;
}

/* ---------------------------------- */
/* Static options                     */
/* ---------------------------------- */

const USER_TYPES = ["Student", "Freelancer", "Startup", "Company", "Researcher"];

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

const STAGES = ["Idea", "Prototype", "Development", "Testing", "Manufacturing"];

const GOALS = [
  "Complete College Project",
  "Freelance Delivery",
  "Startup MVP",
  "Production Issue",
  "Need Engineer",
];

const EMPTY_FORM: ProjectReviewFormData = {
  userType: "",
  domain: "",
  stage: "",
  goal: "",
  challenge: "",
  name: "",
  email: "",
};

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export default function ProjectReviewModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProjectReviewModalProps) {
  const [formData, setFormData] = useState<ProjectReviewFormData>({
    ...EMPTY_FORM,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form + error state whenever the modal is (re)opened
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...EMPTY_FORM, ...initialData });
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ fontFamily: "var(--font-inter)" }}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/75 font-inter"
    >
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-[640px] overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-[#081D3A] to-[#102F5E] p-5 text-white md:p-7">
            <h1 className="text-[20px] leading-tight md:text-[26px]">
              🚧 Stuck on Your{" "}
              <span className="font-bold text-[#FF9A22]">Engineering Project?</span>
            </h1>

            <p className="mt-3 text-sm leading-relaxed opacity-90">
              Describe your engineering challenge. We&apos;ll review your project
              within <b>24 hours</b> and help you move forward.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <div className="min-w-[150px] flex-1 rounded-lg bg-white/[0.08] p-3">
                <strong className="mb-1 block text-[13px]">
                  ✅ Possible Root Cause
                </strong>
                <span className="text-xs opacity-90">
                  Identify what&apos;s blocking your project.
                </span>
              </div>

              <div className="min-w-[150px] flex-1 rounded-lg bg-white/[0.08] p-3">
                <strong className="mb-1 block text-[13px]">
                  💡 Suggested Solution
                </strong>
                <span className="text-xs opacity-90">
                  Actionable recommendations from engineers.
                </span>
              </div>

              <div className="min-w-[150px] flex-1 rounded-lg bg-white/[0.08] p-3">
                <strong className="mb-1 block text-[13px]">
                  👨‍💻 Right Expert
                </strong>
                <span className="text-xs opacity-90">
                  We&apos;ll recommend an engineer only if needed.
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-5 md:p-7">
            <h2 className="mb-4 text-base font-mono font-semibold md:text-lg">
              Tell us about your project
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9800]"
              >
                <option value="">Who are you?</option>
                {USER_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9800]"
              >
                <option value="">Project Domain</option>
                {DOMAINS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9800]"
              >
                <option value="">Project Stage</option>
                {STAGES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9800]"
              >
                <option value="">Goal</option>
                {GOALS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <textarea
                name="challenge"
                value={formData.challenge}
                onChange={handleChange}
                required
                placeholder={
                  "Describe your challenge...\n\nExamples:\n• ESP32 won't connect to WiFi\n• PCB doesn't power ON\n• Firmware crashes after OTA\n• AI model accuracy is poor\n• Need prototype before investor meeting\n• Looking for Embedded Engineer"
                }
                className="col-span-1 h-24 w-full resize-none rounded-lg border border-zinc-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9800] md:col-span-2"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9800]"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full rounded-lg border border-zinc-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9800]"
              />
            </div>

            {/* Steps */}
            <div className="mt-5 rounded-lg border-l-4 border-[#FF9800] bg-[#FFF8EF] p-3.5">
              <h3 className="mb-1.5 text-sm font-semibold">📌 What happens next?</h3>
              <p className="my-1 text-xs leading-relaxed">1️⃣ Submit your engineering challenge.</p>
              <p className="my-1 text-xs leading-relaxed">2️⃣ Our engineers review it within 24 hours.</p>
              <p className="my-1 text-xs leading-relaxed">3️⃣ You&apos;ll receive practical recommendations.</p>
              <p className="my-1 text-xs leading-relaxed">
                4️⃣ If required, we&apos;ll connect you with the right engineering expert.
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-600">
              <div className="rounded-lg bg-zinc-100 px-3 py-2">
                🔒 Your information stays confidential
              </div>
              <div className="rounded-lg bg-zinc-100 px-3 py-2">⚡ No payment required</div>
              <div className="rounded-lg bg-zinc-100 px-3 py-2">
                👨‍💻 Reviewed by experienced engineers
              </div>
            </div>

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600" role="alert">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-zinc-500 hover:underline"
              >
                Maybe Later
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-lg bg-[#FF9800] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#f58b00] disabled:cursor-not-allowed disabled:bg-orange-300"
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
  );
}