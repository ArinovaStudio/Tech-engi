import type { Metadata } from "next";
import EngineerRegisterClient from "./EngineerRegisterClient";

export const metadata: Metadata = {
  title: "Register as Engineer",
  robots: {
    index: false,
    follow: true,
  },
};

export default function EngineerRegisterPage() {
  return <EngineerRegisterClient />;
}