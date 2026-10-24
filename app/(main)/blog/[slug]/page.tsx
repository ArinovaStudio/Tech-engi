"use client";

import { useEffect, useState, useMemo } from "react";
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
  children?: { text?: string }[];
  [key: string]: unknown;
}

function extractHeadings(body: unknown[] = []) {
  const headings: { id: string; text: string; level: number }[] = [];

  for (const rawBlock of body) {
    if (!rawBlock || typeof rawBlock !== "object") continue;
    const block = rawBlock as BlockItem;
    if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
      const text = block.children?.map((c) => c.text || "").join("") || "";
      if (text.trim()) {
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        headings.push({
          id,
          text,
          level: block.style === "h2" ? 2 : 3,
        });
      }
    }
  }

  return headings;
}

export default function DynamicBlogSlugPage({
  explicitSlug,
}: {
  explicitSlug?: string;
} = {}) {
  const params = useParams();
  const slug = explicitSlug || (params?.slug as string) || "";

  const [post, setPost] = useState<SanityPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  // Runtime API fetch via useEffect on every mount & slug change
  useEffect(() => {
    if (!slug) return;

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
          setPost(null);
          setError(data.message || "Article not found");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch blog post:", err);
        setError("Network error while loading article.");
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

  return (
    <div className={`saas-root ${figtree.variable} min-h-screen bg-saas-bg w-full overflow-x-clip`}>
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

                    {/* Back to Blog link */}
                    <div className="mt-12">
                      <Link
                        href="/blog"
                        className="btn-outline btn-sm inline-flex items-center gap-2"
                      >
                        <ArrowLeft size={15} />
                        Back to all articles
                      </Link>
                    </div>
                  </article>

                  {/* Sticky Table of Contents Sidebar */}
                  {headings.length > 0 && (
                    <aside className="hidden lg:block sticky top-28">
                      <div className="surface rounded-3xl border border-saas-line bg-white/80 p-6 shadow-sm backdrop-blur-md">
                        <p className="text-xs font-bold uppercase tracking-wider text-saas-mut">
                          On this page
                        </p>
                        <nav className="mt-4">
                          <ul className="space-y-2.5 text-xs">
                            {headings.map((h) => (
                              <li
                                key={h.id}
                                className={h.level === 3 ? "pl-3 text-saas-mut" : "font-medium"}
                              >
                                <a
                                  href={`#${h.id}`}
                                  className="line-clamp-2 text-saas-tx transition-colors hover:text-saas-accent"
                                >
                                  {h.text}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </div>
                    </aside>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Global SaaS CTA Section */}
        <CtaSection />
      </main>

      {/* Global SaaS Footer */}
      <Footer />
    </div>
  );
}
