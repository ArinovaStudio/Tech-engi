"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const heroTestimonials = [
  {
    name: "Sneha",
    role: "Computer Science Student, SRM Institute of Science and Technology",
    text: "I was struggling to turn my AI project idea into actual code. The mentor helped me structure everything and build a working model step by step.",
  },
  {
    name: "Aditya",
    role: "B.Tech Information Technology Student, MAKAUT",
    text: "I had issues integrating backend APIs in my project. The guidance I got helped me understand the flow and fix everything properly.",
  },
  {
    name: "Ishita",
    role: "Computer Engineering Student, Pune Institute of Computer Technology",
    text: "My web development project was stuck in deployment. I got clear help on fixing errors and finally hosted it successfully.",
  },
  {
    name: "Rohan",
    role: "Computer Science Student, VIT Vellore",
    text: "I was confused about how to implement my machine learning project beyond theory. The explanation made it much easier to actually code it.",
  },
  {
    name: "Mehul",
    role: "Information Technology Student, IIIT Lucknow",
    text: "I needed help debugging my full-stack project. The support was practical and helped me fix issues quickly without wasting time.",
  },
  {
    name: "Ayesha",
    role: "Computer Science Engineering Student, SRM University",
    text: "My project on data analytics wasn’t giving correct outputs. The mentor helped me identify mistakes in preprocessing and model selection.",
  },
  {
    name: "Karan",
    role: "Software Engineering Student, Punjab Engineering College",
    text: "I was stuck with my backend logic in a project. The guidance helped me understand the architecture and complete it properly.",
  },
];

const Start = () => {
  const navRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(navRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(taglineRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")
      .fromTo(headlineRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
      .fromTo(rightRef.current, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, "-=0.4")
      .fromTo(bannerRef.current, { scaleY: 0.8, opacity: 0, transformOrigin: "top" }, { scaleY: 1, opacity: 1, duration: 0.7 }, "-=0.3");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(
        (prev) => (prev + 1) % heroTestimonials.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lg:min-h-screen p-5 font-sans w-full h-[5vh]:">
      {/* Navbar */}
      <header className="border-2 border-gray-200 overflow-hidden py-3">
        <div
          className=" max-w-full mx-auto px-4 sm:px-6 h-[64p flex items-center justify-between " >
          {/* LEFT */}
          <div className="flex items-center">
            {/* LOGO */}
            <span
              className=" text-[22px] font-benz tracking-tight text-black lg:mr-4 lg:border-r-2 lg:border-gray-300 lg:pr-4 " >
              TECH ENGI
            </span>

            {/* DESKTOP NAV */}
            <nav
              className=" hidden lg:flex items-center gap-8 font-id text-[14px] text-black " >
              <a href="#howitworks">How it works?</a>
              {/* <a href="#">Explore Projects</a> */}
              <a href="#Services">Services</a>
              <a href="#Categories">Categories</a>
              <a href="#Testimonials">Testimonials</a>
            </nav>
          </div>

          {/* DESKTOP RIGHT */}
          <div
            className=" hidden lg:flex items-center gap-5 border-l-2 border-gray-300 pl-5
          "
          >
            {/* SOCIAL */}
            <div
              className=" flex items-center gap-4 border-r border-gray-200 pr-5 " >
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/tsquarey1" target="_blank" aria-label="LinkedIn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/tsy1_tech.engi?igsh=MTdvNnZzdHpvb215bg%3D%3D&utm_source=qr"
                target="_blank"
                aria-label="Instagram">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://youtu.be/7jniNW5R2R0" target="_blank" aria-label="Facebook">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#8A8A8A] hover:text-red-600 transition-colors"
                >
                  <path d="M23.5 6.2a2.98 2.98 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A2.98 2.98 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 2.98 2.98 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a2.98 2.98 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.75 15.5v-7l6 3.5-6 3.5z" />
                </svg>
              </a>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center gap-3">
              {/* <Link
                href="/login"
                className="
                inline-flex
                items-center
                justify-center

                px-4
                py-1

                text-[16px]

                font-spacegrotesk
                border-2
                border-gray-300
                text-[#050A30]
                hover:bg-gray-50

                whitespace-nowrap
              "
              >
                BECOME BUILDER
              </Link> */}

              <Link
                href="/login"
                className=" inline-flex items-center justify-center gap-2 w-50 px-4 py-1 text-[16px] font-inter bg-black text-white hover:bg-gray-800 whitespace-nowrap">
                Login
                <span className="text-base"> <ArrowRight /></span>
              </Link>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className=" lg:hidden flex items-center justify-center">
            {mobileMenuOpen ? (
              <X className="w-7 h-7 text-black" />
            ) : (
              <Menu className="w-7 h-7 text-black" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300

          ${mobileMenuOpen ? "max-h-[500px] border-t border-gray-200" : "max-h-0"}`}
        >
          <div className="px-4 py-5 flex flex-col gap-5 bg-white">
            {/* NAV LINKS */}
            <nav className="flex flex-col gap-4 text-[15px] font-id text-black">
              <a href="#Services">Services</a>
              <a href="#Categories">Categories</a>
              <a href="#Testimonials">Testimonials</a>
            </nav>

            {/* SOCIAL */}
            <div className="flex items-center gap-4">
             {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/tsquarey1" target="_blank" aria-label="LinkedIn">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/tsy1_tech.engi?igsh=MTdvNnZzdHpvb215bg%3D%3D&utm_source=qr"
                target="_blank"
                aria-label="Instagram">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-black"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://youtu.be/7jniNW5R2R0" target="_blank" aria-label="Facebook">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-[#8A8A8A] hover:text-red-600 transition-colors"
                >
                  <path d="M23.5 6.2a2.98 2.98 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A2.98 2.98 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 2.98 2.98 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a2.98 2.98 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.75 15.5v-7l6 3.5-6 3.5z" />
                </svg>
              </a>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className=" flex items-center justify-center gap-2 px-4 py-3 text-[15px] bg-black text-white">
                Login
                <span><ArrowRight /></span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-full mx-auto px-6 pt-6 pb-0 lg:h-full h-[96vh]">
        {/* Top row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:mt-15">
          {/* Left */}
          <div className="flex-1">
            <div
              ref={taglineRef}
              className="flex flex-col lg:flex-row items-start lg:items-center gap-2 mb-4 font-id text-[#FFAE58]"
            >
              <span className="text-[16px] sm:text-[16px] lg:text-[18px] uppercase">
                Engineering Projects
              </span>

              <span className="hidden lg:block">|</span>

              <span className="text-[12px] sm:text-[16px] lg:text-[18px] uppercase">
                Expert Engineers
              </span>

              <span className="hidden lg:block">|</span>

              <span className="text-[12px] sm:text-[16px] lg:text-[18px] uppercase">
                On-Time Delivery
              </span>
            </div>
            <h1
              ref={headlineRef}
              className="text-[42px] sm:text-[60px] lg:text-[94px] font-benz leading-[1.0] text-black uppercase"
              style={{ letterSpacing: "-1px" }}
            >
              BUILD FASTER,<br />SUBMIT SMARTER
            </h1>
          </div>

          {/* Right */}
          <div ref={rightRef} className="flex flex-col items-start lg:items-end justify-between gap-6 lg:pt-2 w-full lg:max-w-[41%] text-left lg:text-right">
            <p className="text-[18px] sm:text-[22px] lg:text-[26px] font-medium font-id text-black">
              Tech-ENGI connects students, startups, and businesses with verified engineering experts for projects, prototyping, product development, and consulting.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center font-inter gap-3 w-full sm:w-auto">
              <Link href={'register/engineer'} className="px-6 py-4 text-[16px] font-bold text-gray-900 bg-[#F4F4F4] whitespace-nowrap text-center">
                BECOME BUILDER
              </Link>
              <Link href={'register/client'} className="px-6 py-4 text-[16px] font-bold bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-800 whitespace-nowrap">
                START MY PROJECT <span>↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Orange Banner */}
        <div className="relative min-h-[420px] lg:min-h-[600px]">

          {/* Background rounded layer */}
          <div className="absolute inset-0 rounded-2xl bg-[#FFAE58] lg:h-[600px] md:h-[400px] mt-10 lg:mt-0 h-[225px]" />

          {/* Two guys image — desktop only, scales with viewport ✅ */}
          <div
            ref={bannerRef}
            className="hidden lg:block absolute -translate-x-1/2"
            style={{
              bottom: 0,
              width: "min(1030px, 60vw)",/* ✅ shrinks proportionally, never overflows */
              left: "calc(30% + 80px)",
            }}
          >
            <Image
              src="/two-guys.png"
              alt="Student and builder shaking hands"
              width={600}
              height={500}
              className="w-full h-auto object-contain "
              priority
            />
          </div>

          {/* Mobile/tablet image */}
          {/* Mobile/tablet image */}
          <div className="lg:hidden relative flex justify-center">
            <Image
              src="/two-guys.png"
              alt="Student and builder shaking hands"
              width={6000}
              height={6000}
              className="w-full max-w-[400px] h-[260px] md:max-w-[400px] md:h-[545px] scale-125 object-contain"
              priority
            />
          </div>

          {/* Bottom-left: Avatars + Trusted */}
          <div className=" hidden md:flex md:absolute md:bottom-22 md:left-10 lg:flex relative lg:absolute lg:bottom-15 lg:left-20 flex flex-col items-center gap-3 px-5 pb-6 lg:pt-4 lg:p-0">

            <div className="flex items-center -space-x-3 w-full">
              {[
                "/student/image copy 4.png",
                "/student/image copy 2.png",
                "/student/image copy 3.png",
                "/student/image copy.png",
                "/student/image.png",
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white"
                >
                  <Image
                    src={src}
                    alt={`User ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-white font-semibold font-id text-[20px] lg:text-[24px]">Trusted by 1K+ Students</span>
          </div>

          {/* Testimonial card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{
                duration: 3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="hidden lg:flex lg:flex-col relative lg:absolute lg:bottom-40 lg:right-30 max-w-[320px] font-inter px-5 pb-6 lg:p-0"
            >
              <p className="text-white font-bold text-[25px] mb-0.5">
                {heroTestimonials[currentTestimonial].name}
              </p>

              <p className="text-white/70 text-[15px] mb-2">
                {heroTestimonials[currentTestimonial].role}
              </p>

              <div className="border-t border-white/40 pt-2">
                <p className="text-white/90 text-[15px] leading-relaxed">
                  {heroTestimonials[currentTestimonial].text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
};

export default Start;
