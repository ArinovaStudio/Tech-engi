"use client";

import { driver, type Config } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_SEEN_KEY = "profileTourSeen";
const STYLE_TAG_ID = "profile-tour-inline-styles";

function injectProfileTourStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_TAG_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    .driver-popover.profile-tour-popover {
      background: #ffffff !important;
      border: 1px solid var(--border) !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12) !important;
      padding: 1.25rem !important;
      max-width: 320px !important;
      font-family: inherit !important;
    }

    .profile-tour-popover .driver-popover-title {
      color: var(--text-primary) !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.375rem !important;
    }

    .profile-tour-popover .driver-popover-description {
      color: var(--text-muted) !important;
      font-size: 0.875rem !important;
      line-height: 1.4 !important;
    }

    .profile-tour-popover .driver-popover-progress-text {
      color: var(--text-muted) !important;
      font-size: 0.75rem !important;
    }

    .profile-tour-popover .driver-popover-footer button {
      border-radius: 0.5rem !important;
      font-size: 0.8125rem !important;
      font-weight: 500 !important;
      padding: 0.4rem 0.85rem !important;
      border: 1px solid var(--border) !important;
      background: #fff !important;
      color: var(--text-primary) !important;
      text-shadow: none !important;
    }

    .profile-tour-popover .driver-popover-footer .driver-popover-next-btn,
    .profile-tour-popover .driver-popover-footer .driver-popover-done-btn {
      background: var(--primary) !important;
      border-color: var(--primary) !important;
      color: #fff !important;
    }

    .profile-tour-popover .driver-popover-close-btn {
      color: var(--text-muted) !important;
    }

    .profile-tour-popover .driver-popover-arrow-side-left.driver-popover-arrow,
    .profile-tour-popover .driver-popover-arrow-side-right.driver-popover-arrow,
    .profile-tour-popover .driver-popover-arrow-side-top.driver-popover-arrow,
    .profile-tour-popover .driver-popover-arrow-side-bottom.driver-popover-arrow {
      border-color: #ffffff !important;
    }

    .driver-active-element {
      border-radius: 0.75rem !important;
    }
  `;
  document.head.appendChild(style);
}

export function startProfileTourIfNew() {
  if (typeof window === "undefined") return;

  let alreadySeen = false;
try {
  alreadySeen =
    window.localStorage.getItem(
      TOUR_SEEN_KEY
    ) === "true";
} catch {}

const isHandoff =
  sessionStorage.getItem(
    "start_engineer_profile_tour"
  ) === "true";

const forced =
  sessionStorage.getItem(
    "force_tour"
  ) === "true";

if (
  alreadySeen &&
  !isHandoff &&
  !forced
) {
  return;
}
  injectProfileTourStyles();

  const config: Config = {
    popoverClass: "profile-tour-popover",
    animate: true,
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 12,
    onDestroyed: () => {
  markTourSeen();

  const isOnboarding =
    sessionStorage.getItem(
      "start_engineer_profile_tour"
    ) === "true";

  if (!isOnboarding) return;

  sessionStorage.removeItem(
    "start_engineer_profile_tour"
  );

  sessionStorage.removeItem(
    "force_tour"
  );

  sessionStorage.removeItem(
    "tour_in_progress"
  );
},
    steps: [
      {
        element: "[data-tour='profile-photo']",
        popover: {
          title: "📸 Profile Photo",
          description:
            "Upload a professional photo so clients can recognize you. Click the camera icon to update it anytime.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='bank-account']",
        popover: {
          title: "🏦 Bank Account",
          description:
            "Add your bank details here to receive project payouts directly. Keep this updated to avoid payment delays.",
          side: "top",
          align: "start",
        },
      },
    ],
  };

  const tourInstance = driver(config);

setTimeout(() => {
  tourInstance.drive();
}, isHandoff ? 500 : 0);
function markTourSeen() {
  try {
    window.localStorage.setItem(TOUR_SEEN_KEY, "true");
  } catch {}
}
}