"use client";

import AboutUs from "@/components/AboutUs";
import BrowserCategory from "@/components/BrowserCategory";
import Footer from "@/components/Footer";
import Start from "@/components/Start";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import WhatWeOffer from "@/components/WhatWeOffer";
import TrustIndicator from "@/components/TrustIndicator";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
const userTypes = [
  "Student",
  "Freelancer",
  "Startup Founder",
  "Company",
  "Researcher",
  "Engineering Manager",
];

const domains = [
  "Embedded Systems",
  "IoT",
  "PCB Design",
  "Robotics",
  "AI",
  "Computer Vision",
  "Raspberry Pi",
  "Arduino",
  "ESP32",
  "Drone",
  "Firmware",
  "Mechanical Design",
  "Product Prototype",
  "Other",
];

const stages = [
  "Idea",
  "Prototype",
  "Development",
  "Testing",
  "Manufacturing",
];

const budgets = [
  "Under ₹5k",
  "₹5k-20k",
  "₹20k-50k",
  "₹50k-2L",
  "₹2L+",
];

const timelines = [
  "Today",
  "This Week",
  "This Month",
  "Just Exploring",
];

const goals = [
  "Finish my college project",
  "Deliver a freelance client project",
  "Build an MVP for my startup",
  "Fix a production issue",
  "Learn a new skill",
  "Hire an engineering expert",
  "Other",
];

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: "",
    domain: "",
    blocker: "",
    stage: "",
    budget: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    goal: "",
  });

  const handleSubmit = async () => {
    // Validation
    const requiredFields = {
      userType: "Please select who you are.",
      domain: "Please select your project domain.",
      blocker: "Please describe what is stopping your project.",
      stage: "Please select your project stage.",
      budget: "Please select your budget.",
      timeline: "Please select your timeline.",
      name: "Please enter your name.",
      email: "Please enter your email.",
      goal: "Please select your goal.",
    };

    for (const [key, message] of Object.entries(requiredFields)) {
      if (!String(formData[key as keyof typeof formData]).trim()) {
        return toast.error(message);
      }
    }

    try {
      setLoading(true)
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit form.");
      }

      toast.success("Your request has been submitted successfully!");

      // Optional: Reset form
      setFormData({
        userType: "",
        domain: "",
        blocker: "",
        stage: "",
        budget: "",
        timeline: "",
        name: "",
        email: "",
        phone: "",
        goal: "",
      });

    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
      setShowWelcome(false);
    }
  };

  useEffect(() => {
    const hasShown = sessionStorage.getItem("welcome-popup");

    const timer = setTimeout(() => {
      setShowWelcome(true);
      sessionStorage.setItem("welcome-popup", "true");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <div className="overflow-hidden">
        <Start />
        <HowItWorks />
        <WhatWeOffer />
        <TrustIndicator />
        <BrowserCategory />
        <Stats />
        <AboutUs />
        <Footer />
      </div>

      {showWelcome && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center py-10 px-4">

            <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-zinc-200">

              {/* Close */}
              <button
                onClick={() => setShowWelcome(false)}
                className="absolute right-5 top-5 h-10 w-10 rounded-full bg-zinc-100 hover:bg-zinc-200"
              >
                ✕
              </button>

              {/* Header */}

              <div className="border-b p-8">

                <h2 className="text-4xl text-zinc-900">
                  Welcome to
                  <span className="text-[#fb9b34] font-bold"> TECH-ENGI</span>
                </h2>

                <p className="mt-3 text-zinc-600">
                  Help us understand your project so we can recommend the right
                  engineers, resources and solutions.
                </p>

              </div>

             <form
  onSubmit={(e) => {
    e.preventDefault();
    handleSubmit();
  }}
  className="space-y-6 p-8"
>

  {/* Row 1: User + Domain */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <label className="mb-2 block font-semibold">Who are you?</label>
      <select
        name="userType"
        value={formData.userType}
        onChange={handleChange}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose</option>
        {userTypes.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block font-semibold">Project Domain</label>
      <select
        name="domain"
        value={formData.domain}
        onChange={handleChange}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose</option>
        {domains.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Row 2: Stage + Budget */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <label className="mb-2 block font-semibold">Project Stage</label>
      <select
        name="stage"
        value={formData.stage}
        onChange={handleChange}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose</option>
        {stages.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block font-semibold">Budget</label>
      <select
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose</option>
        {budgets.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Row 3: Timeline + Goal */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div>
      <label className="mb-2 block font-semibold">Timeline</label>
      <select
        name="timeline"
        value={formData.timeline}
        onChange={handleChange}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose</option>
        {timelines.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>

    <div>
      <label className="mb-2 block font-semibold">What do you want to achieve?</label>
      <select
        name="goal"
        value={formData.goal}
        onChange={handleChange}
        className="w-full rounded-xl border p-3"
      >
        <option value="">Choose</option>
        {goals.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Blocker - full width, needs room to type */}
  <div>
    <label className="mb-2 block font-semibold">What is stopping your project?</label>
    <textarea
      rows={3}
      name="blocker"
      value={formData.blocker}
      onChange={handleChange}
      placeholder="Tell us about your challenge..."
      className="w-full rounded-xl border p-3 resize-none"
    />
  </div>

  {/* Contact - full width */}
  <div className="space-y-3">
    <label className="block font-semibold">Contact Details</label>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full rounded-xl border border-zinc-300 p-3 outline-none focus:ring-2 focus:ring-[#fb9b34]"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full rounded-xl border border-zinc-300 p-3 outline-none focus:ring-2 focus:ring-[#fb9b34]"
      />
    </div>

    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="Phone Number"
      className="w-full rounded-xl border border-zinc-300 p-3 outline-none focus:ring-2 focus:ring-[#fb9b34]"
    />
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-4 pt-2">
    <button
      type="button"
      onClick={() => setShowWelcome(false)}
      className="rounded-xl border px-6 py-3 font-medium hover:bg-zinc-100"
    >
      Skip
    </button>

    <button
      type="submit"
      disabled={loading}
      className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#fa9122] px-7 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition-all duration-200 hover:bg-[#fb8405] hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-orange-300 disabled:shadow-none"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Submitting...
        </>
      ) : (
        "Continue"
      )}
    </button>
  </div>

</form>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
