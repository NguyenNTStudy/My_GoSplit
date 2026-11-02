import { Dec, type DecimalInput } from "./decimal";

export type ShareInput = {
  participantId: string;
  /** Greater than 0; 1 by default (R16). */
  ratio: DecimalInput;
};

export type ParticipantShare = {
  participantId: string;
  /** Not rounded: rounding happens only on final results (R18). */
  share: Dec;
};

/**
 * Each participant's share of an expense: amount × ratio / sum of the selected ratios (R17).
 * Multiplies before dividing so shares that come out whole stay exact.
 */
export function splitExpense(
  amount: DecimalInput,
  shares: readonly ShareInput[],
): ParticipantShare[] {
  if (shares.length === 0)
    throw new RangeError("An expense needs at least one participant (R14)");
  if (new Set(shares.map((s) => s.participantId)).size !== shares.length) {
    throw new RangeError("A participant appears twice in the same expense");
  }
  const ratios = shares.map((s) => new Dec(s.ratio));
  if (ratios.some((ratio) => ratio.lte(0)))
    throw new RangeError("Ratios must be greater than 0 (R16)");

  const totalRatio = Dec.sum(...ratios);
  const value = new Dec(amount);
  return shares.map((s, i) => ({
    participantId: s.participantId,
    share: value.mul(ratios[i]).div(totalRatio),
  }));
}
