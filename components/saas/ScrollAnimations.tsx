"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/components/saas/gsapClient";

export default function ScrollAnimations() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduced && document.querySelector(".reveal")) {
        // Fade + rise reveal for anything marked `.reveal`.
        // Guarded: gsap.set on a selector matching nothing just logs a
        // "target not found" warning for no benefit.
        gsap.set(".reveal", { opacity: 0, y: 34 });
        ScrollTrigger.batch(".reveal", {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              stagger: 0.09,
              duration: 0.8,
              ease: "power3.out",
            }),
        });

        // Gentle parallax drift on hero/feature images
        gsap.utils.toArray<HTMLElement>(".parallax").forEach((el) => {
          const rotated = el.dataset.rot === "1";
          gsap.fromTo(
            el,
            { yPercent: 6, rotate: rotated ? -5 : 0 },
            {
              yPercent: -6,
              rotate: rotated ? 5 : 0,
              ease: "none",
              scrollTrigger: { trigger: el, scrub: true },
            }
          );
        });
      }

      // Counting stats (runs regardless of reduced motion, just without easing flourish)
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix ?? "";
        const counter = { value: 0 };
        const update = () => {
          el.textContent = Math.round(counter.value).toLocaleString() + suffix;
        };
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () =>
            gsap.to(counter, {
              value: target,
              duration: reduced ? 0 : 1.8,
              ease: "power2.out",
              onUpdate: update,
            }),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
