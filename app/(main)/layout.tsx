import { Poppins, Geist_Mono } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${poppins.className} ${geistMono.variable}`}>
      {children}
    </div>
  );
}