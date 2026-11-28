import type { Metadata } from "next";
import RegisterClient from "../RegisterClient";
import { safeCallbackPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Register as Client · Tech Engi",
  description: "Create your Tech Engi client account. Hire verified Indian engineers for bug fixes, code takeovers, and milestone projects.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ClientRegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const cb = Array.isArray(sp.callbackUrl) ? sp.callbackUrl[0] : sp.callbackUrl;
  return <RegisterClient defaultRole="CLIENT" callbackUrl={safeCallbackPath(cb)} />;
}
