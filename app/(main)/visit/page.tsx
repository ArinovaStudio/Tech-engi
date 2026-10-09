"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VisitTracker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const hasRun = useRef(false); // prevents double-firing in React strict mode (dev)

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const track = async () => {
      try {
        if (ref) {
          await fetch("/api/visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ref }),
          });
        }
      } catch (e) {
        console.error("Failed to track visit", e);
      } finally {
        router.replace("/"); // always redirect, even if tracking fails
      }
    };

    track();
  }, [ref, router]);

  return <p>Redirecting...</p>;
}

export default function VisitPage() {
  return (
    <Suspense fallback={<p>Redirecting...</p>}>
      <VisitTracker />
    </Suspense>
  );
}