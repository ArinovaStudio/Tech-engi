"use client";
import { useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { newTaskTourSteps } from "@/config/newTaskTourSteps";

export const useNewTaskTour = () => {
  const startTaskTour = () => {
    // Tracks whether the user completed the full tour (reached the last step
    // and clicked Done) vs. dismissed it early (X or Escape).
    // Only chain to Milestones on a full completion.
    let completedFully = false;

    // Clone steps so we can patch the last one's onNextClick without
    // mutating the shared config array.
    const steps = newTaskTourSteps.map((step, index) => {
      const isLast = index === newTaskTourSteps.length - 1;
      if (!isLast) return step;

      return {
        ...step,
        popover: {
          ...step.popover,
          // "Done" on the last step triggers onNextClick in driver.js
          onNextClick: (_el: any, _step: any, opts: any) => {
            completedFully = true;
            opts.driver.destroy();
          },
        },
      };
    });

    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      popoverClass: "custom-tour-popover",
      nextBtnText: "Next →",
      prevBtnText: "← Prev",
      doneBtnText: "Done ✓",
      onPopoverRender: (popover) => {
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
      steps,
      onDestroyed: () => {
        // Only advance to Milestones if the user finished the modal tour.
        // If they dismissed early, drop the chain gracefully.
        if (completedFully) {
          window.dispatchEvent(
            new CustomEvent("tour-go-to-tab", { detail: "Milestones" })
          );
        }
      },
    });

    driverObj.drive();
  };

  return { startTaskTour };
};