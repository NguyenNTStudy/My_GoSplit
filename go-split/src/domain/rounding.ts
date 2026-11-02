import { Dec, type DecimalInput } from "./decimal";

// The only place money is rounded (R18, R19). Spend and shortages round up, surpluses round
// down, so the collector may receive slightly more than needed; that difference is theirs.

/** Smallest multiple of `step` that is not less than `value`, e.g. 79,200 → 80,000 with step 1,000. */
export function roundUpToStep(value: DecimalInput, step: DecimalInput): Dec {
  const s = new Dec(step);
  return new Dec(value).div(s).ceil().mul(s);
}

/** Largest multiple of `step` that is not greater than `value`. */
export function roundDownToStep(value: DecimalInput, step: DecimalInput): Dec {
  const s = new Dec(step);
  return new Dec(value).div(s).floor().mul(s);
}
