"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useTheme } from "@/components/ThemeProvider";
import AuthBrandSide from "@/components/auth/AuthBrandSide";

const QUALIFICATIONS = [
  { value: "UG", label: "Undergraduate (Student)" },
  { value: "EMPLOYED", label: "Employed Professional" },
  { value: "AspiringEngineer", label: "Aspiring Engineer" },
];

const ID_TYPES: Record<string, string[]> = {
  UG: ["STUDENT_ID", "AADHAAR", "PAN"],
  EMPLOYED: ["AADHAAR", "PAN", "PAY_SLIP"],
  AspiringEngineer: ["AADHAAR", "PAN"],
};

const ID_LABELS: Record<string, string> = {
  STUDENT_ID: "Student ID",
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  PAY_SLIP: "Pay Slip",
};

const EXPERIENCE_LEVELS = [
  { value: "FRESHER", label: "Fresher" },
  { value: "ONE_TO_TWO_YEARS", label: "1-2 Years" },
  { value: "THREE_TO_FIVE_YEARS", label: "3-5 Years" },
  { value: "FIVE_TO_EIGHT_YEARS", label: "5-8 Years" },
  { value: "EIGHT_PLUS_YEARS", label: "8+ Years" },
];

export default function EngineerFormPage() {
  const router = useRouter();
  const { status } = useSession();
  const { theme, toggleTheme } = useTheme();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1: Background & Links
  const [qualificationDetails, setQualificationDetails] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [achievements, setAchievements] = useState("");

  // Step 2: Verification, Skills & Payout
  const [qualification, setQualification] = useState("");
  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [preferredMethod, setPreferredMethod] = useState<"UPI" | "BANK">("UPI");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const addSkill = () => {
    const val = skillInput.trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
    }
    setSkillInput("");
  };

  const removeSkill = (tag: string) => {
    setSkills(skills.filter((s) => s !== tag));
  };

  const handleQualificationChange = (val: string) => {
    setQualification(val);
    setIdType("");
    setIdNumber("");
  };

  const handleNextStep = () => {
    setError("");
    if (!qualificationDetails.trim()) {
      setError("Please enter your qualification degree / title.");
      return;
    }
    if (!universityName.trim()) {
      setError("Please enter your college / university name.");
      return;
    }
    if (!yearsOfExperience) {
      setError("Please select your years of experience.");
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!qualification) {
      setError("Please select your qualification category.");
      return;
    }
    if (!idType) {
      setError("Please select an ID document type.");
      return;
    }
    if (!idNumber.trim()) {
      setError("Please enter your ID number.");
      return;
    }
    if (!idFile) {
      setError("Please upload a scanned copy of your ID document.");
      return;
    }
    if (skills.length === 0) {
      setError("Please add at least one technical skill.");
      return;
    }

    const cleanedId = idNumber.replace(/\s+/g, "").toUpperCase();

    if (idType === "PAN") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(cleanedId)) {
        setError("Invalid PAN format. Expected format: ABCDE1234F");
        return;
      }
    }

    if (idType === "AADHAAR") {
      const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
      if (!aadhaarRegex.test(cleanedId)) {
        setError("Invalid Aadhaar format. It must be 12 digits and cannot start with 0 or 1.");
        return;
      }
    }

    if (preferredMethod === "UPI") {
      if (!upiId.trim()) {
        setError("Please enter your UPI ID.");
        return;
      }
    } else {
      if (!accountNumber.trim() || !ifscCode.trim() || !bankName.trim() || !accountHolder.trim()) {
        setError("Please fill out all bank account details.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("qualification", qualification);
      formData.append("yearsOfExperience", yearsOfExperience);
      formData.append("idType", idType);
      formData.append("idNumber", cleanedId);
      formData.append("file", idFile);
      formData.append("skills", JSON.stringify(skills));

      // Education
      formData.append("qualificationDetails", qualificationDetails.trim());
      formData.append("universityName", universityName.trim());

      // Professional Links
      formData.append("github", github.trim());
      formData.append("linkedin", linkedin.trim());
      formData.append("portfolio", portfolio.trim());

      // Achievements
      formData.append("achievements", achievements.trim());

      // Payout Details
      formData.append("preferredMethod", preferredMethod);
      formData.append("upiId", preferredMethod === "UPI" ? upiId.trim() : "");
      formData.append("accountNumber", preferredMethod === "BANK" ? accountNumber.trim() : "");
      formData.append("ifscCode", preferredMethod === "BANK" ? ifscCode.trim().toUpperCase() : "");
      formData.append("bankName", preferredMethod === "BANK" ? bankName.trim() : "");
      formData.append("accountHolder", preferredMethod === "BANK" ? accountHolder.trim() : "");
      formData.append("certifications", JSON.stringify([]));

      const res = await fetch("/api/engineer/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit profile.");
      }

      toast.success("Profile submitted for verification! Please log in.");
      await signOut({ callbackUrl: "/login" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed.";
      setError(msg);
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#070b14] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <svg className="h-6 w-6 animate-spin text-[#f0b31e]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="font-mono text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white text-slate-900 dark:bg-[#070b14] dark:text-slate-100 transition-colors duration-200">
      {/* ================= LEFT: FORM SIDE ================= */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto min-h-screen">
        {/* Topbar */}
        <div className="flex items-center justify-between gap-4 pb-6">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(1);
              }}
              className="group inline-flex items-center gap-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                <path
                  d="M15 7H1M7 1L1 7l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Back to Step 1</span>
            </button>
          ) : (
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                <path
                  d="M15 7H1M7 1L1 7l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Back to techengi.in</span>
            </Link>
          )}

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              {theme === "light" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>

            {/* Mobile Brandmark */}
            <div className="flex lg:hidden items-center gap-2 font-black text-slate-900 dark:text-white">
              <span className="font-mono text-[#f0b31e]">{`{ }`}</span>
              <span className="text-sm tracking-tight">Tech Engi</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[460px] mx-auto my-auto py-6">
          {/* Step Pill Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block rounded-full bg-[#f0b31e]/15 px-3 py-1 font-mono text-[11px] font-bold text-[#b8850a] dark:text-[#f0b31e] tracking-wider uppercase">
                ENGINEER ONBOARDING
              </span>
              <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                &bull; Step {step} of 2
              </span>
            </div>

            <h1 className="text-3xl sm:text-[34px] font-black tracking-[-0.035em] text-slate-900 dark:text-white">
              {step === 1 ? "Your background." : "Verification & payout."}
            </h1>
            <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
              {step === 1
                ? "Tell us about your education, experience level, and verified engineering work."
                : "Submit verification proof and payout preferences to be eligible for project matches."}
            </p>
          </div>

          {/* Stepper Bar */}
          <div className="mb-6 flex gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= 1 ? "bg-[#f0b31e]" : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step === 2 ? "bg-[#f0b31e]" : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          </div>

          {/* Error Callout */}
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-rose-200 bg-rose-50/80 p-3.5 text-[13.5px] leading-relaxed text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-400"
            >
              {error}
            </div>
          )}

          {/* STEP 1: Background & Links */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Qualification Details */}
              <div>
                <label
                  htmlFor="qualificationDetails"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  Qualification / Degree *
                </label>
                <input
                  id="qualificationDetails"
                  type="text"
                  value={qualificationDetails}
                  onChange={(e) => setQualificationDetails(e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
              </div>

              {/* College / University Name */}
              <div>
                <label
                  htmlFor="universityName"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  College / University Name *
                </label>
                <input
                  id="universityName"
                  type="text"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  placeholder="e.g. Anna University, IIT Madras"
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
              </div>

              {/* Experience Level */}
              <div>
                <label
                  htmlFor="yearsOfExperience"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  Years of Experience *
                </label>
                <select
                  id="yearsOfExperience"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:hover:border-slate-700 dark:focus:border-[#f0b31e] cursor-pointer"
                >
                  <option value="" disabled>
                    Select experience level
                  </option>
                  {EXPERIENCE_LEVELS.map((exp) => (
                    <option key={exp.value} value={exp.value}>
                      {exp.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* GitHub Link */}
              <div>
                <label
                  htmlFor="github"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  GitHub Profile URL
                </label>
                <input
                  id="github"
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/yourhandle"
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
              </div>

              {/* LinkedIn Link */}
              <div>
                <label
                  htmlFor="linkedin"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedin"
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourhandle"
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
              </div>

              {/* Portfolio Link */}
              <div>
                <label
                  htmlFor="portfolio"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  Portfolio / Personal Website
                </label>
                <input
                  id="portfolio"
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
              </div>

              {/* Achievements */}
              <div>
                <label
                  htmlFor="achievements"
                  className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                >
                  Key Achievements
                </label>
                <input
                  id="achievements"
                  type="text"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  placeholder="Hackathon Winner, AWS Certified, Contributor"
                  className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                />
                <p className="mt-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                  Separate multiple achievements with commas.
                </p>
              </div>

              {/* Next Step Button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] cursor-pointer"
              >
                <span>Continue to Verification</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          {/* STEP 2: Verification, Skills & Payout */}
          {step === 2 && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Qualification Category Pills */}
              <div>
                <label className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                  Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {QUALIFICATIONS.map((q) => {
                    const isSelected = qualification === q.value;
                    return (
                      <button
                        key={q.value}
                        type="button"
                        onClick={() => handleQualificationChange(q.value)}
                        className={`min-h-[46px] rounded-xl border px-3 py-2 text-xs font-semibold transition-all cursor-pointer text-center ${
                          isSelected
                            ? "border-[#f0b31e] bg-[#f0b31e] text-slate-950 shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        {q.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ID Document Type */}
              {qualification && (
                <div>
                  <label className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                    Verification ID Type *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ID_TYPES[qualification].map((type) => {
                      const isSelected = idType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setIdType(type);
                            setIdNumber("");
                          }}
                          className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "border-[#f0b31e] bg-[#f0b31e] text-slate-950 shadow-xs"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
                          }`}
                        >
                          {ID_LABELS[type]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ID Number Input */}
              {idType && (
                <div>
                  <label
                    htmlFor="idNumber"
                    className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block"
                  >
                    {ID_LABELS[idType]} Number *
                  </label>
                  <input
                    id="idNumber"
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                    placeholder={
                      idType === "PAN"
                        ? "e.g. ABCDE1234F"
                        : idType === "AADHAAR"
                        ? "12-digit Aadhaar number"
                        : "Enter your ID number"
                    }
                    className="min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 uppercase transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                  />
                </div>
              )}

              {/* ID Document Upload */}
              <div>
                <label className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                  Upload ID Proof Document *
                </label>
                <label className="flex min-h-[52px] w-full items-center justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-4 py-3 transition-colors hover:border-[#f0b31e] dark:border-slate-700 dark:bg-slate-900/40 cursor-pointer">
                  <div className="flex items-center gap-3 truncate">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0 text-slate-400 dark:text-slate-500"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                      {idFile ? idFile.name : "Choose file (JPG, PNG or PDF)"}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    Browse
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {/* Technical Skills */}
              <div>
                <label className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                  Technical Skills *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="e.g. Next.js, Embedded C, Python..."
                    className="min-h-[50px] flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none hover:border-slate-300 focus:border-[#f0b31e] focus:ring-4 focus:ring-[#f0b31e]/15 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-[#f0b31e]"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    aria-label="Add skill"
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl bg-[#f0b31e] text-slate-950 font-bold transition-all hover:bg-[#ffc543] active:translate-y-[1px] cursor-pointer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-3">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900 dark:border-amber-400/30 dark:bg-amber-950/30 dark:text-amber-200"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(skill)}
                          className="text-amber-700 hover:text-amber-950 dark:text-amber-300 dark:hover:text-white cursor-pointer"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Payout Details Section */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <label className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-3 block">
                  Payout Method Preference *
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPreferredMethod("UPI")}
                    className={`min-h-[42px] rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      preferredMethod === "UPI"
                        ? "border-[#f0b31e] bg-[#f0b31e] text-slate-950 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    }`}
                  >
                    UPI Transfer
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredMethod("BANK")}
                    className={`min-h-[42px] rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      preferredMethod === "BANK"
                        ? "border-[#f0b31e] bg-[#f0b31e] text-slate-950 shadow-xs"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    }`}
                  >
                    Bank Account
                  </button>
                </div>

                {preferredMethod === "UPI" ? (
                  <div>
                    <label
                      htmlFor="upiId"
                      className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-1.5 block"
                    >
                      UPI ID *
                    </label>
                    <input
                      id="upiId"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                      placeholder="e.g. yourname@okaxis"
                      className="min-h-[46px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:border-[#f0b31e] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="accountHolder"
                        className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-1.5 block"
                      >
                        Account Holder Name *
                      </label>
                      <input
                        id="accountHolder"
                        type="text"
                        value={accountHolder}
                        onChange={(e) => setAccountHolder(e.target.value)}
                        placeholder="Full name as on passbook"
                        className="min-h-[46px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:border-[#f0b31e] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="accountNumber"
                          className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-1.5 block"
                        >
                          Account Number *
                        </label>
                        <input
                          id="accountNumber"
                          type="text"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                          placeholder="Account number"
                          className="min-h-[46px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:border-[#f0b31e] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="ifscCode"
                          className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-1.5 block"
                        >
                          IFSC Code *
                        </label>
                        <input
                          id="ifscCode"
                          type="text"
                          value={ifscCode}
                          onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                          placeholder="e.g. SBIN0001234"
                          className="min-h-[46px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 uppercase transition-all placeholder:text-slate-400 focus:outline-none focus:border-[#f0b31e] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="bankName"
                        className="font-mono text-[11px] font-semibold tracking-[0.1em] text-slate-500 dark:text-slate-400 uppercase mb-1.5 block"
                      >
                        Bank Name *
                      </label>
                      <input
                        id="bankName"
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. HDFC Bank, SBI"
                        className="min-h-[46px] w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:border-[#f0b31e] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#f0b31e] font-bold text-slate-950 shadow-sm transition-all duration-150 hover:bg-[#ffc543] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Submitting profile...</span>
                  </div>
                ) : (
                  <span>Submit Profile for Verification</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Mini Footer */}
        <p className="pt-6 font-mono text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed text-center sm:text-left">
          TSquareY1 OPC Private Limited, Chennai, Tamil Nadu &middot; techengi.in
        </p>
      </div>

      {/* ================= RIGHT: BRAND + TRUST SIDE ================= */}
      <AuthBrandSide role="ENGINEER" />
    </div>
  );
}
