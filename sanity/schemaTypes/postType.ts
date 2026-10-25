import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The URL slug for this article (e.g. 'my-article-title'). Do not include '/blog/' or spaces.",
      options: {
        source: "title",
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/^\/?(blog\/)?/i, "")
            .replace(/\/+$/, "")
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .slice(0, 96),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return "Slug is required";
          if (slug.current.includes(" ")) return "Slug cannot contain spaces";
          if (slug.current.startsWith("/") || slug.current.endsWith("/")) {
            return "Slug cannot start or end with a slash '/'";
          }
          if (slug.current.toLowerCase().startsWith("blog/")) {
            return "Slug should not include 'blog/'. Just the article name (e.g. 'my-first-post')";
          }
          return true;
        }),
    }),
    defineField({
      name: "metaTitle",
      title: "Meta Title (SEO)",
      type: "string",
      description: "Custom title tag for search engines. Defaults to Title if empty.",
    }),
    defineField({
      name: "description",
      title: "Excerpt / Meta Description",
      type: "text",
      rows: 3,
      description: "Brief summary used in cards, Google snippets, and OpenGraph (150-160 chars recommended).",
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: "canonical",
      title: "Canonical URL",
      type: "url",
      description: "Canonical URL for SEO (e.g. https://techengi.in/blog/slug).",
    }),
    defineField({
      name: "primaryKeyword",
      title: "Primary Target Keyword",
      type: "string",
      placeholder: "e.g. developer left project unfinished",
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Secondary Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "mainImage",
      title: "Main Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "datetime",
      description: "Date of last content update or revision.",
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      placeholder: "e.g. 7 min read",
      initialValue: "5 min read",
    }),
    defineField({
      name: "tldr",
      title: "TL;DR (Quick Overview Box)",
      type: "text",
      rows: 4,
      description: "Optional key takeaways block shown right before the article content.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      date: "publishedAt",
    },
    prepare(selection) {
      const { author, date } = selection;
      const formattedDate = date ? new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) : "";
      return {
        ...selection,
        subtitle: author && formattedDate ? `by ${author} • ${formattedDate}` : author || formattedDate,
      };
    },
  },
});
