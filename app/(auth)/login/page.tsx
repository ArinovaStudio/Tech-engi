import type { Metadata } from "next";
import LoginClient from "./LoginClient";
import { safeCallbackPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Log in · Tech Engi",
  description:
    "Log in to your Tech Engi account. AI-matched engineering work in India, escrow-backed and identity-verified.",
  robots: {
    index: false,
    follow: true,
  },
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return (
    <LoginClient
      initialRole={one(sp.role)?.toLowerCase() === "engineer" ? "ENGINEER" : "CLIENT"}
      callbackUrl={safeCallbackPath(one(sp.callbackUrl))}
      initialError={one(sp.error) ?? null}
    />
  );
}
