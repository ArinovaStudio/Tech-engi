import type { Metadata } from "next";
import RegisterClient from "../RegisterClient";

export const metadata: Metadata = {
  title: "Register as Client · Tech Engi",
  description: "Create your Tech Engi client account. Hire verified Indian engineers for bug fixes, code takeovers, and milestone projects.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ClientRegisterPage() {
  return <RegisterClient defaultRole="CLIENT" />;
}
