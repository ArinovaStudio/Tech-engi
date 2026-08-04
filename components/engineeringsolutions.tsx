import React, { useState } from "react";

/**
 * Tech Engi — Engineering Solutions Grid
 * Single-file React + TypeScript + Tailwind. Drop <EngineeringSolutions />
 * anywhere.
 *
 * Light/dark mode: uses Tailwind's `dark:` variant, driven by the standard
 * class strategy — add/remove a `dark` class on <html> or a parent element
 * (e.g. via next-themes or a manual toggle). Requires `darkMode: "class"`
 * in tailwind.config (Tailwind's default in most setups). If the cards
 * still look identical in both modes after this, the `dark` class isn't
 * reaching this component — check your provider/toggle, not this file.
 *
 * Color tokens:
 *              Light        Dark (original design system)
 *   page bg    gray-50      #0b0f19
 *   card       white        #111827
 *   card grad  white/gray50 #111827/#171e2e (featured only)
 *   border     gray-200     white/5
 *   input/tag  gray-100     white/[0.03]
 *   text (h)   gray-900     white
 *   text (p)   gray-600     gray-400
 *   blue       #2563eb      #3b82f6  (accent stays roughly constant)
 *   yellow     #ca8a04      #eab308  (featured accent stays constant)
 */

type Category = "all" | "corporate" | "startup" | "product" | "drone";

interface Solution {
  category: Exclude<Category, "all">;
  featured?: boolean;
  badge?: string;
  icon: string;
  title: string;
  description: string;
  items: string[];
  price: string;
  metaTag: string;
}

const solutions: Solution[] = [
  {
    category: "corporate",
    featured: true,
    badge: "★★★★★ Most Requested",
    icon: "🏢",
    title: "Corporate Engineering Support",
    description:
      "Production issues can't wait. We provide dedicated engineers to resolve bugs, complete modules, optimize systems and help your team meet critical deadlines.",
    items: [
      "Production Bug Fixes",
      "Firmware & Embedded Debugging",
      "AI Integration",
      "PCB Issues",
      "Cloud & DevOps",
      "Emergency Engineering Support",
    ],
    price: "₹25K – ₹5L+",
    metaTag: "⚡ Fast Delivery",
  },
  {
    category: "startup",
    icon: "🚀",
    title: "Startup MVP Development",
    description:
      "Build your first product with experienced engineers. From idea validation to launch-ready software.",
    items: [
      "Mobile Apps",
      "SaaS Platforms",
      "AI Applications",
      "Backend APIs",
      "Admin Panels",
      "Cloud Deployment",
    ],
    price: "₹30K – ₹10L+",
    metaTag: "🚀 MVP Ready",
  },
  {
    category: "product",
    icon: "⚙️",
    title: "Product Design & Manufacturing",
    description:
      "Transform an idea into a manufacturable product. Complete engineering from industrial design to production.",
    items: [
      "Product Concept",
      "3D CAD Design",
      "PCB Design",
      "Prototype Development",
      "Manufacturing Support",
      "Production Documentation",
    ],
    price: "₹50K – ₹20L+",
    metaTag: "🏭 End-to-End",
  },
  {
    category: "drone",
    icon: "🚁",
    title: "Custom Drone Development",
    description:
      "Build specialized drones for industrial, agriculture, surveillance, research and autonomous applications.",
    items: [
      "Flight Controller",
      "Mission Planning",
      "Payload Integration",
      "Computer Vision",
      "Autonomous Navigation",
      "Manufacturing Support",
    ],
    price: "₹25K – ₹5L+",
    metaTag: "🚁 Custom Solutions",
  },
];

const filters: { label: string; value: Category }[] = [
  { label: "Engineering Solutions We Deliver", value: "all" },
  { label: "Corporate", value: "corporate" },
  { label: "Startup MVP", value: "startup" },
  { label: "Product", value: "product" },
  { label: "Drone", value: "drone" },
];

export default function EngineeringSolutions() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");

  const visibleSolutions = solutions.filter(
    (s) => activeFilter === "all" || s.category === activeFilter
  );

  return (
    <div className="eng-solutions-section flex min-h-screen items-center justify-center bg-gray-50 px-5 py-20 font-sans text-gray-900 transition-colors dark:bg-[#0b0f19] dark:text-gray-100">
      {/*
        Only the keyframe animation and the featured-card hover glow live
        here — they use raw box-shadow / cubic-bezier values that plain
        Tailwind utilities can't express without a config extension.
        Everything else below is dark:-variant utility classes.
      */}
      <style>{`
        @keyframes engFadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .eng-solutions-section .eng-solution-card {
          animation: engFadeInUp 0.6s forwards ease-out;
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
            box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
            border-color 0.3s ease;
        }
        .eng-solutions-section .eng-solution-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
        }
        .dark .eng-solutions-section .eng-solution-card:hover {
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
        }
        .eng-solutions-section .eng-solution-card.eng-featured:hover {
          border-color: #eab308 !important;
          box-shadow: 0 30px 60px rgba(234, 179, 8, 0.15);
        }
      `}</style>

      <section className="mx-auto w-full max-w-7xl">
        {/* FILTER TABS */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {filters.map((f) => {
            const active = activeFilter === f.value;
            return (
              <button
                type="button"
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                  active
                    ? "border-blue-500 bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    : "border-gray-200 bg-white text-gray-500 hover:border-blue-500 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* SECTION TITLE */}
        <div className="mb-16 text-center">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[2px] text-blue-600 dark:text-blue-400">
            OUR EXPERTISE
          </span>
          <h2 className="mb-5 bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-3xl font-extrabold text-transparent dark:from-white dark:to-gray-400 sm:text-[2.5rem]">
            Engineering Solutions Built Around Your Business
          </h2>
          <p className="mx-auto max-w-[650px] text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[1.1rem]">
            Whether you're fixing production issues, building your startup,
            developing a hardware product, or creating autonomous systems,
            Tech Engi provides verified engineering teams from concept to
            deployment.
          </p>
        </div>

        {/* CARDS GRID — 1 / 2 / 4 columns, fully responsive */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {visibleSolutions.map((s, i) => (
            <div
              key={s.title}
              className={`eng-solution-card relative flex flex-col rounded-2xl border p-8 ${
                s.featured
                  ? "eng-featured border-yellow-500/30 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#171e2e]"
                  : "border-gray-200 bg-white dark:border-white/5 dark:bg-[#111827]"
              }`}
              style={{ animationDelay: `${0.1 * (i + 1)}s` }}
            >
              {s.badge && (
                <div className="absolute right-6 top-6 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-yellow-600 dark:text-yellow-500">
                  {s.badge}
                </div>
              )}

              <div className="mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-3xl dark:border-white/5 dark:bg-white/[0.03]">
                {s.icon}
              </div>

              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {s.title}
              </h3>

              <p className="mb-6 flex-grow text-[0.95rem] leading-relaxed text-gray-600 dark:text-gray-400">
                {s.description}
              </p>

              <ul className="mb-8 list-none">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="mb-3 flex items-center gap-2.5 text-[0.9rem] text-gray-700 dark:text-gray-300"
                  >
                    <span
                      className={`font-bold ${
                        s.featured
                          ? "text-yellow-600 dark:text-yellow-500"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      ✔
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-gray-200 pt-5 text-sm font-semibold dark:border-white/5">
                <span className="text-base text-gray-900 dark:text-white">
                  {s.price}
                </span>
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-gray-600 dark:bg-white/5 dark:text-gray-400">
                  {s.metaTag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}