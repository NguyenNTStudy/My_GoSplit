import type { CurrencyRules } from "./currency-rules";
import { Dec, type DecimalInput } from "./decimal";

// Validation of entered numbers. Parsing localized input (`50.000`, `50k`) happens before
// this, in the i18n layer (R18, R74); these functions receive plain decimal values.

/** Amounts are stored as NUMERIC(14,3); ratios as NUMERIC(12,4). */
const MAX_AMOUNT = new Dec("99999999999.999");
const MAX_AMOUNT_DECIMALS = 3;
const MAX_RATIO = new Dec("99999999.9999");
const MAX_RATIO_DECIMALS = 4;

export type AmountError =
  | "not_a_number"
  | "not_positive"
  | "too_large"
  | "fraction_not_allowed"
  | "too_many_decimals";

export type RatioError =
  "not_a_number" | "not_positive" | "too_large" | "too_many_decimals";

export type Validated<T, E> = { ok: true; value: T } | { ok: false; error: E };

function toDecimal(value: DecimalInput): Dec | null {
  try {
    const decimal = new Dec(value);
    return decimal.isFinite() ? decimal : null;
  } catch {
    return null;
  }
}

/**
 * Amount of an expense or contribution in the plan's currency (R14, R18): positive;
 * whole numbers for currencies without minor units (VND, JPY, KRW), otherwise at most 3 decimals.
 */
export function validateAmount(
  value: DecimalInput,
  rules: Pick<CurrencyRules, "minorUnits">,
): Validated<Dec, AmountError> {
  const amount = toDecimal(value);
  if (!amount) return { ok: false, error: "not_a_number" };
  if (amount.lte(0)) return { ok: false, error: "not_positive" };
  if (amount.gt(MAX_AMOUNT)) return { ok: false, error: "too_large" };
  if (rules.minorUnits === 0 && !amount.isInteger())
    return { ok: false, error: "fraction_not_allowed" };
  if (amount.decimalPlaces() > MAX_AMOUNT_DECIMALS)
    return { ok: false, error: "too_many_decimals" };
  return { ok: true, value: amount };
}

/** Split ratio of one participant in an expense (R16): greater than 0, default 1. */
export function validateRatio(value: DecimalInput): Validated<Dec, RatioError> {
  const ratio = toDecimal(value);
  if (!ratio) return { ok: false, error: "not_a_number" };
  if (ratio.lte(0)) return { ok: false, error: "not_positive" };
  if (ratio.gt(MAX_RATIO)) return { ok: false, error: "too_large" };
  if (ratio.decimalPlaces() > MAX_RATIO_DECIMALS)
    return { ok: false, error: "too_many_decimals" };
  return { ok: true, value: ratio };
}
