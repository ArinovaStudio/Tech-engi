import Link from "next/link";
import {
  Code2,
  Cog,
  CircleHelp,
  DraftingCompass,
  GraduationCap,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

interface CategoryItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  ctaText: string;
  href: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    icon: Code2,
    title: "Code & software",
    description:
      "A bug nobody can reproduce, a half-finished build, an API that broke after a migration, or a whole product from zero.",
    ctaText: "Post a coding job",
    href: "/start?category=software",
  },
  {
    icon: Cog,
    title: "Mechanical design",
    description:
      "CAD models, enclosures, tolerance and fit, DFM reviews, and drawings a workshop can actually quote from.",
    ctaText: "Post a design job",
    href: "/start?category=hardware",
  },
  {
    icon: DraftingCompass,
    title: "Product design",
    description:
      "From a sketch to something manufacturable — industrial design, prototyping, PCB layout and the electronics inside it.",
    ctaText: "Post a product brief",
    href: "/start?category=design",
  },
  {
    icon: GraduationCap,
    title: "Student & capstone projects",
    description:
      "A working engineer sits with you on your own build — reviews your code, unblocks your hardware, and explains the fix so you can defend every line of it in your viva.",
    ctaText: "Get unstuck",
    href: "/start?category=software&mode=review",
  },
  {
    icon: LayoutDashboard,
    title: "Custom software for your business",
    description:
      "Stop paying monthly for a tool that does 60% of what you need. Have the one you actually need built, and own it outright.",
    ctaText: "Describe your idea",
    href: "/start?category=software",
  },
  {
    icon: CircleHelp,
    title: "Not sure which one you need?",
    description:
      "That is the normal case, not the hard one. Describe it in plain words and Nashedi AI works out what the job actually requires, then shows you the brief before anyone quotes.",
    ctaText: "Just describe it",
    href: "/start",
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal mb-10 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-saas-accent-2">Start with what you need</p>
            <h2 className="mt-3 text-balance font-sans text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.05em] text-saas-ink">
              Engineering help, wherever you&apos;re starting.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-saas-tx sm:text-lg">
            Choose the closest fit. We&apos;ll help you shape the details and find the right
            freelancer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
          {CATEGORIES.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="reveal group relative flex min-h-60 flex-col overflow-hidden rounded-saas-4xl border border-saas-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-saas-accent/40 hover:bg-saas-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saas-accent sm:p-7"
              >
                <span className="flex items-center justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-saas-icon-bg text-saas-icon-stroke transition-colors duration-300 group-hover:bg-saas-accent group-hover:text-white">
                    <Icon aria-hidden="true" className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-xs font-semibold text-saas-mut">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </span>

                <div className="mt-8">
                  <h3 className="font-sans text-xl font-bold tracking-tight text-saas-ink sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-saas-tx sm:text-base">
                    {item.description}
                  </p>
                </div>

                <span className="mt-auto inline-flex items-center justify-between pt-7 text-sm font-semibold text-saas-ink">
                  <span>{item.ctaText}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-saas-bg text-saas-ink transition-all duration-300 group-hover:bg-saas-accent group-hover:text-white">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
