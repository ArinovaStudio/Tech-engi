/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fetch helper for the messaging screens. Unlike the shared SWR fetcher it:
 *  - gives up after a timeout, so a hung request can never leave a spinner forever
 *  - throws on HTTP errors / success:false instead of handing the error JSON to the UI
 *  - throws a message that is safe to show a user (never a raw "Unauthorized"/status text)
 */
export class ChatLoadError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ChatLoadError";
    this.status = status;
  }
}

export const CHAT_MESSAGES = {
  timeout: "Messages are taking too long to load. Check your connection and try again.",
  network: "We couldn't reach the server. Check your internet connection and try again.",
  session: "Your session has expired. Please log in again.",
  forbidden: "You don't have access to these messages.",
  notFound: "We couldn't find this conversation.",
  server: "Messages couldn't be loaded right now. Please try again.",
} as const;

export async function chatFetch<T = any>(url: string, timeoutMs = 10000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(url, { signal: controller.signal, cache: "no-store" });
  } catch (err) {
    if ((err as Error)?.name === "AbortError") throw new ChatLoadError(CHAT_MESSAGES.timeout);
    throw new ChatLoadError(CHAT_MESSAGES.network);
  } finally {
    clearTimeout(timer);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error page */
  }

  if (res.status === 401) throw new ChatLoadError(CHAT_MESSAGES.session, 401);
  if (res.status === 403) throw new ChatLoadError(CHAT_MESSAGES.forbidden, 403);
  if (res.status === 404) throw new ChatLoadError(CHAT_MESSAGES.notFound, 404);
  if (!res.ok || !data || data.success === false) throw new ChatLoadError(CHAT_MESSAGES.server, res.status);
  return data as T;
}

export function chatErrorMessage(err: unknown): string {
  return err instanceof ChatLoadError ? err.message : CHAT_MESSAGES.server;
}

/** Merge a freshly fetched page into the list: add unseen ids, refresh known ones, keep pending sends. */
export function mergeMessages<T extends { id: string; createdAt?: string | Date }>(prev: T[], incoming: T[]): T[] {
  const byId = new Map(incoming.map((m) => [m.id, m]));
  const seen = new Set<string>();
  const merged = prev.map((m) => {
    seen.add(m.id);
    return byId.get(m.id) ?? m;
  });
  const fresh = incoming.filter((m) => !seen.has(m.id));
  if (fresh.length === 0) return merged;
  // Pending (optimistic) messages are replaced by the real one with the same content.
  const withoutPending = merged.filter(
    (m: any) => !(m.isPending && fresh.some((f: any) => f.senderId === m.senderId && f.content === m.content)),
  );
  return [...withoutPending, ...fresh];
}

export const SEND_FAILED = "Your message couldn't be sent. Check your connection and try again.";
export const SEND_OFFLINE = "Chat is reconnecting. Your message wasn't sent, so please try again in a moment.";
