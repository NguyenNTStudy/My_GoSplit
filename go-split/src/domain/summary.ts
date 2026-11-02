import type { CurrencyRules } from "./currency-rules";
import { Dec, type DecimalInput } from "./decimal";
import { splitExpense, type ShareInput } from "./expense-split";
import { roundDownToStep, roundUpToStep } from "./rounding";

export type SummaryParticipant = {
  participantId: string;
  /** People who left still appear and still owe or get back money (R13). */
  status: "active" | "inactive";
};

export type SummaryExpense = {
  amount: DecimalInput;
  paidByParticipantId: string;
  shares: readonly ShareInput[];
};

export type SummaryContribution = {
  participantId: string;
  kind: "contribution" | "refund";
  amount: DecimalInput;
};

export type PersonSummary = {
  participantId: string;
  status: SummaryParticipant["status"];
  /** Sum of the person's shares, rounded up to the currency step (R19). */
  spend: Dec;
  /** Contributions − refunds + expenses the person paid themselves (R76). Not rounded. */
  paid: Dec;
  /** Still owed to the collector, rounded up; 0 when settled. */
  shortage: Dec;
  /** To be given back by the collector, rounded down; 0 when there is none. */
  surplus: Dec;
  /** Paid is not less than spend (R23). People with a surplus are settled too. */
  settled: boolean;
};

export type PlanSummary = {
  /** Sum of all expenses as entered; already within the currency's decimals. */
  totalExpenses: Dec;
  /** Contributions − refunds of everyone: money the collector is holding (R54, R75, R76). */
  collectorHolds: Dec;
  settledCount: number;
  shortCount: number;
  /** Same order as the participants given. */
  people: PersonSummary[];
};

/**
 * Exact shares can carry division noise far past the 3 decimals amounts have (100/3 summed
 * back can give 100.000…001). Trimming it before rounding up keeps a whole 100 from becoming
 * 100 plus one step.
 */
const NOISE_DECIMALS = 20;

/**
 * Per-person summary (R76) with the final rounding (R18, R19):
 * - spend = exact spend rounded up;
 * - diff = paid − spend; below 0 the shortage is −diff rounded up, above 0 the surplus is
 *   diff rounded down;
 * - a person is settled when the shortage is 0.
 * Rounding only ever favours the collector, so the group may collect slightly more than it spent.
 */
export function summarizePlan(input: {
  rules: Pick<CurrencyRules, "roundingStep">;
  participants: readonly SummaryParticipant[];
  expenses: readonly SummaryExpense[];
  contributions: readonly SummaryContribution[];
}): PlanSummary {
  const step = input.rules.roundingStep;
  const spendExact = new Map<string, Dec>();
  const paid = new Map<string, Dec>();
  for (const p of input.participants) {
    spendExact.set(p.participantId, new Dec(0));
    paid.set(p.participantId, new Dec(0));
  }
  const add = (totals: Map<string, Dec>, participantId: string, value: Dec) => {
    const current = totals.get(participantId);
    if (!current) throw new RangeError(`Unknown participant ${participantId}`);
    totals.set(participantId, current.add(value));
  };

  let totalExpenses = new Dec(0);
  for (const expense of input.expenses) {
    const amount = new Dec(expense.amount);
    totalExpenses = totalExpenses.add(amount);
    add(paid, expense.paidByParticipantId, amount);
    for (const { participantId, share } of splitExpense(
      amount,
      expense.shares,
    )) {
      add(spendExact, participantId, share);
    }
  }

  let collectorHolds = new Dec(0);
  for (const c of input.contributions) {
    const amount =
      c.kind === "refund" ? new Dec(c.amount).neg() : new Dec(c.amount);
    add(paid, c.participantId, amount);
    collectorHolds = collectorHolds.add(amount);
  }

  const people = input.participants.map((p): PersonSummary => {
    const exact = spendExact
      .get(p.participantId)!
      .toDecimalPlaces(NOISE_DECIMALS);
    const spend = roundUpToStep(exact, step);
    const personPaid = paid.get(p.participantId)!;
    const diff = personPaid.sub(spend);
    const shortage = diff.lt(0) ? roundUpToStep(diff.neg(), step) : new Dec(0);
    const surplus = diff.gt(0) ? roundDownToStep(diff, step) : new Dec(0);
    return {
      participantId: p.participantId,
      status: p.status,
      spend,
      paid: personPaid,
      shortage,
      surplus,
      settled: shortage.isZero(),
    };
  });

  const settledCount = people.filter((p) => p.settled).length;
  return {
    totalExpenses,
    collectorHolds,
    settledCount,
    shortCount: people.length - settledCount,
    people,
  };
}
