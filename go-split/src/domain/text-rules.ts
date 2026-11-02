// Length rules for user-entered names (R73, R94). Text is counted in Unicode code points
// after NFC normalization, so `ệ` counts as one character whichever keyboard typed it;
// this matches how Postgres counts VARCHAR(n).

export const PLAN_NAME_MAX_LENGTH = 50;
export const BASIC_DESCRIPTION_MAX_LENGTH = 100;

export type TextError = "empty" | "too_long";

export type TextResult =
  { ok: true; value: string } | { ok: false; error: TextError; length: number };

/** Characters after NFC normalization. */
export function countChars(text: string): number {
  return Array.from(text.normalize("NFC")).length;
}

function normalizeInput(raw: string): string {
  return raw.normalize("NFC").trim();
}

/**
 * Plan name: 1–50 characters after trimming (R73). Returns the value to store (NFC, trimmed);
 * text that is too long is rejected, never cut.
 */
export function validatePlanName(raw: string): TextResult {
  const value = normalizeInput(raw);
  const length = countChars(value);
  if (length === 0) return { ok: false, error: "empty", length };
  if (length > PLAN_NAME_MAX_LENGTH)
    return { ok: false, error: "too_long", length };
  return { ok: true, value };
}

/** Itinerary titles follow the plan name rule (R64, R73). */
export const validateItineraryTitle = validatePlanName;

/** Basic plan's short description: optional, at most 100 characters (R94). Empty becomes `null`. */
export function validateBasicDescription(
  raw: string | null | undefined,
):
  | { ok: true; value: string | null }
  | { ok: false; error: "too_long"; length: number } {
  const value = normalizeInput(raw ?? "");
  const length = countChars(value);
  if (length === 0) return { ok: true, value: null };
  if (length > BASIC_DESCRIPTION_MAX_LENGTH)
    return { ok: false, error: "too_long", length };
  return { ok: true, value };
}
