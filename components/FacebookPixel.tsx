"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

// Route prefixes that are noindex / private and don't need marketing pixel tracking:
// - (auth) group: /login, /register, /register/client, /register/engineer, /forgot-password, /form/*
// - (main) group: /admin, /client, /engineer (private dashboards)
const EXCLUDED_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/form",
  "/admin",
  "/client",
  "/engineer",
];

const FACEBOOK_PIXEL_ID = "888842877025528";

export default function FacebookPixel() {
  const pathname = usePathname();

  const isExcluded = EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isExcluded) {
    return null;
  }

  return (
    <>
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '${FACEBOOK_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}