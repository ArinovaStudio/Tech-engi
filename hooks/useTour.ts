"use client";
import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { dashboardTourSteps } from "@/config/dashboardTourSteps";

export const useTour = (userId: string) => {
  useEffect(() => {
    if (!userId) return;
    const tourKey = `tour_seen_${userId}`;
    const hasSeenTour = localStorage.getItem(tourKey);
    if (hasSeenTour) return;

    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      popoverClass: "custom-tour-popover",
      overlayOpacity: 0.35,
      nextBtnText: "Next →",
      prevBtnText: "← Prev",
      doneBtnText: "Done ✓",
      onPopoverRender: (popover) => {                          // 👈 ADD THIS BLOCK
        const style = (el: HTMLElement) => {
          el.style.setProperty("background", "var(--primary)", "important");
          el.style.setProperty("color", "#ffffff", "important");
          el.style.setProperty("opacity", "1", "important");
          el.style.setProperty("border", "none", "important");
        };
        if (popover.nextButton) style(popover.nextButton);
        if (popover.previousButton) {
          popover.previousButton.style.setProperty("background", "transparent", "important");
          popover.previousButton.style.setProperty("color", "var(--text-secondary)", "important");
          popover.previousButton.style.setProperty("border", "1px solid var(--border)", "important");
        }
      },
      onDestroyed: () => {
        localStorage.setItem(tourKey, "true");
      },
      steps: dashboardTourSteps,
    });

    // Small delay to let the page fully render first
    const timer = setTimeout(() => {
      driverObj.drive();
    }, 1500);

    return () => clearTimeout(timer);
  }, [userId]);
};