"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/components/saas/gsapClient";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Scoped to the landing route only: html.saas-page gives the page its light
    // color-scheme/scrollbar, header offset and smooth anchors (see saas.css).
    // Removed again on unmount.
    const html = document.documentElement;
    html.classList.add("saas-page");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => html.classList.remove("saas-page");
    }

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      html.classList.remove("saas-page");
    };
  }, []);

  return <>{children}</>;
}
