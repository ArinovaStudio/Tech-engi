import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";

export default async function EngineerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ENGINEER") {
    redirect("/");
  }

  return <>{children}</>;
}