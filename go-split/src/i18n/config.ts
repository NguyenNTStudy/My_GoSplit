// URLs never carry a language (R28): the locale comes from a cookie, then the browser.

export const LOCALES = ["vi", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Used when the browser asks for a language the app doesn't have (R28). */
export const DEFAULT_LOCALE: Locale = "en";

/** Device-level choice; signed-in users also get it saved on their account (task 5, after auth). */
export const LOCALE_COOKIE = "locale";

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

/**
 * Picks the first supported language from an Accept-Language header, honouring q-values,
 * e.g. `fr-FR, vi;q=0.8` → `vi`. Anything else falls back to English (R28).
 */
export function negotiateLocale(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;
  const ranked = acceptLanguage
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return {
        language: tag.toLowerCase().split("-")[0],
        q: q ? Number(q.slice(2)) : 1,
        index,
      };
    })
    .filter((entry) => entry.language && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return ranked.map((entry) => entry.language).find(isLocale) ?? DEFAULT_LOCALE;
}
