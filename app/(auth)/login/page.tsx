import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Log in · Tech Engi",
  description:
    "Log in to your Tech Engi account. AI-matched engineering work in India, escrow-backed and identity-verified.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
