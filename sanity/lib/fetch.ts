import { client } from "./client";
import { isSanityConfigured } from "../env";

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
  fallback = null,
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
  fallback?: unknown;
}): Promise<T> {
  // Graceful fallback when credentials haven't been added yet
  if (!isSanityConfigured()) {
    return fallback as T;
  }

  try {
    return await client.fetch<T>(query, params, {
      next: {
        revalidate: typeof revalidate === "number" ? revalidate : undefined,
        tags,
      },
    });
  } catch (error) {
    console.warn(
      "[Sanity] Fetch failed. Check your NEXT_PUBLIC_SANITY_PROJECT_ID and network connection:",
      error instanceof Error ? error.message : error
    );
    return fallback as T;
  }
}
