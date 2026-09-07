"use client";

import { useScrollAnimation } from "@/lib/useScrollAnimation";
import { ElementType, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  animation?: "fadeUp" | "fadeIn" | "slideLeft" | "slideRight";
  className?: string;
  as?: ElementType;
};

// Thin client boundary around useScrollAnimation so parent sections can
// stay as Server Components and only ship this small wrapper to the client.
export default function ScrollReveal({
  children,
  animation = "fadeUp",
  className,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useScrollAnimation(animation);

  return (
    <Tag ref={ref as React.Ref<any>} className={className}>
      {children}
    </Tag>
  );
}