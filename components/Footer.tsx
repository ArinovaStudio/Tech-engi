"use client";
import { useState } from "react";
import toast from "react-hot-toast";
const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    try {
      const res = await fetch("/api/subscribemail", {
        method: "POST",
        body: JSON.stringify({ email })
      });
      if (res.ok) { toast.success("Thank you for subscribing"); }
      else toast.error("Sorry for the inconvenience");
    } catch { toast.error("Error occurred"); }
  };

  return (
    <footer className="w-full bg-background font-inter overflow-hidden transition-colors duration-300">
      
      {/* TOP SECTION */}
      <div
        className="w-full mx-auto px-4 sm:px-8 lg:px-16 pt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 lg:gap-8 " >
        {/* COLUMN 1 */}
        <div>
          <h2 className="leading-tight text-black dark:text-white font-id">
            <span
              className=" text-[24px] sm:text-[26px] lg:text-[29px] font-extrabold">
              Connecting Engineering
            </span>
            <br />

            <span
              className=" text-[24px] sm:text-[26px] lg:text-[29px] font-extrabold">
              Talent With Innovative
            </span>

            <br />

            <span
              className=" text-[24px] sm:text-[26px] lg:text-[29px] font-extrabold">
              Projects Worldwide
            </span>
          </h2>
        </div>

        {/* COLUMN 2 */}
        <div>
          <p
            className=" text-[18px] sm:text-[20px] lg:text-[22px] font-bold tracking-[0.15em] lg:tracking-[0.2em] text-black dark:text-white uppercase mb-4 font-id ">
            Company
          </p>

          <ul className="space-y-2">
            <li>
              <a href="#Services" className=" text-[16px] sm:text-[17px] lg:text-[18px] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-id flex items-center gap-1 " >
                <span className="text-gray-400">›</span>
                Services
              </a>
            </li>
            <li>
              <a href="/register/engineer" className=" text-[16px] sm:text-[17px] lg:text-[18px] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-id flex items-center gap-1 " >
                <span className="text-gray-400">›</span>
                Join as Builder
              </a>
            </li>
            <li>
              <a href="/register/client" className=" text-[16px] sm:text-[17px] lg:text-[18px] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-id flex items-center gap-1 " >
                <span className="text-gray-400">›</span>
                Start a Project
              </a>
            </li>
            <li>
              <a href="#howitworks" className=" text-[16px] sm:text-[17px] lg:text-[18px] text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white font-id flex items-center gap-1 " >
                <span className="text-gray-400">›</span>
                How it works
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div>
          <p
            className=" text-[18px] sm:text-[20px] lg:text-[22px] font-bold tracking-[0.15em] lg:tracking-[0.2em] text-black dark:text-white uppercase mb-4 font-id " >
            Contact Info
          </p>

          <ul className="space-y-2">
            {[
              "tsy1@tsquarey.store",
              // "9086345xx2",
              // "Area 51, Siliguri, west Bengal",
              // "sales@tech-engi.com",
            ].map((item) => (
              <li
                key={item}
                className=" text-[16px] sm:text-[17px] lg:text-[18px] text-gray-600 dark:text-slate-400 font-id flex items-start gap-1 break-words " >
                <span className="text-gray-400 shrink-0">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4 */}
        <div className="">
          <p
            className=" text-[18px] sm:text-[20px] lg:text-[22px] font-bold tracking-[0.15em] lg:tracking-[0.2em] text-black dark:text-white uppercase mb-4 text-left xl:text-right font-id " >
            Release Letter
          </p>

          {/* INPUT + BUTTON */}
          <div
            className=" flex flex-col items-start xl:items-end gap-3 mb-4 " >
            <input
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className=" w-full px-4 py-4 text-[13px] outline-none font-id placeholder-gray-400 bg-gray-100 dark:bg-slate-800 text-black dark:text-white border border-transparent dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " />

            <button
              onClick={() => {
                handleSend();

              }}
              className=" bg-black text-white text-[12px] font-bold px-5 py-3 font-id hover:bg-gray-800 whitespace-nowrap " >
              SUBSCRIBE
            </button>
          </div>

          {/* SOCIAL ICONS */}
          <div
            className=" flex items-center gap-4 justify-start xl:justify-end " >
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/tsquarey1" target="_blank" aria-label="LinkedIn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#8A8A8A] hover:text-black dark:hover:text-white"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://www.instagram.com/tsy1_tech.engi?igsh=MTdvNnZzdHpvb215bg%3D%3D&utm_source=qr " target="_blank" aria-label="Instagram">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#8A8A8A] hover:text-black dark:hover:text-white"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  ry="5"
                />
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
        </div>
      </div>

      {/* LOGO SVG */}
      <div className="w-full flex justify-center items-center mt-10 overflow-hidden">
        <svg
          viewBox="0 0 1000 190"
          className="
        w-[140%]
        sm:w-full

        min-w-[700px]
      "
        >
          <defs>
            <linearGradient
              id="grad"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="200"
            >
              <stop offset="17%" stopColor="#00BBFF" />
              <stop offset="41%" stopColor="#9D00FF" />
              <stop offset="69%" stopColor="#FFAE58" />
            </linearGradient>
          </defs>

          <text
            x="50%"
            y="60%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="1"
            className="
          text-[90px]
          sm:text-[110px]
          lg:text-[130px]

          font-inter
          font-semibold

          tracking-[0.12em]
          sm:tracking-[0.2em]
        "
          >
            TECH ENGI
          </text>
        </svg>
      </div>

      {/* BOTTOM BAR */}
      <div className="bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 font-inter text-[#878787] transition-colors duration-300">
        <div
          className=" max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          <p className="text-[14px] sm:text-[15px]">
            © 2026 TSquareY1 OPC Private limited
          </p>

          <p className="text-[14px] sm:text-[15px]">
            Policy • Terms &amp; Conditions • Cookie Policy
          </p>

          <p className="text-[14px] sm:text-[15px]">
            Designed by Arinova Studio
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
