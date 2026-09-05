import type { Metadata } from "next";
import ClientRegisterClient from "./ClientRegisterClient";

export const metadata: Metadata = {
  title: "Register as Client",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ClientRegisterPage() {
  return <ClientRegisterClient />;
}