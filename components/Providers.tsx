"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./ThemeProvider";
import ReferralCapture from "./common/ReferralCapture";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Toaster 
          position="top-right" 
          reverseOrder={false}
        />
        <ReferralCapture />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}