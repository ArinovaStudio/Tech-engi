import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { isSanityConfigured } from "@/sanity/env";
import { POST_QUERY, type SanityPost } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

function formatSlugToTitle(slug: string): string {
  if (!slug) return "Blog Article";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const configured = isSanityConfigured();

    // 1. If Sanity is configured, query Sanity live at runtime
    if (configured) {
      try {
        const post = await client.fetch<SanityPost | null>(
          POST_QUERY,
          { slug },
          { next: { revalidate: 0 } }
        );

        if (post) {
          return NextResponse.json({
            success: true,
            post,
            isConfigured: true,
            isDemo: false,
          });
        }


        // Check if there are any posts in the Sanity dataset at all
        const postCount = await client
          .fetch<number>('count(*[_type == "post"])')
          .catch(() => 0);

        // If dataset has 0 posts, generate starter preview connected to user's author
        if (postCount === 0) {
          const author = await client
            .fetch<{ name?: string; role?: string; slug?: string; bio?: string } | null>(
              '*[_type == "author"][0]{name, role, "slug": slug.current, bio}'
            )
            .catch(() => null);

          const demoTitle = formatSlugToTitle(slug);
          const starterPost: SanityPost = {
            _id: `starter-${slug}`,
            title: demoTitle,
            slug,
            description: `Dynamic preview for "${demoTitle}". Your Sanity CMS is connected to project "aachh2bz". When you publish your first blog post in Sanity Studio, it will appear here in real-time.`,
            publishedAt: new Date().toISOString(),
            readTime: "5 min read",
            tldr: "Sanity is connected and live! You created your author profile. To publish articles, open Sanity Studio at /studio, click 'Blog Post', write your content, and hit the green 'Publish' button.",
            author: {
              name: author?.name || "Tarun Patak",
              role: author?.role || "CEO, Founder",
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
                    text: `Your Sanity CMS is successfully connected to project "${client.config().projectId}"! This page is fetched live at runtime using a client-side useEffect() API call to /api/blog/${slug}.`,
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
                    text: "How to Publish Your First Article",
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
                    text: "1. Open http://localhost:3000/studio in your browser.\n2. In the left sidebar, click 'Blog Post' and then 'Create'.\n3. Enter the Title, set the Slug, choose your Author, and add content.\n4. Click the green 'Publish' button at the bottom right.\n5. Visit this exact URL again and your live published article will load immediately!",
                  },
                ],
              },
              {
                _key: "c1",
                _type: "callout",
                tone: "tip",
                title: "Live Runtime Updates",
                content: "Because this page uses client-side useEffect() fetching, any edits or new articles you publish in Sanity Studio will reflect instantly without waiting for a site rebuild.",
              },
              {
                _key: "h2",
                _type: "block",
                style: "h2",
                children: [
                  {
                    _key: "s4",
                    _type: "span",
                    text: "Supported Content Features",
                  },
                ],
              },
              {
                _key: "code1",
                _type: "codeSnippet",
                language: "typescript",
                filename: "sanity/schemaTypes/postType.ts",
                code: "// Features available in your Sanity editor:\n- Markdown & rich headings (H2, H3, H4)\n- Code blocks with syntax highlighting\n- Interactive callout alerts (Tip, Info, Warning, Danger)\n- Image upload with hotspot and captions\n- Table of contents automatically generated\n- Custom author and category tagging",
              },
            ],
          };

          return NextResponse.json({
            success: true,
            post: starterPost,
            isConfigured: true,
            isDemo: true,
            postCount: 0,
          });
        }
      } catch (err) {
        console.warn("[Sanity API] Error:", err);
      }
    }

    // 2. If Sanity is not configured
    if (!configured) {
      const demoTitle = formatSlugToTitle(slug);
      const demoPost: SanityPost = {
        _id: `preview-${slug}`,
        title: demoTitle,
        slug,
        description: `Dynamic preview for "${demoTitle}". Add your NEXT_PUBLIC_SANITY_PROJECT_ID in .env to connect live articles.`,
        publishedAt: new Date().toISOString(),
        readTime: "5 min read",
        tldr: "Sanity integration is active and fetching via useEffect() at runtime.",
        author: {
          name: "Tech Engi Editor",
          role: "Engineering Team",
        },
        categories: [{ title: "Engineering", slug: "engineering" }],
        body: [],
      };

      return NextResponse.json({
        success: true,
        post: demoPost,
        isConfigured: false,
        isDemo: true,
      });
    }

    // 3. Sanity is configured and has posts, but this specific slug was not found
    return NextResponse.json({
      success: false,
      post: null,
      isConfigured: true,
      isDemo: false,
      message: `No published article found for slug "${slug}".`,
    });
  } catch (error) {
    console.error("[API Blog Slug] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
