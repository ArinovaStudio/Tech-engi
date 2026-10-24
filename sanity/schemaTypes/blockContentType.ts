import { defineArrayMember, defineType } from "sanity";

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Underline", value: "underline" },
        ],
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                    allowRelative: true,
                  }),
              },
              {
                title: "Open in new tab",
                name: "blank",
                type: "boolean",
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Crucial for SEO and screen readers.",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
    defineArrayMember({
      name: "callout",
      title: "Callout Box",
      type: "object",
      fields: [
        {
          name: "tone",
          title: "Tone",
          type: "string",
          options: {
            list: [
              { title: "Information (Blue)", value: "info" },
              { title: "Highlight / TL;DR (Amber)", value: "warning" },
              { title: "Tip / Best Practice (Green)", value: "tip" },
              { title: "Alert / Caution (Red)", value: "danger" },
            ],
            layout: "radio",
          },
          initialValue: "info",
        },
        {
          name: "title",
          title: "Title / Lead",
          type: "string",
        },
        {
          name: "content",
          title: "Content",
          type: "text",
          rows: 3,
        },
      ],
      preview: {
        select: {
          title: "title",
          subtitle: "tone",
        },
        prepare({ title, subtitle }) {
          return {
            title: title || "Callout",
            subtitle: subtitle ? `Tone: ${subtitle}` : undefined,
          };
        },
      },
    }),
    defineArrayMember({
      name: "codeSnippet",
      title: "Code Snippet",
      type: "object",
      fields: [
        {
          name: "language",
          title: "Language",
          type: "string",
          options: {
            list: [
              { title: "TypeScript / JavaScript", value: "typescript" },
              { title: "Python", value: "python" },
              { title: "HTML / CSS", value: "html" },
              { title: "SQL", value: "sql" },
              { title: "Bash / Shell", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "Other", value: "text" },
            ],
          },
          initialValue: "typescript",
        },
        {
          name: "filename",
          title: "Filename (optional)",
          type: "string",
          placeholder: "e.g. app/api/route.ts",
        },
        {
          name: "code",
          title: "Code",
          type: "text",
          rows: 8,
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: {
          title: "filename",
          subtitle: "language",
        },
        prepare({ title, subtitle }) {
          return {
            title: title || "Code block",
            subtitle: subtitle ? `Lang: ${subtitle}` : undefined,
          };
        },
      },
    }),
    defineArrayMember({
      name: "tableBlock",
      title: "Comparison / Data Table",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Table Caption / Title (optional)",
          type: "string",
        },
        {
          name: "headers",
          title: "Column Headers",
          type: "array",
          of: [{ type: "string" }],
        },
        {
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "cells",
                  title: "Cells (in order of headers)",
                  type: "array",
                  of: [{ type: "string" }],
                },
              ],
              preview: {
                select: {
                  cells: "cells",
                },
                prepare({ cells }) {
                  return {
                    title: Array.isArray(cells) && cells.length > 0 ? cells[0] : "Row",
                    subtitle: Array.isArray(cells) ? cells.slice(1).join(" — ") : undefined,
                  };
                },
              },
            },
          ],
        },
      ],
      preview: {
        select: {
          title: "title",
          headers: "headers",
        },
        prepare({ title, headers }) {
          return {
            title: title || "Data Table",
            subtitle: Array.isArray(headers) ? headers.join(" | ") : "Table",
          };
        },
      },
    }),
    defineArrayMember({
      name: "faqBlock",
      title: "FAQ Section",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Section Heading",
          type: "string",
          initialValue: "Frequently asked questions",
        },
        {
          name: "items",
          title: "Questions & Answers",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "question",
                  title: "Question",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "answer",
                  title: "Answer",
                  type: "text",
                  rows: 3,
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: {
                  title: "question",
                  subtitle: "answer",
                },
              },
            },
          ],
        },
      ],
      preview: {
        select: {
          title: "title",
          items: "items",
        },
        prepare({ title, items }) {
          return {
            title: title || "FAQ Section",
            subtitle: `${Array.isArray(items) ? items.length : 0} Q&A items`,
          };
        },
      },
    }),
  ],
});

