import type { CatId } from "./types";

export const CAT_ALIASES: Record<string, CatId> = {
  bed:"beds", beds:"beds",
  sofa:"sofas", sofas:"sofas", couch:"sofas", lounge:"sofas",
  wardrobe:"wardrobes", wardrobes:"wardrobes", closet:"wardrobes", cabinet:"wardrobes",
  tv:"tv-units", "tv unit":"tv-units", "tv units":"tv-units", media:"tv-units", entertainment:"tv-units",
  dining:"dining", "dining table":"dining", "dining tables":"dining", table:"dining",
  coffee:"coffee-tables", "coffee table":"coffee-tables", "coffee tables":"coffee-tables",
};

export function resolveCategory(q: string): CatId | null {
  const t = q.trim().toLowerCase();
  if (CAT_ALIASES[t]) return CAT_ALIASES[t];

  for (const [key, id] of Object.entries(CAT_ALIASES)) {
    if (t.includes(key) || key.includes(t)) return id;
  }

  return null;
}
