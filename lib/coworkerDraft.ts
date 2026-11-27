// Carries the /co-worker booking form into the existing project-creation flow
// (CreateProjectModal for clients, HireEngineerModal for engineers).
export type CoWorkerDraft = {
  title: string;
  description: string;
  budget: number;
  /** Email entered in the booking form. The draft is only released to the account that owns it. */
  email: string;
};

const KEY = "te_coworker_draft";

const sameEmail = (a?: string | null, b?: string | null) =>
  !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

export function saveCoWorkerDraft(draft: CoWorkerDraft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    /* storage unavailable: the user can still fill the form manually */
  }
}

function readDraft(): CoWorkerDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (
      typeof d?.title === "string" &&
      typeof d?.description === "string" &&
      typeof d?.email === "string" &&
      Number.isFinite(d?.budget)
    ) {
      return d as CoWorkerDraft;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** True only if a draft exists AND belongs to this email. */
export function hasCoWorkerDraft(userEmail?: string | null): boolean {
  const d = readDraft();
  return !!d && sameEmail(d.email, userEmail);
}

/** Reads the draft once and removes it, but only if it belongs to this email. */
export function takeCoWorkerDraft(userEmail?: string | null): CoWorkerDraft | null {
  const d = readDraft();
  if (!d || !sameEmail(d.email, userEmail)) return null; // someone else's draft: leave it alone
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return d;
}
