import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import {
  Geist_Mono,
  Inter,
  Space_Grotesk,
  DM_Serif_Display,
} from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import Providers from "@/components/Providers";
import SocketAnnouncer from "@/components/SocketAnnouncer";
import FacebookPixel from "@/components/FacebookPixel";
import { getUser } from "@/lib/auth";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const idGrotesk = localFont({
  src: [{ path: "../public/font/IDGrotesk-Regular.ttf", weight: "400" }],
  variable: "--font-id",
});

const benzGrotesk = localFont({
  src: [{ path: "../public/font/Benz-Grotesk.ttf", weight: "400" }],
  variable: "--font-benz",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-spacegrotesk",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dmserif",
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techengi.tsquarey.tech"),
  title: {
    default: "Tech Engi | Engineering Solutions & Expert Support",
    template: "%s | Tech Engi",
  },
  description:
    "Tech Engi connects students, startups, and companies with engineering experts for embedded systems, IoT, PCB design, robotics, AI, and prototyping projects.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    url: "https://techengi.tsquarey.tech",
    siteName: "Tech Engi",
    title: "Tech Engi | Engineering Solutions & Expert Support",
    description:
      "Tech Engi connects students, startups, and companies with engineering experts for embedded systems, IoT, PCB design, robotics, AI, and prototyping projects.",
    images: [
      {
        url: "/logo-transparent.png",
        width: 1200,
        height: 630,
        alt: "Tech Engi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Engi | Engineering Solutions & Expert Support",
    description:
      "Tech Engi connects students, startups, and companies with engineering experts for embedded systems, IoT, PCB design, robotics, AI, and prototyping projects.",
    images: ["/logo-transparent.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://techengi.tsquarey.tech/#organization",
      name: "Tech Engi",
      url: "https://techengi.tsquarey.tech",
      logo: "https://techengi.tsquarey.tech/logo-transparent.png",
      sameAs: [
        "https://www.linkedin.com/company/tsquarey1",
        "https://www.instagram.com/tsy1_tech.engi",
        "https://youtu.be/7jniNW5R2R0",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://techengi.tsquarey.tech/#website",
      url: "https://techengi.tsquarey.tech",
      name: "Tech Engi",
      publisher: {
        "@id": "https://techengi.tsquarey.tech/#organization",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getUser();

  <Toaster
    position="top-center"
    toastOptions={{
      duration: 4000,
    }}
  />

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var theme = savedTheme || systemTheme;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`min-h-full flex flex-col ${spaceGrotesk.variable} ${geistMono.variable} ${idGrotesk.variable} ${benzGrotesk.variable} ${inter.variable} ${dmSerif.variable}`}
      >
        {/* Facebook Meta Pixel — skips auth/admin/dashboard routes, see components/FacebookPixel.tsx */}
        <FacebookPixel />

        <SocketAnnouncer userId={user?.id} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}