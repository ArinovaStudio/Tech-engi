import type { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Create account · Tech Engi",
  description:
    "Create your Tech Engi account. AI-matched engineering work in India, escrow-backed and identity-verified.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
