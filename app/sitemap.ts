import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DiscoveredBlogPost {
  slug: string;
  lastModified: Date;
}

/**
 * Automatically scans the app/(main)/blog directory for any file-based blog posts.
 * Newly added blog folders are automatically included in the sitemap without
 * requiring any manual list updates.
 */
function getFileSystemBlogPosts(): DiscoveredBlogPost[] {
  try {
    const blogDir = path.join(process.cwd(), "app/(main)/blog");
    if (!fs.existsSync(blogDir)) return [];

    const entries = fs.readdirSync(blogDir, { withFileTypes: true });
    const posts: DiscoveredBlogPost[] = [];

    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith("[") &&
        !entry.name.startsWith(".")
      ) {
        const pagePath = path.join(blogDir, entry.name, "page.tsx");
        if (fs.existsSync(pagePath)) {
          let postDate = new Date();
          try {
            const content = fs.readFileSync(pagePath, "utf-8");
            const match = content.match(
              /const\s+(?:PUBLISHED|MODIFIED)\s*=\s*["']([^"']+)["']/
            );
            if (match && match[1]) {
              postDate = new Date(match[1]);
            } else {
              const stat = fs.statSync(pagePath);
              postDate = stat.mtime;
            }
          } catch {
            // fallback to current date
          }

          posts.push({
            slug: entry.name,
            lastModified:
              postDate.getTime() > Date.now() ? new Date() : postDate,
          });
        }
      }
    }
    return posts;
  } catch (err) {
    console.warn("[Sitemap] Could not scan filesystem blog posts:", err);
    return [];
  }
}

/**
 * Automatically queries Sanity CMS for all published posts in real-time.
 * Every new article published in Sanity Studio is immediately included in sitemap.xml.
 */
async function getSanityBlogPosts(): Promise<DiscoveredBlogPost[]> {
  if (!isSanityConfigured()) return [];

  try {
    const query = groq`*[_type == "post" && defined(slug.current)] {
      "slug": slug.current,
      publishedAt,
      updatedAt
    }`;

    const sanityPosts = await client.fetch<
      { slug: string; publishedAt?: string; updatedAt?: string }[]
    >(query, {}, { next: { revalidate: 0 } });

    return (sanityPosts || [])
      .map((sp) => {
        const clean = (sp.slug || "")
          .toLowerCase()
          .trim()
          .replace(/^\/?(blog\/)?/i, "")
          .replace(/\/+$/, "");

        const rawDate = sp.updatedAt
          ? new Date(sp.updatedAt)
          : sp.publishedAt
          ? new Date(sp.publishedAt)
          : new Date();

        const safeDate = rawDate.getTime() > Date.now() ? new Date() : rawDate;

        return {
          slug: clean,
          lastModified: safeDate,
        };
      })
      .filter((p) => Boolean(p.slug));
  } catch (err) {
    console.warn("[Sitemap] Failed to fetch dynamic posts from Sanity:", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://techengi.in";

  // Base platform routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date("2026-10-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 1. Fetch dynamic Sanity CMS blog posts (live from CMS)
  const sanityPosts = await getSanityBlogPosts();

  // 2. Automatically discover filesystem-based blog posts
  const filePosts = getFileSystemBlogPosts();

  // 3. Merge and deduplicate by slug (Sanity CMS posts take precedence for modified dates)
  const blogMap = new Map<string, Date>();

  for (const post of filePosts) {
    blogMap.set(post.slug, post.lastModified);
  }

  for (const post of sanityPosts) {
    blogMap.set(post.slug, post.lastModified);
  }

  const blogRoutes: MetadataRoute.Sitemap = Array.from(blogMap.entries()).map(
    ([slug, lastModified]) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  return [...staticRoutes, ...blogRoutes];
}