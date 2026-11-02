/** What money math needs to know about a plan's currency (R1, R18, R19). */
export type CurrencyRules = {
  /** ISO 4217 code, e.g. `VND`. */
  code: string;
  /** Digits after the decimal point that amounts may have: 0 for VND, JPY, KRW; otherwise up to 3 (R18). */
  minorUnits: number;
  /** Final amounts round to a multiple of this, as a decimal string: `0.5`, `1000` for VND, `10` for JPY (R19). */
  roundingStep: string;
};
