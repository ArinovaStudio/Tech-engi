/**
 * Turns anything the auth flow can throw/return (NextAuth error codes, our own
 * authorize() codes, raw HTTP/JS errors) into a message that is safe to show a
 * user. Never let a raw "Unauthorized", status text or stack-ish string reach
 * the UI: route everything through humanizeAuthError().
 */

export const AUTH_ERROR = {
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  WRONG_PASSWORD: "WRONG_PASSWORD",
  NO_PASSWORD: "NO_PASSWORD",
  SUSPENDED: "ACCOUNT_SUSPENDED",
  MISSING: "MISSING_CREDENTIALS",
} as const;

export const AUTH_MESSAGES = {
  emailNotFound: "We couldn't find an account with that email. Check the spelling or create a new account.",
  wrongPassword: "That password is incorrect. Try again or use “Forgot password?”.",
  emailExists: "An account with this email already exists. Try logging in instead.",
  noPassword: "This account was created with Google or GitHub. Use that button to sign in.",
  suspended: "This account has been suspended. Please contact support.",
  missing: "Please enter your email and password.",
  network: "We couldn't reach the server. Check your internet connection and try again.",
  sessionExpired: "Your session has expired. Please log in again.",
  oauthLinked: "This email is already registered with a different sign-in method. Use the method you originally signed up with.",
  noAccount: "We couldn't find an account for that Google/GitHub email. Choose how you want to join below.",
  oauthCancelled: "Sign-in was cancelled. Please try again.",
  generic: "Something went wrong on our side. Please try again in a moment.",
} as const;

const NETWORK_RE = /failed to fetch|networkerror|network request failed|load failed|fetch failed|econnrefused|enotfound|etimedout|timeout|err_internet|network/i;
const TECHNICAL_RE =
  /unauthori[sz]ed|forbidden|internal server error|bad gateway|service unavailable|gateway time|unexpected token|unexpected end|is not valid json|json|<!doctype|<html|status code|^\s*\d{3}\b|prisma|invalid `|typeerror|referenceerror|syntaxerror|undefined|\bnull\b|\[object|stack|econn|nextauth|configuration|callback|sessionrequired|credentialssignin|oauth\w*/i;

export function isNetworkError(err: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  return NETWORK_RE.test(msg);
}

export function humanizeAuthError(raw?: unknown, fallback: string = AUTH_MESSAGES.generic): string {
  if (raw === undefined || raw === null || raw === "") return fallback;

  if (isNetworkError(raw)) return AUTH_MESSAGES.network;

  const msg = (raw instanceof Error ? raw.message : String(raw)).trim();

  switch (msg) {
    case AUTH_ERROR.EMAIL_NOT_FOUND:
      return AUTH_MESSAGES.emailNotFound;
    case AUTH_ERROR.WRONG_PASSWORD:
    case "CredentialsSignin":
      return AUTH_MESSAGES.wrongPassword;
    case AUTH_ERROR.NO_PASSWORD:
      return AUTH_MESSAGES.noPassword;
    case AUTH_ERROR.SUSPENDED:
      return AUTH_MESSAGES.suspended;
    case AUTH_ERROR.MISSING:
      return AUTH_MESSAGES.missing;
    case "SessionRequired":
      return AUTH_MESSAGES.sessionExpired;
    case "OAuthAccountNotLinked":
      return AUTH_MESSAGES.oauthLinked;
    case "NoAccount":
      return AUTH_MESSAGES.noAccount;
    case "AccessDenied":
      return AUTH_MESSAGES.oauthCancelled;
    case "Callback":
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Configuration":
    case "Verification":
    case "Default":
      return fallback;
  }

  if (/already exists/i.test(msg)) return AUTH_MESSAGES.emailExists;
  if (/suspended/i.test(msg)) return AUTH_MESSAGES.suspended;
  if (TECHNICAL_RE.test(msg)) return fallback;

  // Short, plain-sentence validation messages from our own API ("Password must
  // be at least 6 characters", "Invalid verification code") are fine to show.
  return msg.length <= 140 ? msg : fallback;
}

/** Parse a fetch Response without ever throwing on HTML/empty error bodies. */
export async function readJsonSafe<T = Record<string, unknown>>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
