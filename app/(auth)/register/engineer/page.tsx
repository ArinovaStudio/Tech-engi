import type { Metadata } from "next";
import RegisterClient from "../RegisterClient";

export const metadata: Metadata = {
  title: "Register as Engineer · Tech Engi",
  description: "Join Tech Engi as a verified engineer. Get AI-matched to clients in India based on what you have built — no bidding, no proposal flooding.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function EngineerRegisterPage() {
  return <RegisterClient defaultRole="ENGINEER" />;
}
