import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { POST_QUERY, POSTS_QUERY, type SanityPost } from "@/sanity/lib/queries";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";

function formatSlugToTitle(slug: string): string {
  if (!slug) return "Blog Article";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function cleanSlug(raw: string): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw)
      .toLowerCase()
      .trim()
      .replace(/^\/?(blog\/)?/i, "")
      .replace(/\/+$/, "")
      .replace(/\s+/g, "-");
  } catch {
    return raw
      .toLowerCase()
      .trim()
      .replace(/^\/?(blog\/)?/i, "")
      .replace(/\/+$/, "")
      .replace(/\s+/g, "-");
  }
}

const STATIC_POSTS_MAP: Record<
  string,
  { title: string; description: string; readTime: string; category: string }
> = {
  "cost-to-hire-developer-fix-bug-india": {
    title: "How Much Does It Cost to Hire a Developer or Fix a Bug in India? (2026)",
    description:
      "Freelance developer rates in India by experience, what a full-time engineer costs per day, platform fees, what drives bug-fix cost, and Tech Engi's ₹3,480 co-worker day.",
    readTime: "7 min read",
    category: "Hiring & Costs",
  },
  "how-to-fix-code-without-ai": {
    title: "How to Fix Your Code Without AI: A Human Debugging Method That Actually Works",
    description:
      "No ChatGPT, no Copilot. A 9-step human debugging method, the right tools for Python, JavaScript, React, Node, SQL and embedded, and when to call a human expert.",
    readTime: "8 min read",
    category: "Bug Fixing",
  },
  "hire-coworker-for-a-day-3480": {
    title: "₹3,480 for a Co-Worker Who Clears Your Task List: Hire a Verified Engineer for a Day",
    description:
      "Overloaded, behind on a sprint, or no tech team? Book a verified Tech Engi engineer as your co-worker for a full day at ₹3,480. What you get, the maths, and how it works.",
    readTime: "6 min read",
    category: "Hiring & Costs",
  },
  "who-can-fix-my-code-how-soon": {
    title: "My Code Is Not Working: How to Fix It, Who Can Fix It, and How Soon",
    description:
      "Code broken and deadline close? What to try first, whether ChatGPT can fix it, who to ask, how fast a bug can be fixed, and how to share code safely.",
    readTime: "9 min read",
    category: "Bug Fixing",
  },
  "common-coding-bugs-why-hard-to-fix": {
    title: "The 14 Bugs That Break Code Every Day (And Why Even Senior Engineers Get Stuck)",
    description:
      "From undefined errors to race conditions and legacy code: the bugs that stall students and senior engineers alike, and when to call a human expert.",
    readTime: "8 min read",
    category: "Bug Fixing",
  },
  "indian-it-burnout-overtime-bugs-ai-layoffs-2026": {
    title: "Indian IT Is Breaking Its Own People — Then Blaming AI For the Layoffs",
    description:
      "Unpaid overtime, understaffed teams, bugs that cost companies millions, and layoffs blamed on AI that was never the real reason. Here's what's actually happening inside Indian IT in 2026.",
    readTime: "7 min read",
    category: "IT & Career",
  },
  "how-to-avoid-scammer-freelancers": {
    title: "How to Avoid Scammer or Cheating Freelancers (Before They Cost You)",
    description:
      "Freelance scams follow a predictable shape. Learn the red flags, the common scam patterns, and the protections that keep your money safe before you ever pay.",
    readTime: "5 min read",
    category: "Freelance Safety",
  },
  "freelance-engineering-without-issues": {
    title: "How Tech Engi Helps Freelance Engineers Finish Work Without the Usual Chaos",
    description:
      "Ghosted clients, scope creep and late payments aren't a coding problem. They're a structure problem, and structure is fixable.",
    readTime: "5 min read",
    category: "Freelance Safety",
  },
};

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const rawParam = (await props.params)?.slug || "";
    const slug = cleanSlug(rawParam);

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const configured = isSanityConfigured();
    let post: SanityPost | null = null;

    // 1. If Sanity is configured, query Sanity with flexible matching
    if (configured) {
      try {
        // Fast direct query with multiple slug variations
        post = await client.fetch<SanityPost | null>(
          POST_QUERY,
          { slug },
          { next: { revalidate: 0 } }
        );

        // Fallback: If not matched directly, search all posts with normalized slugs
        if (!post) {
          const allPosts = await client.fetch<SanityPost[]>(
            POSTS_QUERY,
            {},
            { next: { revalidate: 0 } }
          );

          const found = allPosts.find((p) => {
            const pSlug = cleanSlug(p.slug || "");
            return (
              pSlug === slug ||
              pSlug.replace(/-/g, "") === slug.replace(/-/g, "") ||
              pSlug.includes(slug) ||
              slug.includes(pSlug)
            );
          });

          if (found) {
            post = await client.fetch<SanityPost | null>(
              groq`*[_type == "post" && _id == $id][0] {
                _id,
                title,
                "slug": slug.current,
                description,
                metaTitle,
                canonical,
                publishedAt,
                updatedAt,
                primaryKeyword,
                secondaryKeywords,
                readTime,
                tldr,
                mainImage {
                  asset->{
                    _id,
                    url
                  },
                  alt
                },
                body,
                author->{
                  name,
                  role,
                  bio,
                  image
                },
                categories[]->{
                  title,
                  "slug": slug.current
                }
              }`,
              { id: found._id },
              { next: { revalidate: 0 } }
            );
          }
        }

        if (post) {
          let publishedAt = post.publishedAt;
          if (publishedAt && new Date(publishedAt).getTime() > Date.now()) {
            publishedAt = "2026-10-23T00:00:00.000Z";
          }
          return NextResponse.json({
            success: true,
            post: {
              ...post,
              publishedAt,
              slug: cleanSlug(post.slug || slug),
            },
            isConfigured: true,
            isDemo: false,
          });
        }
      } catch (err) {
        console.warn("[Sanity API Blog Route] Error:", err);
      }
    }

    // 2. Check if slug matches any static article in the codebase
    const staticInfo = STATIC_POSTS_MAP[slug];
    if (staticInfo) {
      const staticPost: SanityPost = {
        _id: `static-${slug}`,
        title: staticInfo.title,
        slug,
        description: staticInfo.description,
        publishedAt: new Date().toISOString(),
        readTime: staticInfo.readTime,
        tldr: staticInfo.description,
        author: {
          name: "Tech Engi Team",
          role: "Engineering Editorial",
          bio: "Engineering team at Tech Engi. Providing verified engineering matches, transparent milestone escrow, and AI bug resolution in India.",
        },
        categories: [{ title: staticInfo.category, slug: cleanSlug(staticInfo.category) }],
        body: [
          {
            _key: "b1",
            _type: "block",
            style: "normal",
            children: [
              {
                _key: "s1",
                _type: "span",
                text: staticInfo.description,
              },
            ],
          },
        ],
      };

      return NextResponse.json({
        success: true,
        post: staticPost,
        isConfigured: configured,
        isDemo: false,
      });
    }

    // 3. Fallback: Fetch author if available, and provide an informative topic guide
    // This ensures that visitors and authors NEVER encounter a 404 error
    const author = configured
      ? await client
          .fetch<{ name?: string; role?: string; bio?: string } | null>(
            '*[_type == "author"][0]{name, role, bio}'
          )
          .catch(() => null)
      : null;

    const demoTitle = formatSlugToTitle(slug);
    const fallbackPost: SanityPost = {
      _id: `article-${slug}`,
      title: demoTitle,
      slug,
      description: `In-depth guide and engineering insights on "${demoTitle}". Read advice, real-world case studies, and solutions from verified Tech Engi engineers.`,
      publishedAt: new Date().toISOString(),
      readTime: "5 min read",
      tldr: `Looking for assistance or deep technical guidance on "${demoTitle}"? Tech Engi connects founders and development teams with verified engineers in India for fast bug fixes, milestone development, and day-pass co-working.`,
      author: {
        name: author?.name || "Tarun Patak",
        role: author?.role || "Founder, Tech Engi",
        bio:
          author?.bio ||
          "Founder at Tech Engi. Leading verified engineering matches, transparent freelance infrastructure, and AI bug resolution in India.",
      },
      categories: [{ title: "Engineering", slug: "engineering" }],
      body: [
        {
          _key: "b1",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "s1",
              _type: "span",
              text: `Welcome to Tech Engi's knowledge hub. You are exploring the guide for "${demoTitle}". Our team frequently publishes guides on modern development, freelance safety, and verified engineering execution.`,
            },
          ],
        },
        {
          _key: "h1",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "s2",
              _type: "span",
              text: "Need Immediate Technical Assistance?",
            },
          ],
        },
        {
          _key: "b2",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "s3",
              _type: "span",
              text: "Whether you need to debug complex production issues, clear backlog tickets, or hire a verified engineer for a day (₹3,480), Tech Engi matches you with verified talent within hours.",
            },
          ],
        },
        {
          _key: "c1",
          _type: "callout",
          tone: "info",
          title: "CMS Notice",
          content:
            "If you are the author, you can create or edit this article anytime in Sanity Studio (/studio). Any published updates reflect immediately at this exact URL.",
        },
      ],
    };

    return NextResponse.json({
      success: true,
      post: fallbackPost,
      isConfigured: configured,
      isDemo: true,
    });
  } catch (error) {
    console.error("[API Blog Slug] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
