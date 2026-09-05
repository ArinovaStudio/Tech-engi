import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

import DashboardShell from "@/components/layout/DashboardShell";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "CLIENT") {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <DashboardShell>
        <div className="transition-all duration-300 ease-in-out h-full">
          <div className="">
            {children}
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}