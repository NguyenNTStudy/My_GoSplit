import { validateAmount, type AmountError } from "./amounts";
import type { CurrencyRules } from "./currency-rules";
import { Dec, type DecimalInput } from "./decimal";
import type { PersonSummary } from "./summary";

export type Settlement = {
  participantId: string;
  kind: "contribution" | "refund";
  amount: Dec;
};

/**
 * "Đã đóng đủ" records a contribution of exactly the shortage; "Đã trả lại" a refund of exactly
 * the surplus (R23). Either way the person is settled afterwards. Null when there is nothing to record.
 */
export function settlementFor(
  person: Pick<PersonSummary, "participantId" | "shortage" | "surplus">,
): Settlement | null {
  if (person.shortage.gt(0)) {
    return {
      participantId: person.participantId,
      kind: "contribution",
      amount: person.shortage,
    };
  }
  if (person.surplus.gt(0)) {
    return {
      participantId: person.participantId,
      kind: "refund",
      amount: person.surplus,
    };
  }
  return null;
}

export type ContributionBatchInput =
  /** "Cùng số tiền": everyone ticked pays the same amount. */
  | { mode: "same"; amount: DecimalInput; participantIds: readonly string[] }
  /** "Mỗi người một số": empty or zero amounts are skipped. */
  | {
      mode: "each";
      amounts: readonly {
        participantId: string;
        amount: DecimalInput | null;
      }[];
    };

export type BatchIssue = {
  code:
    | AmountError
    | "no_participants"
    | "duplicate_participant"
    | "nothing_to_record";
  participantId?: string;
};

export type ContributionBatch = {
  rows: { participantId: string; amount: Dec }[];
  /** Shown before saving (R75). */
  total: Dec;
};

/**
 * Rows for "Ghi tiền đóng" (R75): one contribution per person, none for zero amounts.
 * The server stores them in one transaction with a shared batchId.
 */
export function buildContributionBatch(
  input: ContributionBatchInput,
  rules: Pick<CurrencyRules, "minorUnits">,
):
  { ok: true; batch: ContributionBatch } | { ok: false; issues: BatchIssue[] } {
  const entries =
    input.mode === "same"
      ? input.participantIds.map((participantId) => ({
          participantId,
          amount: input.amount,
        }))
      : input.amounts.filter((e) => !isBlankOrZero(e.amount));

  const issues: BatchIssue[] = [];
  if (
    (input.mode === "same" ? input.participantIds : input.amounts).length === 0
  ) {
    issues.push({ code: "no_participants" });
  }
  const seen = new Set<string>();
  const rows: ContributionBatch["rows"] = [];
  for (const entry of entries) {
    if (seen.has(entry.participantId)) {
      issues.push({
        code: "duplicate_participant",
        participantId: entry.participantId,
      });
      continue;
    }
    seen.add(entry.participantId);
    const result = validateAmount(entry.amount as DecimalInput, rules);
    if (result.ok)
      rows.push({ participantId: entry.participantId, amount: result.value });
    else
      issues.push({
        code: result.error,
        participantId: input.mode === "each" ? entry.participantId : undefined,
      });
  }
  if (issues.length === 0 && rows.length === 0)
    issues.push({ code: "nothing_to_record" });

  if (issues.length > 0)
    return { ok: false, issues: dedupeSameAmountIssues(issues) };
  return {
    ok: true,
    batch: { rows, total: Dec.sum(...rows.map((r) => r.amount)) },
  };
}

function isBlankOrZero(amount: DecimalInput | null): boolean {
  if (amount === null || (typeof amount === "string" && amount.trim() === ""))
    return true;
  try {
    return new Dec(amount).isZero();
  } catch {
    return false;
  }
}

/** In "same" mode one bad amount fails every row the same way; report it once. */
function dedupeSameAmountIssues(issues: BatchIssue[]): BatchIssue[] {
  const keys = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.code}:${issue.participantId ?? ""}`;
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  });
}
