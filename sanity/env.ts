export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-03-15";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

export const useCdn = process.env.NODE_ENV === "production";

/**
 * Returns true if Sanity project ID is configured in environment variables.
 * Enables graceful fallback when credentials haven't been added yet.
 */
export function isSanityConfigured(): boolean {
  return Boolean(
    projectId &&
      projectId.trim() !== "" &&
      projectId !== "your_sanity_project_id_here"
  );
}
