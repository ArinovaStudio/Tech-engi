// app/api/new-request/route.ts  (or src/app/api/new-request/route.ts)
import { transporter } from "@/lib/email";
import { NextResponse } from "next/server";

// Needs Node (Buffer + SMTP). Uploads can take a while, so allow a longer run on Vercel.
export const runtime = "nodejs";
export const maxDuration = 60;

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const ROLES = {
  client: "Client",
  engineer: "Engineer",
  bug: "Fix a Bug", // sent by the "Fix a Bug" tab in Hero.tsx
  corporate: "Corporate",
} as const;
type Role = keyof typeof ROLES;

const BRAND = "Tech Engi";
const INK = "#0f1b3d";

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\d{10}$/;

// Same limits as the form: a file up to 20 MB, a zip up to 50 MB, 50 MB in total
const MB = 1024 * 1024;
const MAX_FILE_BYTES = 20 * MB;
const MAX_ZIP_BYTES = 50 * MB;
const MAX_TOTAL_BYTES = 50 * MB;
const MAX_FILES = 10;

// What can actually be attached to an email. Gmail rejects messages over 25 MB, and email
// encoding adds ~33%, so about 18 MB of raw files is the safe ceiling. Anything bigger needs
// file storage (S3, R2, UploadThing...) plus a link in the email.
const EMAIL_ATTACH_MAX = Number(process.env.EMAIL_ATTACH_MAX_MB ?? 18) * MB;

/* ------------------------------------------------------------------ */
/* Tiny in-memory rate limit (5 requests / 10 min / IP)                */
/* Per server instance only; use Redis/Upstash if you run serverless.  */
/* ------------------------------------------------------------------ */

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function isLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");

// Everything the user typed is escaped before it goes into the email HTML
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const withBreaks = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

const fmtSize = (n: number) =>
  n < 1024 ? `${n} B` : n < MB ? `${Math.round(n / 1024)} KB` : `${(n / MB).toFixed(1)} MB`;

const isZip = (f: File) => /\.zip$/i.test(f.name);

// Only these types are accepted: DOCX, PDF, PNG, JPG, and a zip
const ALLOWED_EXT = /\.(docx|pdf|png|jpe?g|zip)$/i;

// The first bytes of a file say what it really is, so a renamed file is caught
const startsWith = (b: Buffer, sig: number[]) => sig.every((x, i) => b[i] === x);
function hasValidSignature(name: string, b: Buffer) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return startsWith(b, [0x25, 0x50, 0x44, 0x46]); // %PDF
  if (ext === "png") return startsWith(b, [0x89, 0x50, 0x4e, 0x47]);
  if (ext === "jpg" || ext === "jpeg") return startsWith(b, [0xff, 0xd8, 0xff]);
  if (ext === "docx" || ext === "zip") return startsWith(b, [0x50, 0x4b]); // "PK" (zip container)
  return false;
}

// Keep only a safe file name (no paths, no odd characters)
const cleanName = (n: string) =>
  n.replace(/[\\/:*?"<>|\u0000-\u001f]+/g, "_").trim().slice(0, 120) || "file";

type FileInfo = { name: string; size: number };

type Lead = {
  role: Role;
  message: string;
  name: string;
  email: string;
  phone: string;
  files: FileInfo[];
};

/* ------------------------------------------------------------------ */
/* Email templates                                                     */
/* ------------------------------------------------------------------ */

function layout(preheader: string, inner: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f5fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5fa;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e3e8f2;">
            <tr>
              <td style="background:${INK};padding:20px 28px;color:#ffffff;font-size:18px;font-weight:600;letter-spacing:.2px;">${BRAND}</td>
            </tr>
            <tr>
              <td style="padding:28px;">${inner}</td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#8a94ab;">&copy; ${new Date().getFullYear()} ${BRAND}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #eef1f7;width:130px;font-size:13px;color:#6b7690;vertical-align:top;">${label}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eef1f7;font-size:14px;color:${INK};vertical-align:top;">${value}</td>
  </tr>`;

const messageBox = (message: string) => `
  <div style="margin-top:20px;padding:16px 18px;background:#f6f8fc;border-radius:14px;font-size:14px;line-height:1.6;color:${INK};">
    ${withBreaks(message)}
  </div>`;

const filesHtml = (files: FileInfo[]) =>
  files.map((f) => `${esc(f.name)} <span style="color:#6b7690;">(${fmtSize(f.size)})</span>`).join("<br>");

const filesText = (files: FileInfo[]) => files.map((f) => `  - ${f.name} (${fmtSize(f.size)})`);

const NO_MESSAGE = "(No message, see the attachments.)";

function adminEmail(lead: Lead, receivedAt: string) {
  const roleLabel = ROLES[lead.role];
  const html = layout(
    `New ${roleLabel} request from ${lead.name || lead.email}`,
    `
    <p style="margin:0 0 6px;font-size:13px;color:#6b7690;">New request received</p>
    <h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;">
      <span style="display:inline-block;padding:4px 12px;border-radius:999px;background:${INK};color:#fff;font-size:13px;font-weight:600;vertical-align:middle;">${roleLabel}</span>
    </h1>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Request type", esc(roleLabel))}
      ${row("Name", lead.name ? esc(lead.name) : "&mdash;")}
      ${row("Email", `<a href="mailto:${esc(lead.email)}" style="color:${INK};">${esc(lead.email)}</a>`)}
      ${row("Phone", `<a href="tel:${esc(lead.phone)}" style="color:${INK};">${esc(lead.phone)}</a>`)}
      ${row("Received", esc(receivedAt))}
      ${lead.files.length ? row("Attachments", filesHtml(lead.files)) : ""}
    </table>
    <p style="margin:22px 0 0;font-size:13px;color:#6b7690;">Message</p>
    ${messageBox(lead.message || NO_MESSAGE)}`
  );

  const text = [
    `New ${roleLabel} request`,
    ``,
    `Name: ${lead.name || "-"}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Received: ${receivedAt}`,
    ...(lead.files.length ? [`Attachments:`, ...filesText(lead.files)] : []),
    ``,
    `Message:`,
    lead.message || NO_MESSAGE,
  ].join("\n");

  return {
    subject: oneLine(
      `New ${roleLabel} request - ${lead.name || lead.email}${lead.files.length ? ` (${lead.files.length} attached)` : ""}`
    ),
    html,
    text,
  };
}

function userEmail(lead: Lead) {
  const roleLabel = ROLES[lead.role];
  const first = lead.name.split(/\s+/)[0];
  const html = layout(
    `We've received your request - we'll reach out shortly.`,
    `
    <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;">Hi ${first ? esc(first) : "there"}, we've got your request</h1>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3b4660;">
      Thanks for reaching out to ${BRAND}. We have received your request and we will reach out to you shortly.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Request type", esc(roleLabel))}
      ${row("Email", esc(lead.email))}
      ${row("Phone", esc(lead.phone))}
      ${lead.files.length ? row("Attachments", filesHtml(lead.files)) : ""}
    </table>
    <p style="margin:22px 0 0;font-size:13px;color:#6b7690;">Your message</p>
    ${messageBox(lead.message || NO_MESSAGE)}
    <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#6b7690;">
      If anything above looks wrong, just reply to this email.
    </p>`
  );

  const text = [
    `Hi ${first || "there"},`,
    ``,
    `Thanks for reaching out to ${BRAND}. We have received your request and we will reach out to you shortly.`,
    ``,
    `Request type: ${roleLabel}`,
    ...(lead.files.length ? [`Attachments:`, ...filesText(lead.files)] : []),
    `Your message:`,
    lead.message || NO_MESSAGE,
  ].join("\n");

  return { subject: `We've received your request - ${BRAND}`, html, text };
}

/* ------------------------------------------------------------------ */
/* POST /api/new-request  (multipart/form-data)                        */
/* ------------------------------------------------------------------ */

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isLimited(ip)) {
    return fail("Too many requests. Please try again in a few minutes.", 429);
  }

  // Cheap early check so an oversized upload is refused before it is read into memory
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_TOTAL_BYTES + MB) {
    return fail(`Attachments are limited to ${fmtSize(MAX_TOTAL_BYTES)} in total.`, 413);
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return fail("Invalid request body.");
  }

  const role = str(fd.get("role"));
  const message = str(fd.get("message"));
  const name = str(fd.get("name"));
  const email = str(fd.get("email"));
  const phone = str(fd.get("phone"));

  // Attachments: only real files, empty ones skipped
  const files = fd
    .getAll("attachments")
    .filter((v): v is File => typeof v !== "string" && v.size > 0);

  if (!(role in ROLES)) return fail("Invalid request type.");
  if (!message && files.length === 0) return fail("Please describe your request or attach a file.");
  if (message.length > 2000) return fail("Message is too long (max 2000 characters).");
  if (name.length > 80) return fail("Name is too long (max 80 characters).");
  if (email.length > 254 || !EMAIL_RE.test(email)) return fail("Please enter a valid email address.");
  if (!PHONE_RE.test(phone)) return fail("Phone number must be exactly 10 digits.");

  // Check every size from file.size before reading any file into memory
  if (files.length > MAX_FILES) return fail(`You can attach up to ${MAX_FILES} files.`);

  let total = 0;
  for (const f of files) {
    if (!ALLOWED_EXT.test(f.name)) {
      return fail(`${cleanName(f.name)} is not allowed. Use DOCX, PDF, PNG, JPG or a zip.`);
    }
    const limit = isZip(f) ? MAX_ZIP_BYTES : MAX_FILE_BYTES;
    if (f.size > limit) {
      return fail(`${cleanName(f.name)} is over ${fmtSize(limit)}.`, 413);
    }
    total += f.size;
  }
  if (total > MAX_TOTAL_BYTES) {
    return fail(`Attachments are limited to ${fmtSize(MAX_TOTAL_BYTES)} in total.`, 413);
  }
  if (total > EMAIL_ATTACH_MAX) {
    // NEXT STEP for bigger uploads: save the files to storage here (S3, R2, UploadThing...)
    // and put the download links in the email instead of attaching them.
    return fail(
      `Attachments over ${fmtSize(EMAIL_ATTACH_MAX)} can't be emailed yet. Send a smaller zip, or share a download link in your message.`,
      413
    );
  }

  const uploads = await Promise.all(
    files.map(async (f) => ({
      filename: cleanName(f.name),
      content: Buffer.from(await f.arrayBuffer()),
    }))
  );

  const bad = uploads.find((u) => !hasValidSignature(u.filename, u.content));
  if (bad) return fail(`${bad.filename} is not a valid file of its type.`);

  const lead: Lead = {
    role: role as Role,
    message,
    name,
    email,
    phone,
    files: uploads.map((u) => ({ name: u.filename, size: u.content.length })),
  };

  const from = process.env.EMAIL_USER;
  const adminTo = process.env.SMTP_ADMIN_TO || process.env.EMAIL_USER;

  const receivedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const mailer = transporter;

  // 1) Notify the team, with the files attached. If this fails, the request did not go through.
  try {
    const admin = adminEmail(lead, receivedAt);

    await mailer.sendMail({
      from,
      to: adminTo,
      replyTo: lead.email,
      subject: admin.subject,
      html: admin.html,
      text: admin.text,
      attachments: uploads,
    });
  } catch (err) {
    console.error("[new-request] Admin email failed:", err);
    return fail("We couldn't send your request right now. Please try again later.", 500);
  }

  // 2) Confirmation to the user (file names only, not the files). The team already has the
  //    request, so a failure here is only logged.
  try {
    const user = userEmail(lead);
    await mailer.sendMail({
      from,
      to: lead.email,
      subject: user.subject,
      html: user.html,
      text: user.text,
    });
  } catch (err) {
    console.error("[new-request] Confirmation email failed:", err);
  }

  return NextResponse.json({ ok: true });
}