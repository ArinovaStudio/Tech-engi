"use client";

import { driver, type Config } from "driver.js";
import "driver.js/dist/driver.css";

const TOUR_SEEN_KEY = "milestoneTourSeen";
const STYLE_TAG_ID = "milestone-tour-inline-styles";

function injectMilestoneTourStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_TAG_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    .driver-popover.milestone-tour-popover {
      background: #ffffff !important;
      border: 1px solid var(--border) !important;
      border-radius: 0.75rem !important;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12) !important;
      padding: 1.25rem !important;
      max-width: 320px !important;
      font-family: inherit !important;
    }
    .milestone-tour-popover .driver-popover-title {
      color: var(--text-primary) !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      margin-bottom: 0.375rem !important;
    }
    .milestone-tour-popover .driver-popover-description {
      color: var(--text-muted) !important;
      font-size: 0.875rem !important;
      line-height: 1.4 !important;
    }
    .milestone-tour-popover .driver-popover-progress-text {
      color: var(--text-muted) !important;
      font-size: 0.75rem !important;
    }
    .milestone-tour-popover .driver-popover-footer button {
      border-radius: 0.5rem !important;
      font-size: 0.8125rem !important;
      font-weight: 500 !important;
      padding: 0.4rem 0.85rem !important;
      border: 1px solid var(--border) !important;
      background: #fff !important;
      color: var(--text-primary) !important;
      text-shadow: none !important;
    }
    .milestone-tour-popover .driver-popover-footer .driver-popover-next-btn,
    .milestone-tour-popover .driver-popover-footer .driver-popover-done-btn {
      background: var(--primary) !important;
      border-color: var(--primary) !important;
      color: #fff !important;
    }
    .milestone-tour-popover .driver-popover-close-btn {
      color: var(--text-muted) !important;
    }
    .driver-active-element {
      border-radius: 0.75rem !important;
    }
  `;
  document.head.appendChild(style);
}

export function startMilestoneTourIfNew(openModal: () => void) {
  if (typeof window === "undefined") return;

  let alreadySeen = false;
  try {
    alreadySeen = window.localStorage.getItem(TOUR_SEEN_KEY) === "true";
  } catch {}

  if (alreadySeen) return;

  injectMilestoneTourStyles();

  const config: Config = {
    popoverClass: "milestone-tour-popover",
    animate: true,
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 12,
    onDestroyed: () => markTourSeen(),
    steps: [
      {
        element: "[data-tour='add-milestone-btn']",
        popover: {
          title: "📌 Add Milestone",
          description:
            "Use this button to create a new milestone for the project. Milestones help track key deliverables and deadlines.",
          side: "bottom",
          align: "start",
          onNextClick: () => {
            openModal();       // 👈 opens the modal
            setTimeout(() => tourInstance.moveNext(), 300); // wait for modal to mount
          },
        },
      },
      {
        element: "[data-tour='milestone-title']",
        popover: {
          title: "✏️ Title",
          description: "Give your milestone a clear, descriptive title.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='milestone-description']",
        popover: {
          title: "📝 Description",
          description: "Optionally describe what this milestone covers.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='milestone-dates']",
        popover: {
          title: "📅 Start & End Date",
          description: "Set the timeline for this milestone.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='milestone-type']",
        popover: {
          title: "📁 Type",
          description:
            "Choose what kind of deliverable this milestone contains — Image, Zip, Document, or a Link.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "[data-tour='milestone-upload']",
        popover: {
          title: "📎 Upload File",
          description:
            "Drag & drop or click to upload the file for this milestone.",
          side: "top",
          align: "start",
        },
      },
    ],
  };

  const tourInstance = driver(config);
  tourInstance.drive();
}

function markTourSeen() {
  try {
    window.localStorage.setItem(TOUR_SEEN_KEY, "true");
  } catch {}
}