// Reads an amount typed into a money field (R18, R74). Limits and decimal places are
// checked afterwards by validateAmount (amounts.ts).

import { Dec } from "./decimal";

export type AmountInputError = "empty" | "invalid";
export type AmountInputResult =
  { ok: true; value: string } | { ok: false; error: AmountInputError };

/** Decimal separator people expect in each language; the other one groups thousands. */
const DECIMAL_SEPARATOR = { vi: ",", en: "." } as const;

/**
 * Accepts `50.000`, `50,000`, `398.50`, `398,5` and a `k`/`K` suffix (`50k` = 50,000).
 * For currencies without fractions both `.` and `,` group thousands (R18). For others, a
 * separator is the decimal point when it's the last of two kinds, or the only one and not
 * followed by exactly three digits; `1.234` alone follows the language's convention.
 */
export function parseAmountInput(
  text: string,
  {
    locale,
    minorUnits,
  }: { locale: keyof typeof DECIMAL_SEPARATOR; minorUnits: number },
): AmountInputResult {
  const compact = text.replace(/\s+/g, "").replace(/\p{Sc}/gu, "");
  if (compact === "") return { ok: false, error: "empty" };

  const match = /^(\d[\d.,]*)([kK])?$/.exec(compact);
  if (!match) return { ok: false, error: "invalid" };
  const [, number, k] = match;

  const decimal = decimalSeparatorOf(
    number,
    locale,
    minorUnits > 0 || Boolean(k),
  );
  const normalized = [...number]
    .map((ch) => (ch === decimal ? "." : ch === "." || ch === "," ? "" : ch))
    .join("");
  if (!/^\d+(\.\d+)?$/.test(normalized)) return { ok: false, error: "invalid" };

  const value = new Dec(normalized).mul(k ? 1000 : 1);
  return { ok: true, value: value.toFixed() };
}

function decimalSeparatorOf(
  number: string,
  locale: keyof typeof DECIMAL_SEPARATOR,
  fractionsAllowed: boolean,
): "." | "," | null {
  if (!fractionsAllowed) return null;
  const separators = [...number].filter((ch) => ch === "." || ch === ",");
  if (separators.length === 0) return null;
  const kinds = new Set(separators);
  const last = separators[separators.length - 1] as "." | ",";
  if (kinds.size === 2) return last;
  if (separators.length > 1) return null;
  const digitsAfter = number.length - number.lastIndexOf(last) - 1;
  if (digitsAfter !== 3) return last;
  return DECIMAL_SEPARATOR[locale] === last ? last : null;
}
