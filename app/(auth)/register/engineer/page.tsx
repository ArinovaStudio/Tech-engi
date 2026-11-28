import type { Metadata } from "next";
import RegisterClient from "../RegisterClient";
import { safeCallbackPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Register as Engineer · Tech Engi",
  description: "Join Tech Engi as a verified engineer. Get AI-matched to clients in India based on what you have built — no bidding, no proposal flooding.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function EngineerRegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const cb = Array.isArray(sp.callbackUrl) ? sp.callbackUrl[0] : sp.callbackUrl;
  return <RegisterClient defaultRole="ENGINEER" callbackUrl={safeCallbackPath(cb)} />;
}
