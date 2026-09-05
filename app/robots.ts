import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/client",
          "/client/",
          "/engineer",
          "/engineer/",
          "/api/",
        ],
      },
    ],
    sitemap: "https://techengi.tsquarey.tech/sitemap.xml",
  };
}