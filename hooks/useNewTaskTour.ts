"use client";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { newTaskTourSteps } from "@/config/newTaskTourSteps";

export const useNewTaskTour = () => {
  const startTaskTour = () => {
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
      steps: newTaskTourSteps,
    });
    driverObj.drive();
  };
  return { startTaskTour };
};