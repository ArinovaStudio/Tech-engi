"use client";

import DashboardShell from "@/components/layout/DashboardShell";
import React from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

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
