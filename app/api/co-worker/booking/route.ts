import { NextRequest, NextResponse } from "next/server";
import { transporter } from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const MAX_HITS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, timestamps] of hits) {
      if (!timestamps.some((time) => now - time < WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidBookingDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return false;
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const daysAhead = (date.getTime() - today.getTime()) / 86_400_000;
  return daysAhead >= 0 && daysAhead <= 91;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { success: false, message: "Invalid booking details." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const repo = typeof data.repo === "string" ? data.repo.trim() : "";
  const brief = typeof data.brief === "string" ? data.brief.trim() : "";
  const mode = data.mode;
  const date = typeof data.date === "string" ? data.date : "";
  const filesCount = data.filesCount;

  if (
    email.length > 254 ||
    !EMAIL_RE.test(email) ||
    repo.length > 2048 ||
    brief.length > 5000 ||
    (repo && !isHttpUrl(repo)) ||
    (mode !== "now" && mode !== "later") ||
    (mode === "later" && !isValidBookingDate(date)) ||
    !Number.isInteger(filesCount) ||
    (filesCount as number) < 0 ||
    (filesCount as number) > 1000 ||
    data.agreed !== true
  ) {
    return NextResponse.json(
      { success: false, message: "Please check your email and booking details." },
      { status: 400 },
    );
  }

  const from = process.env.EMAIL_USER;
  const to = process.env.SMTP_ADMIN_TO || from;
  if (!from || !to) {
    console.error("Co-worker booking email is not configured.");
    return NextResponse.json(
      { success: false, message: "We could not send your request right now. Please try again later." },
      { status: 503 },
    );
  }

  const bookingDate = mode === "later" ? date : "As soon as an engineer is available";
  const briefHtml = escapeHtml(brief || "(No brief provided.)").replace(/\r?\n/g, "<br>");
  const repoHtml = repo
    ? `<a href="${escapeHtml(repo)}">${escapeHtml(repo)}</a>`
    : "Not provided";
  const teamHtml = `
    <h2>New co-worker booking request</h2>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Booking:</strong> ${mode === "now" ? "Book now" : "Book ahead"}</p>
    <p><strong>Requested date:</strong> ${escapeHtml(bookingDate)}</p>
    <p><strong>Repo or drive link:</strong> ${repoHtml}</p>
    <p><strong>Selected local files:</strong> ${filesCount}</p>
    <p><strong>Brief:</strong></p>
    <p>${briefHtml}</p>
    <p>Selected files remain in the sender's browser and were not uploaded or attached.</p>
  `;
  const receiptHtml = `
    <h2>We received your co-worker booking request</h2>
    <p>Thanks for reaching out. We have received your request and our team will follow up using this email address.</p>
    <p><strong>Booking:</strong> ${mode === "now" ? "Book now" : "Book ahead"}</p>
    <p><strong>Requested date:</strong> ${escapeHtml(bookingDate)}</p>
    <p><strong>Repo or drive link:</strong> ${repoHtml}</p>
    <p><strong>Your brief:</strong></p>
    <p>${briefHtml}</p>
    <p>This request is not a confirmed booking and no payment has been taken. Files selected on the page remain in your browser and were not uploaded.</p>
  `;

  try {
    await Promise.all([
      transporter.sendMail({
        from,
        to,
        replyTo: email,
        subject: "New co-worker booking request",
        html: teamHtml,
        text: [
          "New co-worker booking request",
          `Email: ${email}`,
          `Booking: ${mode === "now" ? "Book now" : "Book ahead"}`,
          `Requested date: ${bookingDate}`,
          `Repo or drive link: ${repo || "Not provided"}`,
          `Selected local files: ${filesCount}`,
          `Brief: ${brief || "(No brief provided.)"}`,
          "Files remain in the sender's browser and were not uploaded or attached.",
        ].join("\n"),
      }),
      transporter.sendMail({
        from,
        to: email,
        subject: "We received your co-worker booking request",
        html: receiptHtml,
        text: [
          "We received your co-worker booking request.",
          "Our team will follow up using this email address.",
          `Booking: ${mode === "now" ? "Book now" : "Book ahead"}`,
          `Requested date: ${bookingDate}`,
          `Repo or drive link: ${repo || "Not provided"}`,
          `Your brief: ${brief || "(No brief provided.)"}`,
          "This request is not a confirmed booking and no payment has been taken.",
          "Files selected on the page remain in your browser and were not uploaded.",
        ].join("\n"),
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send co-worker booking emails:", error);
    return NextResponse.json(
      { success: false, message: "We could not send your request right now. Please try again later." },
      { status: 502 },
    );
  }
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
