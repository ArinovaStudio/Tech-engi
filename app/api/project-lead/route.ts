import { NextResponse } from "next/server";
import { transporter } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[+\d()\s.-]+$/;
const MAX_BODY_BYTES = 32 * 1024;
const hits = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 8;

interface ProjectLead {
  category: string;
  services: string[];
  otherDetails: Record<string, string>;
  mode: string;
  days?: number;
  budget?: number;
  description: string;
  email: string;
  phone: string;
}

const text = (value: unknown, maxLength: number): string | null =>
  typeof value === "string" && value.trim().length <= maxLength
    ? value.trim()
    : null;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const withBreaks = (value: string): string =>
  escapeHtml(value).replace(/\r?\n/g, "<br>");

function isRateLimited(request: Request): boolean {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 1000) {
    for (const [key, timestamps] of hits) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
        hits.delete(key);
      }
    }
  }
  return false;
}

function parseLead(body: unknown): ProjectLead | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const data = body as Record<string, unknown>;
  const category = text(data.category, 120);
  const mode = text(data.mode, 80);
  const description = text(data.description, 5000);
  const email = text(data.email, 254);
  const phone = text(data.phone, 24);
  if (
    data.allowPartialContact !== undefined &&
    typeof data.allowPartialContact !== "boolean"
  ) {
    return null;
  }
  const allowPartialContact = data.allowPartialContact === true;
  if (category === null || mode === null || description === null || email === null || phone === null) {
    return null;
  }
  if (
    !category ||
    !mode ||
    (!email && !phone) ||
    (!allowPartialContact && (!email || !phone))
  ) {
    return null;
  }
  if (email && !EMAIL_RE.test(email)) return null;
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (!PHONE_RE.test(phone) || digits.length < 7 || digits.length > 15) return null;
  }

  const rawServices = data.services ?? [];
  if (!Array.isArray(rawServices) || rawServices.length > 50) return null;
  const services: string[] = [];
  for (const service of rawServices) {
    const cleanService = text(service, 180);
    if (cleanService === null) return null;
    services.push(cleanService);
  }

  const otherDetails: Record<string, string> = {};
  if (data.otherDetails !== undefined) {
    if (!data.otherDetails || typeof data.otherDetails !== "object" || Array.isArray(data.otherDetails)) {
      return null;
    }
    const entries = Object.entries(data.otherDetails);
    if (entries.length > 30) return null;
    for (const [group, detail] of entries) {
      const cleanGroup = text(group, 120);
      const cleanDetail = text(detail, 500);
      if (cleanGroup === null || cleanDetail === null) return null;
      if (cleanDetail) otherDetails[cleanGroup] = cleanDetail;
    }
  }

  const days = data.days;
  if (days !== undefined && (typeof days !== "number" || !Number.isInteger(days) || days < 1 || days > 30)) {
    return null;
  }
  const budget = data.budget;
  if (budget !== undefined && (typeof budget !== "number" || !Number.isFinite(budget) || budget < 0)) {
    return null;
  }

  return {
    category,
    services,
    otherDetails,
    mode,
    ...(typeof days === "number" ? { days } : {}),
    ...(typeof budget === "number" ? { budget } : {}),
    description,
    email,
    phone,
  };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Your brief is too large to send." }, { status: 413 });
  }
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lead = parseLead(body);
  if (!lead) {
    return NextResponse.json(
      { error: "Check your project details and provide a valid email address or phone number." },
      { status: 400 },
    );
  }

  const from = process.env.EMAIL_USER;
  const to = process.env.SMTP_ADMIN_TO || from;
  if (!from || !to) {
    console.error("[project-lead] EMAIL_USER or SMTP_ADMIN_TO is not configured.");
    return NextResponse.json({ error: "We couldn't send your brief right now." }, { status: 500 });
  }

  const services = lead.services.length ? lead.services : ["Not selected"];
  const otherDetails = Object.entries(lead.otherDetails);
  const lines = [
    `Category: ${lead.category}`,
    `Services: ${services.join(", ")}`,
    ...otherDetails.map(([group, detail]) => `Something else (${group}): ${detail}`),
    `Approach: ${lead.mode}`,
    ...(lead.days ? [`Working days: ${lead.days}`] : []),
    ...(lead.budget ? [`Budget: ₹${lead.budget.toLocaleString("en-IN")}`] : []),
    `Email: ${lead.email || "Not provided"}`,
    `Phone: ${lead.phone || "Not provided"}`,
    "",
    "Description:",
    lead.description || "No description provided",
  ];
  const rows = [
    ["Category", lead.category],
    ["Services", services.join(", ")],
    ...otherDetails.map(([group, detail]) => [`Something else (${group})`, detail]),
    ["Approach", lead.mode],
    ...(lead.days ? [["Working days", String(lead.days)]] : []),
    ...(lead.budget ? [["Budget", `₹${lead.budget.toLocaleString("en-IN")}`]] : []),
    ["Email", lead.email || "Not provided"],
    ["Phone", lead.phone || "Not provided"],
  ];

  try {
    await transporter.sendMail({
      from,
      to,
      ...(lead.email ? { replyTo: lead.email } : {}),
      subject: "New project brief from a client",
      text: lines.join("\n"),
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#0f1b3d">
        <h2>New project brief</h2>
        <table style="border-collapse:collapse;width:100%">
          ${rows.map(([label, value]) => `<tr><th style="padding:8px;border:1px solid #ddd;text-align:left">${escapeHtml(label)}</th><td style="padding:8px;border:1px solid #ddd">${escapeHtml(value)}</td></tr>`).join("")}
        </table>
        <h3>Description</h3>
        <p style="line-height:1.6">${withBreaks(lead.description || "No description provided")}</p>
      </div>`,
    });
  } catch (error) {
    console.error("[project-lead] Email delivery failed:", error);
    return NextResponse.json({ error: "We couldn't send your brief right now. Please try again." }, { status: 500 });
  }

  if (lead.email) {
    try {
      await transporter.sendMail({
        from,
        to: lead.email,
        subject: "We’ve received your project requirements",
        text: "Thanks for sharing your project requirements with Tech Engi. We’ve received your brief and our team will reach out to you shortly.",
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f1b3d;line-height:1.6">
          <h2>We’ve received your requirements</h2>
          <p>Thanks for sharing your project with Tech Engi. We’ve received your brief, and our team will reach out to you shortly.</p>
          <p>Best regards,<br>Team Tech Engi</p>
        </div>`,
      });
    } catch (error) {
      console.error("[project-lead] Client confirmation email failed:", error);
    }
  }

  return NextResponse.json({ success: true });
}
