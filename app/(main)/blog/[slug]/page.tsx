"use client";

import { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Calendar,
  User,
  Sparkles,
  Info,
  AlertCircle,
  ListCollapse,
  ChevronDown,
  Hash,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import Header from "@/components/saas/Header";
import Footer from "@/components/saas/Footer";
import CtaSection from "@/components/saas/CtaSection";
import { figtree } from "@/components/saas/fonts";

import type { SanityPost } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { PortableTextRenderer } from "@/components/sanity/PortableTextRenderer";

interface BlockItem {
  _type?: string;
  style?: string;
  title?: string;
  children?: { text?: string; marks?: string[] }[];
  [key: string]: unknown;
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(body: unknown[] = []): HeadingItem[] {
  const headings: HeadingItem[] = [];

  for (const rawBlock of body) {
    if (!rawBlock || typeof rawBlock !== "object") continue;
    const block = rawBlock as BlockItem;

    // 1. Regular headings (h2, h3, h4)
    if (
      block._type === "block" &&
      (block.style === "h2" || block.style === "h3" || block.style === "h4")
    ) {
      const text = block.children?.map((c) => c.text || "").join("") || "";
      if (text.trim()) {
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        headings.push({
          id,
          text: text.trim(),
          level: block.style === "h2" ? 2 : block.style === "h3" ? 3 : 4,
        });
      }
    }

    // 2. FAQ Block
    else if (block._type === "faqBlock") {
      const title = (block.title as string) || "Frequently Asked Questions";
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || "faq";
      headings.push({
        id,
        text: title,
        level: 2,
      });
    }
  }

  // 3. Fallback: if no H2/H3/H4 were specified in editor, detect standalone bold title blocks
  if (headings.length === 0) {
    for (const rawBlock of body) {
      if (!rawBlock || typeof rawBlock !== "object") continue;
      const block = rawBlock as BlockItem;
      if (block._type === "block" && block.style === "normal") {
        const children = block.children || [];
        const isAllBold =
          children.length > 0 &&
          children.every(
            (c) => Array.isArray(c.marks) && c.marks.includes("strong")
          );
        const text = children.map((c) => c.text || "").join("").trim();
        if (isAllBold && text.length > 2 && text.length < 90 && !text.endsWith(".")) {
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
          headings.push({
            id,
            text,
            level: 2,
          });
        }
      }
    }
  }

  return headings;
}

export default function DynamicBlogSlugPage(props: {
  params?: Promise<{ slug: string }> | { slug: string };
  explicitSlug?: string;
}) {
  const routerParams = useParams();

  let unwrappedSlug = "";
  if (props?.params) {
    if (typeof (props.params as Promise<unknown>)?.then === "function") {
      try {
        const unwrapped = use(props.params as Promise<{ slug: string }>);
        unwrappedSlug = unwrapped?.slug || "";
      } catch {
        // Fallback to useParams
      }
    } else if ((props.params as { slug?: string })?.slug) {
      unwrappedSlug = (props.params as { slug: string }).slug;
    }
  }

  if (!unwrappedSlug && routerParams?.slug) {
    const s = routerParams.slug;
    unwrappedSlug = Array.isArray(s) ? s.join("/") : s;
  }

  const rawSlug = props?.explicitSlug || unwrappedSlug || "";
  const slug = useMemo(() => {
    if (!rawSlug) return "";
    try {
      return decodeURIComponent(rawSlug)
        .toLowerCase()
        .trim()
        .replace(/^\/?(blog\/)?/i, "")
        .replace(/\/+$/, "")
        .replace(/\s+/g, "-");
    } catch {
      return rawSlug
        .toLowerCase()
        .trim()
        .replace(/^\/?(blog\/)?/i, "")
        .replace(/\/+$/, "")
        .replace(/\s+/g, "-");
    }
  }, [rawSlug]);

  const [post, setPost] = useState<SanityPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  // Runtime API fetch via useEffect on every mount & slug change
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadPost() {
      try {
        const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`, {
          cache: "no-store", // Guarantees fresh data at runtime, not build-time
        });
        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.post) {
          setPost(data.post);
          setIsDemo(Boolean(data.isDemo));
        } else {
          // Graceful fallback to avoid 404
          const formattedTitle = slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

          setPost({
            _id: `fallback-${slug}`,
            title: formattedTitle,
            slug,
            description: `Guide and engineering insights on ${formattedTitle}. Tech Engi connects founders with verified engineers for rapid bug fixes and transparent milestone development.`,
            publishedAt: new Date().toISOString(),
            readTime: "5 min read",
            categories: [{ title: "Engineering", slug: "engineering" }],
            body: [],
          });
          setIsDemo(true);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch blog post:", err);
        const formattedTitle = slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        setPost({
          _id: `fallback-${slug}`,
          title: formattedTitle,
          slug,
          description: `Guide and engineering insights on ${formattedTitle}. Tech Engi connects founders with verified engineers for rapid bug fixes and transparent milestone development.`,
          publishedAt: new Date().toISOString(),
          readTime: "5 min read",
          categories: [{ title: "Engineering", slug: "engineering" }],
          body: [],
        });
        setIsDemo(true);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Set page title and meta description dynamically
  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || `${post.title} | Tech Engi`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc && post.description) {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        document.head.appendChild(metaDesc);
      }
      if (metaDesc && post.description) {
        metaDesc.setAttribute("content", post.description);
      }
    }
  }, [post]);

  const headings = useMemo(() => {
    return post?.body ? extractHeadings(post.body) : [];
  }, [post]);

  const [activeId, setActiveId] = useState<string>("");
  const [readProgress, setReadProgress] = useState<number>(0);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
        setReadProgress(Math.round(progress));
      }

      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      const scrollPos = window.scrollY + 180;

      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (el.offsetTop <= scrollPos) {
          setActiveId(el.id);
          return;
        }
      }

      if (elements.length > 0) {
        setActiveId(elements[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  const formattedDate = useMemo(() => {
    if (!post?.publishedAt) return "";
    return new Date(post.publishedAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [post?.publishedAt]);

  const mainImageUrl = useMemo(() => {
    if (!post?.mainImage) return null;
    return urlForImage(post.mainImage)?.width(1600).height(900).fit("crop").url();
  }, [post?.mainImage]);

  const authorImageUrl = useMemo(() => {
    if (!post?.author?.image) return null;
    return urlForImage(post.author.image)?.width(120).height(120).fit("crop").url();
  }, [post?.author?.image]);

  const postJsonLd = useMemo(() => {
    if (!post) return null;
    const postUrl = `https://techengi.in/blog/${slug}`;
    const pubDate =
      post.publishedAt && new Date(post.publishedAt).getTime() > Date.now()
        ? "2026-10-23T00:00:00.000Z"
        : post.publishedAt || new Date().toISOString();
    const modDate =
      post.updatedAt && new Date(post.updatedAt).getTime() > Date.now()
        ? pubDate
        : post.updatedAt || pubDate;

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `${postUrl}#article`,
          isPartOf: {
            "@type": "WebSite",
            "@id": "https://techengi.in/#website",
            name: "Tech Engi",
            url: "https://techengi.in",
          },
          headline: post.title,
          description: post.description,
          url: postUrl,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": postUrl,
          },
          datePublished: pubDate,
          dateModified: modDate,
          author: {
            "@type": "Person",
            name: post.author?.name || "Tarun Patak K",
            jobTitle: post.author?.role || "Founder, Tech Engi",
          },
          publisher: {
            "@type": "Organization",
            "@id": "https://techengi.in/#organization",
            name: "Tech Engi",
            url: "https://techengi.in",
            logo: {
              "@type": "ImageObject",
              url: "https://techengi.in/logo-transparent.png",
            },
          },
          image: mainImageUrl
            ? [mainImageUrl]
            : ["https://techengi.in/logo-transparent.png"],
          inLanguage: "en-IN",
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${postUrl}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://techengi.in/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Blog",
              item: "https://techengi.in/blog",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: postUrl,
            },
          ],
        },
      ],
    };
  }, [post, slug, mainImageUrl]);

  return (
    <div className={`saas-root ${figtree.variable} min-h-screen bg-saas-bg w-full overflow-x-clip`}>
      {postJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(postJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      {/* Global SaaS Header */}
      <Header />

      <main className="w-full">
        {/* Banner for CMS Setup Mode when Sanity credentials are not yet entered */}

        {/* ============================ LOADING STATE ============================ */}
        {loading && (
          <section className="relative dot-grid pt-12 pb-24">
            <div className="section-glow" />
            <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
              {/* Breadcrumb Skeleton */}
              <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />

              <div className="mt-8 max-w-3xl space-y-4">
                <div className="h-6 w-28 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-10 w-full rounded-2xl bg-slate-200 animate-pulse" />
                <div className="h-10 w-3/4 rounded-2xl bg-slate-200 animate-pulse" />
                <div className="h-5 w-2/3 rounded-xl bg-slate-200/70 animate-pulse mt-4" />
                <div className="h-4 w-48 rounded bg-slate-200/50 animate-pulse pt-2" />
              </div>

              {/* Cover skeleton */}
              <div className="mt-12 aspect-[16/9] w-full rounded-saas-4xl bg-slate-200/70 animate-pulse shadow-sm" />

              {/* Body lines skeleton */}
              <div className="mt-12 max-w-3xl space-y-3">
                <div className="h-4 w-full rounded bg-slate-200/60 animate-pulse" />
                <div className="h-4 w-11/12 rounded bg-slate-200/60 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-slate-200/60 animate-pulse" />
              </div>
            </div>
          </section>
        )}

        {/* ============================ ERROR / NOT FOUND STATE ============================ */}
        {!loading && (!post || error) && (
          <section className="relative dot-grid pt-20 pb-28">
            <div className="section-glow" />
            <div className="relative mx-auto w-full max-w-[700px] px-4 text-center">
              <div className="surface rounded-saas-4xl p-10 sm:p-14 border border-saas-line bg-white/70 shadow-saas-panel backdrop-blur-xl">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600 shadow-sm">
                  <AlertCircle size={30} />
                </div>
                <h1 className="mt-6 text-2xl font-bold text-saas-ink sm:text-3xl">
                  Article Not Found
                </h1>
                <p className="mt-3 text-sm text-saas-tx leading-relaxed">
                  The article with slug <code className="rounded bg-saas-bg px-1.5 py-0.5 font-mono text-xs text-saas-ink font-semibold">&quot;{slug}&quot;</code> could not be found. It may have been renamed or moved.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/blog"
                    className="btn w-full sm:w-auto inline-flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Back to all articles
                  </Link>
                  <Link
                    href="/"
                    className="btn-outline w-full sm:w-auto"
                  >
                    Go to Homepage
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================ POST LOADED STATE ============================ */}
        {!loading && post && (
          <>
            {/* Hero Header */}
            <section className="relative dot-grid pt-12 pb-14 sm:pt-16 sm:pb-20">
              <div className="section-glow" />

              <div className="relative mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="text-xs text-saas-mut">
                  <ol className="flex items-center gap-2">
                    <li>
                      <Link href="/" className="transition-colors hover:text-saas-ink">
                        Home
                      </Link>
                    </li>
                    <li aria-hidden="true" className="text-saas-line">/</li>
                    <li>
                      <Link href="/blog" className="transition-colors hover:text-saas-ink">
                        Blog
                      </Link>
                    </li>
                    <li aria-hidden="true" className="text-saas-line">/</li>
                    <li aria-current="page" className="line-clamp-1 font-semibold text-saas-ink max-w-[280px] sm:max-w-md">
                      {post.title}
                    </li>
                  </ol>
                </nav>

                <div className="mt-7 flex flex-col items-start max-w-4xl">
                  {/* Category Pills */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((cat) => (
                        <span
                          key={cat.slug}
                          className="inline-flex items-center gap-1.5 rounded-full border border-saas-line bg-white/80 px-3.5 py-1 text-xs font-semibold text-saas-accent shadow-sm backdrop-blur-md"
                        >
                          <Sparkles size={11} />
                          {cat.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h1 className="mt-5 text-balance text-[clamp(2.1rem,4.5vw,3.4rem)] font-bold tracking-tight text-saas-ink leading-[1.12]">
                    {post.title}
                  </h1>

                  {/* Excerpt */}
                  {post.description && (
                    <p className="mt-5 text-base sm:text-lg leading-relaxed text-saas-tx max-w-3xl">
                      {post.description}
                    </p>
                  )}

                  {/* Meta bar: Author, Date, Read time */}
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-saas-line/80 pt-6 text-xs text-saas-tx">
                    <div className="flex items-center gap-3">
                      {authorImageUrl ? (
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-saas-line shadow-sm">
                          <Image
                            src={authorImageUrl}
                            alt={post.author?.name || "Author"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-saas-icon-bg text-saas-accent">
                          <User size={16} />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-saas-ink">
                          {post.author?.name || "Tech Engi Editor"}
                        </p>
                        {post.author?.role && (
                          <p className="text-[11px] text-saas-mut">{post.author.role}</p>
                        )}
                      </div>
                    </div>

                    {formattedDate && (
                      <span className="inline-flex items-center gap-1.5 text-saas-tx">
                        <Calendar size={13} className="text-saas-accent" />
                        <time dateTime={post.publishedAt}>{formattedDate}</time>
                      </span>
                    )}

                    {post.updatedAt && (
                      <span className="text-[11px] text-saas-mut">
                        (Updated: {new Date(post.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })})
                      </span>
                    )}

                    {post.readTime && (
                      <span className="inline-flex items-center gap-1.5 text-saas-tx">
                        <Clock3 size={13} className="text-saas-accent" />
                        {post.readTime}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Content & Sticky TOC */}
            <section className="pt-2 pb-24">
              <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
                {/* Cover Image */}
                {mainImageUrl && (
                  <figure className="relative mb-14 aspect-[16/9] w-full overflow-hidden rounded-saas-4xl border border-saas-line/80 shadow-saas-panel">
                    <Image
                      src={mainImageUrl}
                      alt={post.mainImage?.alt || post.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw, 1150px"
                    />
                  </figure>
                )}

                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_270px] lg:gap-16 items-start">
                  <article className="min-w-0">
                    {/* Mobile Quick-Navigation Topics Bar */}
                    {headings.length > 0 && (
                      <details className="group mb-8 rounded-2xl border border-saas-line bg-white/95 p-4 shadow-saas-card lg:hidden backdrop-blur-md">
                        <summary className="flex cursor-pointer items-center justify-between font-semibold text-saas-ink text-sm select-none list-none [&::-webkit-details-marker]:hidden">
                          <span className="flex items-center gap-2">
                            <ListCollapse size={16} className="text-saas-accent" />
                            <span>In this article ({headings.length} topics)</span>
                          </span>
                          <span className="text-xs font-semibold text-saas-accent flex items-center gap-1">
                            <span>Jump to</span>
                            <ChevronDown size={14} className="group-open:rotate-180 transition-transform duration-200" />
                          </span>
                        </summary>
                        <nav className="mt-4 border-t border-saas-line/70 pt-3 max-h-72 overflow-y-auto">
                          <ul className="space-y-1.5 text-xs">
                            {headings.map((h) => (
                              <li
                                key={h.id}
                                className={h.level === 3 ? "pl-3.5" : h.level === 4 ? "pl-6" : "font-medium"}
                              >
                                <a
                                  href={`#${h.id}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    scrollToHeading(h.id);
                                  }}
                                  className={`block py-1 rounded-lg px-2 transition-colors ${activeId === h.id
                                    ? "bg-saas-icon-bg font-bold text-saas-accent"
                                    : "text-saas-tx hover:text-saas-ink hover:bg-slate-50"
                                    }`}
                                >
                                  {h.text}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </details>
                    )}

                    {/* Optional TL;DR Block */}
                    {post.tldr && (
                      <aside className="surface mb-12 rounded-3xl p-7 sm:p-8">
                        <div className="flex items-center gap-2 text-saas-ink font-bold text-[17px]">
                          <Sparkles size={18} className="text-saas-accent" />
                          <h3>Key Takeaways</h3>
                        </div>
                        <p className="mt-3.5 text-[15px] leading-relaxed text-saas-tx whitespace-pre-line">
                          {post.tldr}
                        </p>
                      </aside>
                    )}

                    {/* PortableText Body */}
                    <div className="blog-content">
                      <PortableTextRenderer value={post.body} />
                    </div>

                    {/* Keywords / Tags */}
                    {post.secondaryKeywords && post.secondaryKeywords.length > 0 && (
                      <div className="mt-12 border-t border-saas-line/80 pt-6">
                        <p className="text-xs font-bold uppercase tracking-wider text-saas-mut mb-3">
                          Related Keywords & Topics
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {post.secondaryKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-saas-tx border border-saas-line shadow-2xs"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Author Footer Card */}
                    {post.author && (
                      <div className="surface mt-16 flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-saas-line bg-white/80 p-7 sm:p-8 shadow-sm backdrop-blur-md">
                        {authorImageUrl ? (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-saas-line shadow-sm">
                            <Image
                              src={authorImageUrl}
                              alt={post.author.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-saas-icon-bg text-saas-accent">
                            <User size={26} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 text-center sm:text-left">
                          <h4 className="text-lg font-bold text-saas-ink">
                            Written by {post.author.name}
                          </h4>
                          {post.author.role && (
                            <p className="text-xs font-semibold text-saas-accent">
                              {post.author.role}
                            </p>
                          )}
                          {post.author.bio && (
                            <p className="mt-2 text-sm leading-relaxed text-saas-tx">
                              {post.author.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Back to Blog & Action links */}
                    <div className="mt-12 flex flex-wrap items-center gap-4">
                      <Link
                        href="/blog"
                        className="btn-outline btn-sm inline-flex items-center gap-2"
                      >
                        <ArrowLeft size={15} />
                        Back to all articles
                      </Link>
                      <Link
                        href="/blog/hire-coworker-for-a-day-3480"
                        className="btn btn-sm inline-flex items-center gap-2 shadow-sm"
                      >
                        Hire Engineer for a Day (₹3,480)
                      </Link>
                    </div>
                  </article>

                  {/* Sticky Auto-Generated Sidebar for Sanity Topics */}
                  <aside className="hidden lg:block sticky top-28 space-y-6">
                    {/* Topics Card */}
                    {headings.length > 0 ? (
                      <div className="surface rounded-3xl border border-saas-line bg-white/90 p-5 shadow-saas-card backdrop-blur-md">
                        {/* Reading Progress Indicator */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-saas-mut">
                            <span className="flex items-center gap-1.5">
                              <ListCollapse size={14} className="text-saas-accent" />
                              <span className="uppercase tracking-wider">Topics On This Page</span>
                            </span>
                            <span className="rounded-full bg-saas-icon-bg px-2 py-0.5 text-[10px] font-bold text-saas-accent">
                              {readProgress}% read
                            </span>
                          </div>
                          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full bg-gradient-to-r from-saas-accent to-blue-500 transition-all duration-150"
                              style={{ width: `${readProgress}%` }}
                            />
                          </div>
                        </div>

                        {/* Topics List with Live Active ScrollSpy */}
                        <nav
                          aria-label="Table of contents"
                          className="max-h-[min(480px,56vh)] overflow-y-auto"
                          style={{
                            scrollbarWidth: 'none'
                          }}
                        >
                          {headings.map((h) => {
                            const isActive = activeId === h.id;
                            return (
                              <a
                                key={h.id}
                                href={`#${h.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  scrollToHeading(h.id);
                                }}
                                className={`group flex items-start gap-2 rounded-xl py-1.5 px-2.5 text-xs transition-all ${isActive
                                  ? "bg-saas-icon-bg/90 font-bold text-saas-accent shadow-2xs"
                                  : "text-saas-tx hover:bg-slate-50 hover:text-saas-ink"
                                  } ${h.level === 3 ? "pl-5 text-[11.5px]" : h.level === 4 ? "pl-8 text-[11px]" : "font-medium"}`}
                              >
                                {isActive && (
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-saas-accent animate-pulse" />
                                )}
                                <span className="line-clamp-2 leading-relaxed">
                                  {h.text}
                                </span>
                              </a>
                            );
                          })}
                        </nav>
                      </div>
                    ) : (
                      <div className="surface rounded-3xl border border-saas-line bg-white/80 p-5 shadow-sm backdrop-blur-md">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saas-mut">
                          <BookOpen size={14} className="text-saas-accent" />
                          <span>Sanity Article Guide</span>
                        </div>
                        <p className="mt-2 text-xs text-saas-tx leading-relaxed">
                          This article is verified and published by the Tech Engi editorial team.
                        </p>
                      </div>
                    )}

                    {/* Sanity Categories & Topic Badges Card */}
                    {((post.categories && post.categories.length > 0) ||
                      (post.secondaryKeywords && post.secondaryKeywords.length > 0)) && (
                        <div className="surface rounded-3xl border border-saas-line bg-white/85 p-5 shadow-sm backdrop-blur-md">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saas-mut mb-3">
                            <Hash size={13} className="text-saas-accent" />
                            <span>Sanity Topics & Tags</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {post.categories?.map((cat) => (
                              <Link
                                key={cat.slug}
                                href="/blog"
                                className="rounded-full bg-saas-icon-bg px-2.5 py-1 text-[11px] font-semibold text-saas-accent hover:bg-saas-accent hover:text-white transition-colors"
                              >
                                {cat.title}
                              </Link>
                            ))}
                            {post.secondaryKeywords?.map((kw, i) => (
                              <span
                                key={i}
                                className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[10.5px] font-medium text-saas-tx border border-saas-line"
                              >
                                #{kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Quick Engineer Action Card */}
                    <div className="surface rounded-3xl border border-saas-line bg-gradient-to-br from-saas-nav to-[#1a2548] p-5 text-white shadow-saas-card">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                          ₹3,480 / Day
                        </span>
                        <ShieldCheck size={16} className="text-emerald-400" />
                      </div>
                      <h4 className="mt-3 text-sm font-bold text-white leading-snug">
                        Need an engineer to clear tasks or fix bugs?
                      </h4>
                      <p className="mt-1.5 text-[11px] text-white/70 leading-relaxed">
                        Book a verified Tech Engi engineer as your co-worker for a day.
                      </p>
                      <Link
                        href="/blog/hire-coworker-for-a-day-3480"
                        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-saas-accent px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors"
                      >
                        <span>Book for ₹3,480</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Recommended Articles Section */}
        <section className="border-t border-saas-line/80 bg-white/50 py-16">
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-saas-accent">
                  Knowledge Hub
                </p>
                <h3 className="mt-1 text-2xl font-bold text-saas-ink">
                  More Practical Engineering Guides
                </h3>
              </div>
              <Link
                href="/blog"
                className="text-xs font-semibold text-saas-accent hover:underline flex items-center gap-1"
              >
                View all articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/blog/cost-to-hire-developer-fix-bug-india"
                className="group flex flex-col justify-between rounded-3xl border border-saas-line bg-white p-6 shadow-saas-card transition duration-200 hover:-translate-y-1 hover:shadow-saas-card-hover"
              >
                <div>
                  <span className="rounded-full bg-saas-icon-bg px-3 py-1 text-[11px] font-semibold text-saas-accent">
                    Hiring & Costs
                  </span>
                  <h4 className="mt-4 text-base font-bold text-saas-ink group-hover:text-saas-accent transition-colors line-clamp-2">
                    How Much Does It Cost to Hire a Developer or Fix a Bug in India? (2026)
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-saas-tx line-clamp-3">
                    Freelance developer rates in India by experience, what a full-time engineer costs per day, and Tech Engi&apos;s ₹3,480 co-worker day.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-saas-mut pt-4 border-t border-saas-line/60">
                  <span>7 min read</span>
                  <span className="font-semibold text-saas-accent group-hover:translate-x-0.5 transition-transform">
                    Read guide →
                  </span>
                </div>
              </Link>

              <Link
                href="/blog/how-to-fix-code-without-ai"
                className="group flex flex-col justify-between rounded-3xl border border-saas-line bg-white p-6 shadow-saas-card transition duration-200 hover:-translate-y-1 hover:shadow-saas-card-hover"
              >
                <div>
                  <span className="rounded-full bg-saas-icon-bg px-3 py-1 text-[11px] font-semibold text-saas-accent">
                    Bug Fixing
                  </span>
                  <h4 className="mt-4 text-base font-bold text-saas-ink group-hover:text-saas-accent transition-colors line-clamp-2">
                    How to Fix Your Code Without AI: A Human Debugging Method That Actually Works
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-saas-tx line-clamp-3">
                    No ChatGPT, no Copilot. A 9-step human debugging method and the right tools for Python, JS, React, Node and SQL.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-saas-mut pt-4 border-t border-saas-line/60">
                  <span>8 min read</span>
                  <span className="font-semibold text-saas-accent group-hover:translate-x-0.5 transition-transform">
                    Read guide →
                  </span>
                </div>
              </Link>

              <Link
                href="/blog/developer-left-unfinished-project"
                className="group flex flex-col justify-between rounded-3xl border border-saas-line bg-white p-6 shadow-saas-card transition duration-200 hover:-translate-y-1 hover:shadow-saas-card-hover"
              >
                <div>
                  <span className="rounded-full bg-saas-icon-bg px-3 py-1 text-[11px] font-semibold text-saas-accent">
                    Freelance Safety
                  </span>
                  <h4 className="mt-4 text-base font-bold text-saas-ink group-hover:text-saas-accent transition-colors line-clamp-2">
                    My Developer Left and the Project Is Unfinished: How to Get It Finished
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-saas-tx line-clamp-3">
                    What to secure in the first 48 hours, how to judge finish vs rebuild, and finding someone to finish it safely in India.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-saas-mut pt-4 border-t border-saas-line/60">
                  <span>7 min read</span>
                  <span className="font-semibold text-saas-accent group-hover:translate-x-0.5 transition-transform">
                    Read guide →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Global SaaS CTA Section */}
        <CtaSection />
      </main>

      {/* Global SaaS Footer */}
      <Footer />
    </div>
  );
}
