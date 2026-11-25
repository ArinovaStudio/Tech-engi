import { getAdvanceAmount } from "@/lib/promoCodes";

// Stable 32-bit hash so the "random" preview doesn't change on every refresh.
function seedFrom(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

const LEVELS = ["1-2 yrs", "2-4 yrs", "3-5 yrs", "5+ yrs"];
const FALLBACK_SKILLS = ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "Python"];

export interface PreviewCard {
  id: string;
  initials: string;
  skills: string[];
  experience: string;
  completedProjects: number;
}

/**
 * Preview shown BEFORE payment. Deliberately contains no real engineer data
 * (names, photos, ids), so blurring is only cosmetic and nothing can be
 * recovered from the response.
 */
export function buildHirePreview(projectId: string, instruments: string[], budget: number) {
  const rand = rng(seedFrom(projectId));
  const profileCount = 12 + Math.floor(rand() * 37); // 12-48
  const cardCount = 3 + Math.floor(rand() * 2); // 3-4
  const pool = instruments.length ? instruments : FALLBACK_SKILLS;

  const cards: PreviewCard[] = Array.from({ length: cardCount }, (_, i) => {
    const skills = [...pool].sort(() => rand() - 0.5).slice(0, 3);
    return {
      id: `preview-${i}`,
      initials: "••",
      skills,
      experience: LEVELS[Math.floor(rand() * LEVELS.length)],
      completedProjects: Math.floor(rand() * 15),
    };
  });

  return { profileCount, cards, advanceAmount: getAdvanceAmount(budget) };
}
