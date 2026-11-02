/**
 * Normalizes free text for accent-free, case-insensitive search (R34): `Đà  Lạt` → `da lat`.
 * Used for stay areas, food guides, itineraries, recruit posts and currency search.
 */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
