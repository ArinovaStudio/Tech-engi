"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !auth.isLoading) {
      if (!auth.isAuthenticated) {
        router.push("/login");
      }
    }
  }, [mounted, auth.isLoading, auth.isAuthenticated, router]);

  if (!mounted || auth.isLoading || !auth.isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#f0b31e]" />
      </div>
    );
  }

  return <>{children}</>;
}