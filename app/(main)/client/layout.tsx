"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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

  if (!mounted || auth.isLoading || !auth.isClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#f0b31e]" />
      </div>
    );
  }

  return (
        <div className="min-h-screen">
            {/* Sidebar and Backdrop */}
            <DashboardShell>
                <div
                    className={`transition-all  duration-300 ease-in-out`}
                >
                    {/* Page Content */}
                    <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
                </div>
            </DashboardShell>
        </div>
    );
}