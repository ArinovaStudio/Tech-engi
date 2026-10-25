import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";
import { urlForImage } from "@/sanity/lib/image";
import {
  Info,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Code2,
  HelpCircle,
} from "lucide-react";

interface SpanChild {
  text?: string;
  [key: string]: unknown;
}

function getBlockText(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const children = (value as { children?: SpanChild[] }).children;
  if (!Array.isArray(children)) return "";
  return children.map((c) => c.text || "").join("");
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlForImage(value)?.width(1400).fit("max").url();
      if (!imageUrl) return null;

      return (
        <figure className="my-10 overflow-hidden rounded-saas-4xl border border-saas-line/80 bg-white/80 p-3 shadow-saas-panel backdrop-blur-md">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={imageUrl}
              alt={value.alt || "Tech Engi Blog illustration"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 860px"
            />
          </div>
          {value.caption && (
            <figcaption className="px-3 pt-3 pb-1 text-center text-xs text-saas-mut">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    callout: ({ value }) => {
      const tone = value.tone || "info";

      const toneStyles = {
        info: {
          bg: "bg-saas-icon-bg/70",
          border: "border-saas-accent/30",
          text: "text-saas-ink",
          iconBg: "bg-white text-saas-accent shadow-sm",
          Icon: Info,
        },
        warning: {
          bg: "bg-amber-50/90",
          border: "border-amber-200",
          text: "text-amber-950",
          iconBg: "bg-white text-amber-600 shadow-sm",
          Icon: AlertTriangle,
        },
        tip: {
          bg: "bg-emerald-50/90",
          border: "border-emerald-200",
          text: "text-emerald-950",
          iconBg: "bg-white text-emerald-600 shadow-sm",
          Icon: Lightbulb,
        },
        danger: {
          bg: "bg-rose-50/90",
          border: "border-rose-200",
          text: "text-rose-950",
          iconBg: "bg-white text-rose-600 shadow-sm",
          Icon: AlertTriangle,
        },
      };

      const style = toneStyles[tone as keyof typeof toneStyles] || toneStyles.info;
      const IconComponent = style.Icon;

      return (
        <aside
          className={`my-8 flex gap-4 rounded-3xl border ${style.border} ${style.bg} p-6 shadow-sm backdrop-blur-sm`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${style.iconBg}`}
          >
            <IconComponent size={20} />
          </div>
          <div className="min-w-0 flex-1">
            {value.title && (
              <h4 className={`text-[16px] font-bold leading-snug ${style.text}`}>
                {value.title}
              </h4>
            )}
            {value.content && (
              <p
                className={`mt-1.5 text-[14.5px] leading-relaxed ${style.text}/90 whitespace-pre-wrap`}
              >
                {value.content}
              </p>
            )}
          </div>
        </aside>
      );
    },
    codeSnippet: ({ value }) => {
      return (
        <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-saas-nav text-white shadow-saas-panel">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
              <Code2 size={13} />
              {value.filename || value.language || "code"}
            </span>
            <span className="uppercase tracking-wider text-[10px] text-slate-400">
              {value.language || "text"}
            </span>
          </div>
          <pre className="overflow-x-auto p-4 text-[13.5px] leading-relaxed text-slate-200 font-mono">
            <code>{value.code}</code>
          </pre>
        </div>
      );
    },
    tableBlock: ({ value }) => {
      const headers: string[] = value.headers || [];
      const rows: { cells?: string[] }[] = value.rows || [];
      if (!headers.length && !rows.length) return null;

      return (
        <div className="my-10 overflow-hidden rounded-2xl border border-saas-line/80 bg-white shadow-saas-panel">
          {value.title && (
            <div className="border-b border-saas-line bg-saas-bg px-6 py-3 text-sm font-bold text-saas-ink">
              {value.title}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {headers.length > 0 && (
                <thead className="border-b border-saas-line bg-saas-bg/60 text-xs font-bold uppercase tracking-wider text-saas-mut">
                  <tr>
                    {headers.map((h, i) => (
                      <th key={i} className="px-6 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-saas-line/60">
                {rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="transition-colors hover:bg-saas-bg/40"
                  >
                    {(row.cells || []).map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`px-6 py-4 text-saas-tx ${cIdx === 0 ? "font-semibold text-saas-ink" : ""
                          }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    },
    faqBlock: ({ value }) => {
      const items: { question: string; answer: string }[] = value.items || [];
      if (!items.length) return null;
      const faqId = value.title
        ? value.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : "faq";

      return (
        <div
          id={faqId || "faq"}
          className="scroll-mt-28 my-12 rounded-3xl border border-saas-line/80 bg-white/70 p-6 sm:p-8 shadow-saas-panel backdrop-blur-sm"
        >
          {value.title && (
            <div className="mb-6 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-saas-icon-bg text-saas-accent">
                <HelpCircle size={18} />
              </span>
              <h3 className="text-xl font-bold text-saas-ink">{value.title}</h3>
            </div>
          )}
          <div className="divide-y divide-saas-line">
            {items.map((item, idx) => (
              <details key={idx} className="group py-5 first:pt-0 last:pb-0">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-saas-ink hover:text-saas-accent transition-colors [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saas-icon-bg text-saas-accent text-sm font-bold group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-saas-tx">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="my-5 text-[16.5px] leading-[1.85] text-saas-tx">
        {children}
      </p>
    ),
    h2: ({ children, value }) => {
      const text = getBlockText(value);
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return (
        <h2
          id={id || undefined}
          className="scroll-mt-28 mt-14 mb-4 text-[26px] font-bold leading-[1.2] tracking-tight text-saas-ink sm:text-[30px]"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children, value }) => {
      const text = getBlockText(value);
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return (
        <h3
          id={id || undefined}
          className="scroll-mt-28 mt-10 mb-3 text-[21px] font-bold leading-[1.25] tracking-tight text-saas-ink sm:text-[24px]"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children, value }) => {
      const text = getBlockText(value);
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      return (
        <h4
          id={id || undefined}
          className="scroll-mt-28 mt-8 mb-2 text-[18px] font-bold leading-tight text-saas-ink"
        >
          {children}
        </h4>
      );
    },
    blockquote: ({ children }) => (
      <blockquote className="my-7 rounded-r-2xl border-l-4 border-saas-accent bg-saas-icon-bg/40 py-4 pl-6 pr-5 text-[16.5px] italic leading-relaxed text-saas-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-5 ml-6 list-disc space-y-2.5 text-[16px] leading-[1.8] text-saas-tx">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 ml-6 list-decimal space-y-2.5 text-[16px] leading-[1.8] text-saas-tx">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-saas-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded-md border border-saas-line bg-white px-1.5 py-0.5 font-mono text-[0.875em] text-saas-ink">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ value, children }) => {
      const isExternal =
        value?.href?.startsWith("http://") ||
        value?.href?.startsWith("https://");

      if (isExternal) {
        return (
          <a
            href={value.href}
            target={value.blank ? "_blank" : undefined}
            rel={value.blank ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-0.5 font-medium text-saas-accent underline decoration-saas-accent/40 underline-offset-4 hover:decoration-saas-accent transition-colors"
          >
            {children}
            <ExternalLink size={12} className="inline opacity-70 ml-0.5" />
          </a>
        );
      }

      return (
        <Link
          href={value?.href || "#"}
          className="font-medium text-saas-accent underline decoration-saas-accent/40 underline-offset-4 hover:decoration-saas-accent transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
};

export function PortableTextRenderer({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value)) return null;
  return (
    <PortableText
      value={value as Parameters<typeof PortableText>[0]["value"]}
      components={components}
    />
  );
}
