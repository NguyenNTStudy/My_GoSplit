// Display formatting for money and trip dates (R28, R74). Pure functions: usable on the
// server, in the browser and in exported images.

import { findCurrency, getCurrencyRules } from "@/domain/currency";
import { Dec, type DecimalInput } from "@/domain/decimal";

import type { Locale } from "./config";

const SHORT_SUFFIX: Record<Locale, string> = { vi: "k", en: "K" };

/**
 * Formats an amount in the plan's currency. The symbol is the same in every language (R28);
 * fractions show only for currencies that have them; multiples of 1,000 are shortened
 * without losing digits: `50k ₫`, `5.250k ₫` in Vietnamese, `₫50K`, `$2K` in English (R74).
 */
export function formatMoney(
  amount: DecimalInput,
  currency: string,
  locale: Locale,
  { shorten = true }: { shorten?: boolean } = {},
): string {
  const value = new Dec(amount);
  const { minorUnits } = getCurrencyRules(currency);
  const thousands = value.div(1000);
  const short = shorten && !value.isZero() && thousands.isInteger();

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: short ? 0 : minorUnits,
    maximumFractionDigits: short ? 0 : minorUnits > 0 ? 3 : 0,
  });
  const symbol = findCurrency(currency)?.narrowSymbol;
  const parts = formatter.formatToParts(
    (short ? thousands : value).toFixed() as `${number}`,
  );
  // The k/K suffix goes right after the last digit, wherever the symbol sits.
  const lastDigits = parts.findLastIndex(
    (part) => part.type === "integer" || part.type === "fraction",
  );
  return parts
    .map((part, index) => {
      const text = part.type === "currency" && symbol ? symbol : part.value;
      return short && index === lastDigits ? text + SHORT_SUFFIX[locale] : text;
    })
    .join("");
}

// --- Trip dates ("YYYY-MM-DD", trip-local, never converted between time zones) ---

const VI_WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function toUtcDate(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

const pad = (n: number) => String(n).padStart(2, "0");

/** `T7 05/12` in Vietnamese, `Sat, Dec 5` in English: day headers and short lists. */
export function formatTripDay(date: string, locale: Locale): string {
  const d = toUtcDate(date);
  if (locale === "vi") {
    return `${VI_WEEKDAYS[d.getUTCDay()]} ${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}`;
  }
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** `05/12/2026` in Vietnamese, `Dec 5, 2026` in English. */
export function formatTripDate(date: string, locale: Locale): string {
  const d = toUtcDate(date);
  if (locale === "vi") {
    return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** `12–14/12/2026`, `30/11–02/12/2026` in Vietnamese; `Dec 12 – 14, 2026` in English. */
export function formatTripDateRange(
  start: string,
  end: string,
  locale: Locale,
): string {
  const a = toUtcDate(start);
  const b = toUtcDate(end);
  if (locale === "vi") {
    const year = b.getUTCFullYear();
    if (a.getUTCFullYear() !== year) {
      return `${formatTripDate(start, locale)}–${formatTripDate(end, locale)}`;
    }
    const left =
      a.getUTCMonth() === b.getUTCMonth()
        ? pad(a.getUTCDate())
        : `${pad(a.getUTCDate())}/${pad(a.getUTCMonth() + 1)}`;
    return `${left}–${pad(b.getUTCDate())}/${pad(b.getUTCMonth() + 1)}/${year}`;
  }
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).formatRange(a, b);
}

/** Activity times are stored as `HH:mm`: `06:00` in Vietnamese, `6:00 AM` in English. */
export function formatTripTime(time: string, locale: Locale): string {
  const [h, m] = time.split(":").map(Number);
  return new Intl.DateTimeFormat(locale, {
    hour: locale === "vi" ? "2-digit" : "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 1, h, m)));
}
