import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(
  animation: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" = "fadeUp"
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y: animation === "fadeUp" ? 60 : 0,
      x: animation === "slideLeft" ? -80 : animation === "slideRight" ? 80 : 0,
    };

    const tween = gsap.fromTo(el, fromVars, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // ScrollTrigger computes each trigger's start/end pixel position at
    // creation time. If content above this element (fonts, emoji glyphs,
    // images, other sections still loading) changes height afterward,
    // this element shifts down and the trigger fires at the wrong scroll
    // position — the element can end up stuck at opacity: 0 or offset,
    // which looks like "everything below is distorted."
    // Refresh once layout has actually settled to recalculate positions.
    const refresh = () => ScrollTrigger.refresh();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener("load", refresh);
    const settleTimeout = setTimeout(refresh, 500);

    return () => {
      // Kill only this tween's own ScrollTrigger instance, not every
      // ScrollTrigger on the page — killing all of them here was
      // clobbering triggers owned by other components/instances of
      // this same hook mounted elsewhere on the page.
      tween.scrollTrigger?.kill();
      tween.kill();
      window.removeEventListener("load", refresh);
      clearTimeout(settleTimeout);
    };
  }, [animation]);

  return ref;
}