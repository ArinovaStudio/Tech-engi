/** Only same-origin relative paths are allowed as post-auth destinations (no open redirects). */
export function safeCallbackPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw.trim();
  if (!v.startsWith("/") || v.startsWith("//") || v.startsWith("/\\")) return null;
  if (/[\r\n]/.test(v)) return null;
  // Never bounce back into the auth screens.
  if (/^\/(login|register|forgot-password)(\/|\?|$)/.test(v)) return null;
  return v;
}

export const CALLBACK_COOKIE = "te_callback";

/** Browser only: remember ?callbackUrl= across signup -> profile form -> role-redirect. */
export function rememberCallbackFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const cb = safeCallbackPath(new URLSearchParams(window.location.search).get("callbackUrl"));
  if (cb) document.cookie = `${CALLBACK_COOKIE}=${encodeURIComponent(cb)}; path=/; max-age=3600; samesite=lax`;
  return cb;
}
