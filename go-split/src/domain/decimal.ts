import Decimal from "decimal.js";

/**
 * Decimal for all money math. Amounts keep full precision until the final result (R18):
 * NUMERIC(14,3) amounts split by ratios need far more than decimal.js's default 20 digits.
 */
export const Dec = Decimal.clone({
  precision: 50,
  rounding: Decimal.ROUND_HALF_UP,
});
export type Dec = InstanceType<typeof Dec>;

export type DecimalInput = Decimal.Value;
