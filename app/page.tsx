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
import LeadForm, { ProjectReviewFormData } from "@/components/common/LeadForm";
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

const handleLeadSubmit = async (data: ProjectReviewFormData) => {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to submit form.");
    }

    toast.success("Your request has been submitted successfully!");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong. Please try again.";
    toast.error(message);
    throw error; // re-throw so the modal keeps the form open and shows the inline error
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

        <LeadForm 
        onSubmit={(e) => {handleLeadSubmit(e)}}
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)} 
        />
    </div>
  );
}
