"use client";

import { useEffect, useRef } from "react";
import styles from "./CoWorkerPage.module.css";

type Drop = {
  y: number;
  color: string;
  active: boolean;
};

const GLYPHS = "{}[]()<>/;=+-*&|01$#fn".split("");
const COLORS = ["#dba400", "#c3a23d", "#8d9ab4", "#c1a8a0"];

export default function CoWorkerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let columns: Drop[] = [];
    let frameId = 0;
    let lastFrame = 0;
    let isVisible = !document.hidden;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      columns = Array.from(
        { length: Math.ceil(window.innerWidth / 30) },
        () => ({
          y: (Math.random() * window.innerHeight) / 18,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          active: Math.random() < 0.4,
        }),
      );
      drawStaticGlyphs();
    };

    const drawStaticGlyphs = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.font = "14px ui-monospace, SFMono-Regular, Menlo, monospace";
      columns.forEach((drop, index) => {
        if (Math.random() > 0.86) return;
        context.globalAlpha = 0.22;
        context.fillStyle = drop.color;
        context.fillText(
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          index * 30,
          Math.random() * window.innerHeight,
        );
      });
      context.globalAlpha = 1;
    };

    const animate = (time: number) => {
      if (!isVisible) return;
      frameId = window.requestAnimationFrame(animate);
      if (time - lastFrame < 55) return;
      lastFrame = time;

      context.fillStyle = "rgba(247, 249, 253, 0.14)";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.font = "14px ui-monospace, SFMono-Regular, Menlo, monospace";

      columns.forEach((drop, index) => {
        if (!drop.active) {
          if (Math.random() < 0.003) drop.active = true;
          return;
        }

        context.globalAlpha = 0.35;
        context.fillStyle = drop.color;
        context.fillText(
          GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          index * 30,
          drop.y * 18,
        );

        if (
          drop.y * 18 > window.innerHeight &&
          Math.random() > 0.97
        ) {
          drop.y = 0;
          drop.color = COLORS[Math.floor(Math.random() * COLORS.length)];
          drop.active = Math.random() < 0.6;
        }
        drop.y += 1;
      });
      context.globalAlpha = 1;
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      window.cancelAnimationFrame(frameId);
      if (isVisible && !reducedMotion) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (!reducedMotion) frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className={styles.background} aria-hidden="true">
      <canvas className={styles.codeRain} ref={canvasRef} />
      <svg
        className={styles.flowingLines}
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMin slice"
        focusable="false"
      >
        <path className={styles.flowAmber} d="M75 -30 C 75 190, 190 265, 190 470 S 105 720, 105 940" />
        <path className={styles.flowGold} d="M190 470 C 280 520, 325 635, 325 940" />
        <path className={styles.flowBlue} d="M1120 -30 C 1120 175, 1015 245, 1015 430 S 1125 705, 1125 940" />
        <circle cx="75" cy="145" r="5" />
        <circle cx="190" cy="470" r="6" />
        <circle cx="1015" cy="430" r="5" />
        <circle cx="105" cy="720" r="5" />
      </svg>
    </div>
  );
}
