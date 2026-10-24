"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Search,
  Sparkles,
  Calendar,
  X,
  SlidersHorizontal,
} from "lucide-react";

export type BlogPostItem = {
  title: string;
  description: string;
  href: string;
  date: string;
  dateLabel: string;
  readTime: string;
  category: string;
  visual: React.ReactNode;
};

interface BlogListingProps {
  posts: BlogPostItem[];
}

const CATEGORIES = [
  "All",
  "Hiring & Costs",
  "Bug Fixing",
  "Freelance Safety",
  "IT & Career",
] as const;

export default function BlogListing({ posts }: BlogListingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posts.length };
    for (const post of posts) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    return counts;
  }, [posts]);

  // Filtered posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // The absolute latest blog is always the first item in the full sorted posts array
  const latestPost = posts[0];

  // The big banner should show the latest blog only:
  // - Show on the default "All" view with no active search
  // - Or when specifically viewing the category of the latest post with no active search
  // - Never show any other/older blog as the big banner!
  const isLatestCategory =
    latestPost &&
    (selectedCategory === "All" ||
      latestPost.category.toLowerCase() === selectedCategory.toLowerCase());

  const showBigBanner =
    Boolean(latestPost) &&
    !searchQuery.trim() &&
    isLatestCategory &&
    filteredPosts.some((p) => p.href === latestPost.href);

  // The list of posts to show in the grid:
  // If the big banner is active, exclude latestPost so it is NOT duplicated in the grid below
  // If the big banner is inactive, show all filtered posts in the grid

  return (
    <div className="w-full">
      {/* ====================== SEARCH & CATEGORY BAR ====================== */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${active
                      ? "bg-saas-ink text-white shadow-saas-btn"
                      : "border border-saas-line bg-white/80 text-saas-tx hover:border-saas-accent/40 hover:text-saas-ink hover:bg-white"
                    }`}
                >
                  <span>{cat}</span>
                  {count > 0 && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${active
                          ? "bg-white/20 text-white"
                          : "bg-saas-icon-bg text-saas-accent"
                        }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-saas-mut"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full border border-saas-line bg-white/90 py-2.5 pl-10 pr-9 text-sm text-saas-ink placeholder:text-saas-mut focus:border-saas-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-saas-accent/20 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-saas-mut hover:text-saas-ink cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Filter status when search/category is active */}
        {(selectedCategory !== "All" || searchQuery) && (
          <div className="mt-4 flex items-center justify-between text-xs text-saas-tx border-b border-saas-line pb-3">
            <span>
              Showing {filteredPosts.length} of {posts.length} articles
              {selectedCategory !== "All" && (
                <> in <strong className="text-saas-ink">{selectedCategory}</strong></>
              )}
              {searchQuery && (
                <> matching &quot;<strong className="text-saas-ink">{searchQuery}</strong>&quot;</>
              )}
            </span>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="font-medium text-saas-accent hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ====================== POSTS DISPLAY ====================== */}
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 mt-10">
        {filteredPosts.length === 0 ? (
          <div className="surface my-12 rounded-saas-4xl p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-saas-icon-bg text-saas-accent">
              <SlidersHorizontal size={24} />
            </div>
            <h3 className="mt-4 text-xl font-bold text-saas-ink">No articles found</h3>
            <p className="mt-2 text-sm text-saas-tx">
              We couldn&apos;t find anything matching your filter or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="btn btn-sm mt-6"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post (Big banner showing the latest blog only) */}
            {showBigBanner && latestPost && (
              <div className="mb-14">
                <Link
                  href={latestPost.href}
                  className="card group grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 cursor-pointer shadow-saas-card hover:shadow-saas-card-hover"
                >
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-saas-icon-bg px-3.5 py-1 text-xs font-semibold text-saas-accent shadow-2xs">
                        <Sparkles size={12} />
                        Latest Guide
                      </span>
                      {latestPost.category && (
                        <span className="rounded-full border border-saas-line bg-white px-3 py-1 text-xs font-medium text-saas-tx">
                          {latestPost.category}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-5 text-2xl font-bold leading-[1.18] tracking-tight text-saas-ink transition-colors group-hover:text-saas-accent sm:text-3xl lg:text-[32px]">
                      {latestPost.title}
                    </h2>

                    <p className="mt-4 text-[15px] leading-relaxed text-saas-tx line-clamp-3">
                      {latestPost.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-saas-mut">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-saas-accent" />
                        <time dateTime={latestPost.date}>{latestPost.dateLabel}</time>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} className="text-saas-accent" />
                        {latestPost.readTime}
                      </span>
                    </div>

                    <div className="mt-8">
                      <span className="btn inline-flex items-center gap-2 text-sm shadow-saas-btn">
                        Read the article
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-white to-saas-bg border border-saas-line/80 p-6 shadow-sm">
                      {latestPost.visual}
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Grid of Remaining Posts */}
            {filteredPosts.length > 0 && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-saas-ink">
                    {selectedCategory === "All" && !searchQuery
                      ? "All Articles"
                      : "Matching Articles"}
                  </h3>
                  <span className="text-xs text-saas-mut">
                    {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <Link
                      key={post.href}
                      href={post.href}
                      className="card group flex h-full flex-col overflow-hidden p-6 sm:p-7 cursor-pointer"
                    >
                      {/* Visual Header */}
                      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-saas-bg to-white border border-saas-line/60 p-4 transition-transform duration-300 group-hover:scale-[1.02]">
                        {post.visual}
                      </div>

                      {/* Content */}
                      <div className="mt-6 flex flex-1 flex-col">
                        <div className="flex items-center justify-between text-xs text-saas-mut mb-3">
                          <span className="font-semibold text-saas-accent">
                            {post.category}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={12} />
                            {post.readTime}
                          </span>
                        </div>

                        <h4 className="text-[18px] font-bold leading-snug tracking-tight text-saas-ink transition-colors group-hover:text-saas-accent">
                          {post.title}
                        </h4>

                        <p className="mt-3 text-[13.5px] leading-relaxed text-saas-tx line-clamp-3">
                          {post.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-saas-line/60 pt-5 mt-6">
                          <time dateTime={post.date} className="text-xs text-saas-mut">
                            {post.dateLabel}
                          </time>
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-saas-icon-bg text-saas-accent transition-colors duration-200 group-hover:bg-saas-nav group-hover:text-white">
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
