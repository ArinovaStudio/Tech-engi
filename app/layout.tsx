import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import Providers from "@/components/Providers";
import SocketAnnouncer from "@/components/SocketAnnouncer";
import FacebookPixel from "@/components/FacebookPixel";

const GTM_ID = "GTM-5HV8B6QX";

const idGrotesk = localFont({
  src: [
    {
      path: "../public/font/IDGrotesk-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-id",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://techengi.in"),
  title: {
    default: "Tech Engi | India's First AI Match Freelance Platform",
    template: "%s | Tech Engi",
  },
  description:
    "Tech Engi connects founders, startups, and companies with verified Indian engineers for AI bug fixing, code takeovers, and ₹3,480 day-pass co-working.",
  alternates: {
    canonical: "https://techengi.in/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://techengi.in/",
    siteName: "Tech Engi",
    title: "Tech Engi | India's First AI Match Freelance Platform",
    description:
      "Tech Engi connects founders, startups, and companies with verified Indian engineers for AI bug fixing, code takeovers, and ₹3,480 day-pass co-working.",
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
    title: "Tech Engi | India's First AI Match Freelance Platform",
    description:
      "Tech Engi connects founders, startups, and companies with verified Indian engineers for AI bug fixing, code takeovers, and ₹3,480 day-pass co-working.",
    images: ["/logo-transparent.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://techengi.in/#organization",
      name: "Tech Engi",
      legalName: "TSquareY1 OPC Private Limited",
      url: "https://techengi.in",
      logo: {
        "@type": "ImageObject",
        url: "https://techengi.in/logo-transparent.png",
      },
      founder: {
        "@type": "Person",
        name: "Tarun Patak K",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@techengi.in",
        contactType: "customer service",
      },
      sameAs: [
        "https://www.linkedin.com/company/tsquarey1",
        "https://www.instagram.com/tsy1_tech.engi",
        "https://youtu.be/7jniNW5R2R0",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://techengi.in/#website",
      url: "https://techengi.in",
      name: "Tech Engi",
      description:
        "India's first AI-matched freelance platform for verified engineering work and bug resolution.",
      publisher: {
        "@id": "https://techengi.in/#organization",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* Google Tag Manager - Head */}
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />


{/* Google Analytics 4 */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-2SHZGJCHRR"
  strategy="afterInteractive"
/>
<Script
  id="google-analytics"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', 'G-2SHZGJCHRR');
    `,
  }}
/>

        {/* Existing theme initialization */}
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
            `,
          }}
        />

        {/* Existing JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body
        className={`min-h-full flex flex-col ${idGrotesk.variable} ${inter.variable}`}
      >
        {/* Google Tag Manager - Body (noscript fallback) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
            title="Google Tag Manager"
          />
        </noscript>

        {/* Facebook Meta Pixel — skips auth/admin/dashboard routes */}
        <FacebookPixel />

        <Providers>
          <SocketAnnouncer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
