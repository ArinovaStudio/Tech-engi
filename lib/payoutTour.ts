"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { driver, type Config } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_SEEN_KEY = "payoutTourSeen";
const STYLE_TAG_ID = "payout-tour-inline-styles";

/**
 * Injects the popover theme directly into the document <head>.
 * Using !important here means it always wins over driver.js's base
 * stylesheet, regardless of CSS import order anywhere else in the app.
 * Safe to call multiple times — it only inserts the tag once.
 */
function injectPayoutTourStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_TAG_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    .driver-popover.payout-tour-popover {
      background: #ffffff !important;
      border: 1px solid var(--border) !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12) !important;
      padding: 1.25rem !important;
      max-width: 320px !important;
      font-family: inherit !important;
    }

    .payout-tour-popover .driver-popover-title {
      color: var(--text-primary) !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.375rem !important;
    }

    .payout-tour-popover .driver-popover-description {
      color: var(--text-muted) !important;
      font-size: 0.875rem !important;
      line-height: 1.4 !important;
    }

    .payout-tour-popover .driver-popover-progress-text {
      color: var(--text-muted) !important;
      font-size: 0.75rem !important;
    }

    .payout-tour-popover .driver-popover-footer button {
      border-radius: 0.5rem !important;
      font-size: 0.8125rem !important;
      font-weight: 500 !important;
      padding: 0.4rem 0.85rem !important;
      border: 1px solid var(--border) !important;
      background: #fff !important;
      color: var(--text-primary) !important;
      text-shadow: none !important;
    }

    .payout-tour-popover .driver-popover-footer .driver-popover-next-btn,
    .payout-tour-popover .driver-popover-footer .driver-popover-done-btn {
      background: var(--primary) !important;
      border-color: var(--primary) !important;
      color: #fff !important;
    }

    .payout-tour-popover .driver-popover-close-btn {
      color: var(--text-muted) !important;
    }

    .payout-tour-popover .driver-popover-arrow-side-left.driver-popover-arrow,
    .payout-tour-popover .driver-popover-arrow-side-right.driver-popover-arrow,
    .payout-tour-popover .driver-popover-arrow-side-top.driver-popover-arrow,
    .payout-tour-popover .driver-popover-arrow-side-bottom.driver-popover-arrow {
      border-color: #ffffff !important;
    }

    .driver-active-element {
      border-radius: 0.75rem !important;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Builds and starts the one-time "My Payouts" onboarding tour.
 * Call this after the page has finished loading and the DOM nodes
 * carrying the data-tour attributes are mounted.
 *
 * Safe to call on every page load — it no-ops if the tour was
 * already seen on this browser (localStorage flag).
 */
export function startPayoutTourIfNew(
  router?: AppRouterInstance
) {
  if (typeof window === "undefined") return;

  let alreadySeen = false;
  try {
    alreadySeen = window.localStorage.getItem(TOUR_SEEN_KEY) === "true";
  } catch {
    // localStorage unavailable (e.g. private mode) — just don't persist,
    // but still allow the tour to run once for this session.
  }
  const isHandoff =
  sessionStorage.getItem(
    "start_engineer_payout_tour"
  ) === "true";

const forced =
  sessionStorage.getItem(
    "force_tour"
  ) === "true";

  if (alreadySeen && !isHandoff) return;

  injectPayoutTourStyles();

  const config: Config = {
    popoverClass: "payout-tour-popover",
    animate: true,
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 12,
    
    onDestroyed: () => {
  const isOnboarding =
    sessionStorage.getItem(
      "start_engineer_payout_tour"
    ) === "true";

  markTourSeen();

  if (!isOnboarding) return;

  sessionStorage.removeItem(
    "start_engineer_payout_tour"
  );

  sessionStorage.setItem(
    "start_engineer_profile_tour",
    "true"
  );

  if (router) {
    router.push("/engineer/profile");
  } else {
    window.location.href =
      "/engineer/profile";
  }
},

    steps: [
      {
        element: "[data-tour='total-earnings']",
        popover: {
          title: "Total Earnings",
          description:
            "This is your total earnings across all projects — the sum of what's been paid out to you and what's still pending.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='amount-received']",
        popover: {
          title: "Amount Received",
          description:
            "Money that has already been successfully paid out to your account.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='amount-pending']",
        popover: {
          title: "Amount Pending",
          description:
            "Earnings that are approved but still awaiting release. This will move to Amount Received once processed.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='bank-details']",
        popover: {
          title: "Bank Details",
          description:
            "Before you can receive any payout, you'll need to add your bank details first on your Profile page. Head over there to set it up if you haven't already.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='last-payment']",
        popover: {
          title: "Last Payment",
          description:
            "A quick look at your most recent payout — amount, project, and date.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='payout-history']",
        popover: {
          title: "Payout History",
          description:
            "Every payout transaction lives here, with its status, so you can track exactly what's been paid and what's still in progress.",
          side: "top",
          align: "start",
        },
      },
    ],
  };

  const tourInstance = driver(config);
  // console.log("PAYOUT TOUR STARTING");
  tourInstance.drive();
}

function markTourSeen() {
  try {
    window.localStorage.setItem(TOUR_SEEN_KEY, "true");
  } catch {
    // ignore if storage is unavailable
  }
}