import type { Metadata } from "next";
import RoleChooser from "./RoleChooser";
import { safeCallbackPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Create account · Tech Engi",
  description:
    "Create your Tech Engi account. AI-matched engineering work in India, escrow-backed and identity-verified.",
  robots: {
    index: false,
    follow: true,
  },
};

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function RegisterPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  return <RoleChooser callbackUrl={safeCallbackPath(one(sp.callbackUrl))} initialError={one(sp.error) ?? null} />;
}
