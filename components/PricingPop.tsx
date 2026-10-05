"use client";

import { useEffect } from "react";
import {
  X,
  Crown,
  Clock3,
  FileText,
  Layers3,
  BadgeCheck,
  Funnel,
  BarChart3,
  Zap,
  Infinity,
  Star,
  ShieldCheck,
  CreditCard,
  Headphones,
  ArrowRight,
} from "lucide-react";

interface UpgradeProModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const freeFeatures = [
  {
    icon: Clock3,
    text: "Leads released 24–48 hrs after client posts",
  },
  {
    icon: FileText,
    text: "Capped applications (recommend 5)",
  },
  {
    icon: Layers3,
    text: "Standard queue order",
  },
  {
    icon: BadgeCheck,
    text: "Verified badge",
  },
  {
    icon: Funnel,
    text: "Basic filters (category only)",
  },
  {
    icon: BarChart3,
    text: "No analytics",
  },
];

const proFeatures = [
  {
    icon: Zap,
    text: "Instant, real-time lead visibility",
  },
  {
    icon: Infinity,
    text: "Unlimited applications/bids",
  },
  {
    icon: Star,
    text: "Shown first to clients",
  },
  {
    icon: Crown,
    text: "Pro profile badge",
  },
  {
    icon: Funnel,
    text: "Advanced filters (budget, domain, Layer 1/2/3, saved searches)",
  },
  {
    icon: BarChart3,
    text: "Detailed analytics (match rate, response rate, win rate)",
  },
];

export default function UpgradeProModal({
  open,
  onClose,
  onUpgrade,
}: UpgradeProModalProps) {
  /*
   * Prevent background scrolling while modal is open.
   */
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-[#050a30]/55
        p-3
        backdrop-blur-md
        sm:p-6
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        className="
          relative
          flex
          max-h-[94vh]
          w-full
          max-w-[1400px]
          flex-col
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-[0_35px_100px_rgba(5,10,48,0.35)]
        "
      >
        {/* =========================================================
            CLOSE BUTTON
        ========================================================= */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute
            right-5
            top-5
            z-50
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white/90
            text-[#050a30]
            shadow-md
            backdrop-blur
            transition
            hover:scale-105
            hover:bg-white
          "
        >
          <X size={21} strokeWidth={1.8} />
        </button>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}

        <div className="grid min-h-0 flex-1 lg:grid-cols-[58%_42%]">
          {/* =======================================================
              LEFT SIDE
          ======================================================= */}

          <section className="relative overflow-y-auto bg-white px-6 pb-7 pt-8 sm:px-10 sm:pt-10 lg:px-12">
            {/* subtle cyber / architectural lines */}

            <CyberLines />

            <div className="relative z-10">
              {/* Small label */}

              <div className="mb-5 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    text-[#ffffff]
                  "
                >
                  <Crown
                    size={19}
                    strokeWidth={2}
                    className="fill-[#ffffff]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="
                      text-[11px]
                      font-bold
                      uppercase
                      tracking-[0.32em]
                      text-[#050a30]
                    "
                  >
                    Upgrade to Pro
                  </span>

                  <span className="h-px w-16 bg-[#ffffff]" />
                </div>
              </div>

              {/* =================================================
                  HEADLINE
              ================================================= */}

              <h1
                id="upgrade-title"
                className="
                  max-w-[720px]
                  text-[38px]
                  font-bold
                  leading-[0.98]
                  tracking-[-0.045em]
                  text-[#050a30]
                  sm:text-[48px]
                  lg:text-[54px]
                  xl:text-[60px]
                "
              >
                Get instant access to
                <br />
                <span className="text-[#1257e8]">
                  more opportunities
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-[670px]
                  text-[15px]
                  leading-6
                  text-slate-500
                  sm:text-[16px]
                "
              >
                Upgrade to Pro and unlock real-time leads, unlimited
                applications and advanced filters to grow your business
                faster.
              </p>

              {/* =================================================
                  PLANS
              ================================================= */}

              <div
                className="
                  mt-7
                  grid
                  gap-4
                  md:grid-cols-2
                "
              >
                {/* FREE */}

                <FreePlan />

                {/* PRO */}

                <ProPlan onUpgrade={onUpgrade} />
              </div>
            </div>
          </section>

          {/* =======================================================
              RIGHT SIDE / ARTWORK
          ======================================================= */}

          <section
            className="
              relative
              hidden
              min-h-[680px]
              overflow-hidden
              bg-[#1257e8]
              lg:block
            "
          >
            {/* background geometry */}

            <RightBackground />

            {/* Top message */}

            <div
              className="
                absolute
                left-10
                top-14
                z-20
                max-w-[150px]
              "
            >
              <p
                className="
                  text-[12px]
                  font-medium
                  uppercase
                  leading-[1.8]
                  tracking-[0.32em]
                  text-white/70
                "
              >
                More
                <br />
                clients
                <br />
                faster
                <br />
                growth
              </p>

              <div className="mt-4 h-px w-10 bg-[#ffffff]" />
            </div>

            {/* Character */}

            <div
              className="
                absolute
                top-0
                left-0
                z-10
                flex
                items-end
                justify-center
              "
            >
              <img
                src="/saas/pricing.png"
                alt="Pro member working with new leads"
                className="
                  h-auto
                  w-full
                  max-w-none
                  object-cover
                  object-bottom
                "
              />
            </div>

            {/* Floating New Leads card */}

            <div
              className="
                absolute
                left-[7%]
                top-[28%]
                z-30
                w-[150px]
                -rotate-[7deg]
                rounded-xl
                border
                border-white/40
                bg-white/10
                p-4
                shadow-xl
                backdrop-blur-md
              "
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-white">
                  New Leads
                </span>

                <span className="text-[#ffffff]">
                  ♥
                </span>
              </div>

              <div className="mt-3 flex items-end gap-1">
                <span className="h-4 w-1.5 rounded-sm bg-[#ffffff]" />
                <span className="h-6 w-1.5 rounded-sm bg-[#ffffff]" />
                <span className="h-9 w-1.5 rounded-sm bg-[#ffffff]" />
                <span className="h-12 w-1.5 rounded-sm bg-[#ffffff]" />
              </div>

              <p className="mt-2 text-xl font-bold text-[#ffffff]">
                +12
              </p>
            </div>

            {/* Client interested card */}

            <div
              className="
                absolute
                right-[6%]
                top-[38%]
                z-30
                w-[150px]
                rotate-[4deg]
                rounded-xl
                border
                border-white/40
                bg-white/10
                p-4
                shadow-xl
                backdrop-blur-md
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-white/10
                  "
                >
                  <div className="h-4 w-4 rounded-full bg-[#ffffff]" />
                </div>

                <div>
                  <p className="text-[10px] text-white/60">
                    Client
                  </p>

                  <p className="text-xs font-semibold text-white">
                    Interested
                  </p>
                </div>
              </div>

              <div className="mt-3 h-1.5 rounded-full bg-white/10">
                <div className="h-full w-[75%] rounded-full bg-[#ffffff]" />
              </div>
            </div>

            {/* Crown card */}

            <div
              className="
                absolute
                right-[7%]
                top-[23%]
                z-30
                flex
                h-16
                w-16
                rotate-[5deg]
                items-center
                justify-center
                rounded-xl
                border
                border-white/30
                bg-white/10
                backdrop-blur-md
              "
            >
              <Crown
                size={30}
                className="fill-[#ffffff] text-[#ffffff]"
              />
            </div>
          </section>
        </div>

        {/* =========================================================
            TRUST FOOTER
        ========================================================= */}

        <div
          className="
            relative
            z-40
            border-t
            border-slate-100
            bg-white
            px-5
            py-4
            sm:px-10
          "
        >
          <div
            className="
              grid
              grid-cols-1
              divide-y
              divide-slate-200
              sm:grid-cols-3
              sm:divide-x
              sm:divide-y-0
            "
          >
            <TrustItem
              icon={ShieldCheck}
              title="Cancel anytime"
              description="No long-term contract"
            />

            <TrustItem
              icon={CreditCard}
              title="Secure payment"
              description="SSL encrypted"
            />

            <TrustItem
              icon={Headphones}
              title="24/7 support"
              description="We're here to help"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   FREE PLAN
=============================================================== */

function FreePlan() {
  return (
    <div
      className="
        rounded-[18px]
        border
        border-slate-200
        bg-white
        p-5
        sm:p-6
      "
    >
      <h2 className="text-[24px] font-bold tracking-tight text-[#050a30]">
        Free
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Good to explore and get started.
      </p>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-[38px] font-bold tracking-[-0.04em] text-[#050a30]">
          ₹0
        </span>

        <span className="text-sm text-slate-500">
          /month
        </span>
      </div>

      <div className="my-5 h-px bg-slate-100" />

      <div className="space-y-3">
        {freeFeatures.map((feature) => (
          <Feature
            key={feature.text}
            icon={feature.icon}
            text={feature.text}
            dark
          />
        ))}
      </div>

      <button
        type="button"
        className="
          mt-6
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          border
          border-slate-200
          bg-white
          text-sm
          font-semibold
          text-[#050a30]
          transition
          hover:bg-slate-50
        "
      >
        Continue with Free
        <ArrowRight size={17} />
      </button>
    </div>
  );
}

/* ===============================================================
   PRO PLAN
=============================================================== */

function ProPlan({
  onUpgrade,
}: {
  onUpgrade: () => void;
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[18px]
        bg-[#1257e8]
        p-5
        text-white
        shadow-[0_15px_40px_rgba(18,87,232,0.18)]
        sm:p-6
      "
    >
      {/* subtle technical corner */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-12
          w-12
          border-l
          border-b
          border-white/20
        "
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-bold text-white tracking-tight">
            Pro
          </h2>

          <p className="mt-1 text-sm text-white/75">
            Get instant visibility and more opportunities.
          </p>
        </div>

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-full
            bg-white
            px-3
            py-1.5
            text-[11px]
            font-semibold
            text-[#1257e8]
          "
        >
          <Crown
            size={13}
            className="fill-[#f0b31e] text-[#f0b31e]"
          />

          Most Popular
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-[38px] font-bold tracking-[-0.04em]">
          ₹734
        </span>

        <span className="text-sm text-white/70">
          /month
        </span>
      </div>

      <div className="my-5 h-px bg-white/15" />

      <div className="space-y-3">
        {proFeatures.map((feature) => (
          <Feature
            key={feature.text}
            icon={feature.icon}
            text={feature.text}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onUpgrade}
        className="
          group
          mt-6
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          bg-white
          text-sm
          font-bold
          text-[#1257e8]
          transition
          hover:-translate-y-0.5
          hover:shadow-xl
        "
      >
        {/* Upgrade to Pro */}
        Coming soon
        {/* <ArrowRight
          size={18}
          className="
            transition-transform
            group-hover:translate-x-1
          "
        /> */}
      </button>
    </div>
  );
}

/* ===============================================================
   FEATURE
=============================================================== */

function Feature({
  icon: Icon,
  text,
  dark = false,
}: {
  icon: React.ElementType;
  text: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`
          mt-0.5
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          ${
            dark
              ? "text-[#050a30]"
              : "text-[#ffffff]"
          }
        `}
      >
        <Icon size={17} strokeWidth={2} />
      </div>

      <p
        className={`
          text-[13px]
          leading-[1.45]
          ${
            dark
              ? "text-slate-600"
              : "text-white/90"
          }
        `}
      >
        {text}
      </p>
    </div>
  );
}

/* ===============================================================
   TRUST ITEM
=============================================================== */

function TrustItem({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-3
        px-4
        py-2
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-slate-50
          text-[#050a30]
        "
      >
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm font-semibold text-[#050a30]">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ===============================================================
   LEFT SIDE CYBER LINES
=============================================================== */

function CyberLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* top right vertical */}

      <div
        className="
          absolute
          right-[4%]
          top-0
          h-24
          w-px
          bg-[#1257e8]/20
        "
      />

      <div
        className="
          absolute
          right-[4%]
          top-10
          h-px
          w-16
          bg-[#1257e8]/20
        "
      />

      {/* corner line */}

      <div
        className="
          absolute
          right-[12%]
          top-0
          h-28
          w-24
          border-b
          border-l
          border-[#1257e8]/15
        "
      />

      {/* little blue accent */}

      <div
        className="
          absolute
          right-[5%]
          top-10
          h-8
          w-1
          bg-[#1257e8]
        "
      />

      {/* bottom left */}

      <div
        className="
          absolute
          bottom-8
          left-0
          h-20
          w-20
          border-r
          border-t
          border-[#ffffff]/40
        "
      />

      <div
        className="
          absolute
          bottom-8
          left-0
          h-px
          w-24
          bg-[#ffffff]/40
        "
      />
    </div>
  );
}

/* ===============================================================
   RIGHT BACKGROUND
=============================================================== */

function RightBackground() {
  return (
    <>
      {/* dark blue architectural blocks */}

      <div
        className="
          absolute
          inset-0
          bg-[#1257e8]
        "
      />

      <div
        className="
          absolute
          right-[-8%]
          top-[-10%]
          h-[70%]
          w-[48%]
          bg-[#050a30]
          [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%,0_30%)]
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-[8%]
          h-[45%]
          w-[38%]
          bg-[#050a30]/90
          [clip-path:polygon(0_30%,35%_0,100%_0,100%_100%,0_100%)]
        "
      />

      {/* yellow architectural accent */}

      <div
        className="
          absolute
          right-[30%]
          top-0
          h-[100%]
          w-[10px]
          bg-[#ffffff]
          opacity-90
        "
        style={{
          clipPath:
            "polygon(0 0,100% 8%,100% 65%,0 100%)",
        }}
      />

      <div
        className="
          absolute
          bottom-[-5%]
          right-[3%]
          h-[32%]
          w-[32%]
          bg-[#ffffff]
          [clip-path:polygon(40%_0,100%_0,100%_100%,0_100%,0_50%)]
        "
      />

      {/* thin cyber lines */}

      <div className="absolute left-[15%] top-[5%] h-[25%] w-px bg-white/30" />

      <div className="absolute left-[15%] top-[5%] h-px w-32 bg-white/30" />

      <div className="absolute right-[18%] top-[8%] h-px w-28 bg-white/30" />

      <div className="absolute right-[18%] top-[8%] h-28 w-px bg-white/30" />

      <div className="absolute bottom-[20%] left-[10%] h-px w-36 bg-[#ffffff]" />

      <div className="absolute bottom-[20%] left-[10%] h-16 w-px bg-[#ffffff]" />
    </>
  );
}