import { normalizeSearchText } from "./search-text";

// Matching dishes and places across food guides, itineraries and a plan's food list
// (R35, R41, R79). Names are compared after accent-free normalization (R34).

export type MealSlot = "morning" | "afternoon" | "evening";

/** A food guide needs entries from at least this many distinct places (R35). */
export const MIN_GUIDE_PLACES = 3;

type DishAndPlace = { dishName: string; placeName?: string | null };

function placeKey(placeName: string | null | undefined): string {
  return normalizeSearchText(placeName ?? "");
}

function foodKey(food: DishAndPlace): string {
  return `${normalizeSearchText(food.dishName)}\u0000${placeKey(food.placeName)}`;
}

/** Distinct places in a guide; several dishes at one place count once (R35). */
export function countDistinctPlaces(
  entries: readonly { placeName: string | null | undefined }[],
): number {
  return new Set(
    entries
      .map((entry) => placeKey(entry.placeName))
      .filter((key) => key !== ""),
  ).size;
}

export function hasEnoughPlaces(
  entries: readonly { placeName: string | null | undefined }[],
): boolean {
  return countDistinctPlaces(entries) >= MIN_GUIDE_PLACES;
}

/** Same dish at the same place (both without a place also counts as the same). */
export function isSameFood(a: DishAndPlace, b: DishAndPlace): boolean {
  return foodKey(a) === foodKey(b);
}

/**
 * Prepares guide entries or itinerary foods for a plan's food list (R41, R79): each item gets
 * the next `order` after the plan's existing items, and `alreadyInPlan` when the plan (or an
 * earlier item in the same batch) already has that dish at that place. The caller decides
 * whether flagged items are added.
 */
export function prepareFoodsToAdd<T extends DishAndPlace>(
  existing: readonly (DishAndPlace & { order: number })[],
  items: readonly T[],
): (T & { order: number; alreadyInPlan: boolean })[] {
  const seen = new Set(existing.map(foodKey));
  let order = existing.reduce((max, food) => Math.max(max, food.order), -1);
  return items.map((item) => {
    const key = foodKey(item);
    const alreadyInPlan = seen.has(key);
    seen.add(key);
    order += 1;
    return { ...item, order, alreadyInPlan };
  });
}
