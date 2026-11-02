import { describe, expect, it } from "vitest";

import { buildContributionBatch, settlementFor } from "./contributions";
import {
  summarizePlan,
  type SummaryContribution,
  type SummaryExpense,
} from "./summary";

const VND = { code: "VND", minorUnits: 0, roundingStep: "1000" };
const USD = { code: "USD", minorUnits: 2, roundingStep: "0.5" };

const equal = (...ids: string[]) =>
  ids.map((participantId) => ({ participantId, ratio: 1 }));

describe("Đã đóng đủ và Đã trả lại", () => {
  it("R23 ghi đúng số còn thiếu hoặc số dư, sau đó người đó đủ", () => {
    const participants = [
      { participantId: "An", status: "active" as const },
      { participantId: "Binh", status: "active" as const },
      { participantId: "Chi", status: "active" as const },
    ];
    const expenses: SummaryExpense[] = [
      {
        amount: "10",
        paidByParticipantId: "An",
        shares: equal("An", "Binh", "Chi"),
      },
    ];
    const contributions: SummaryContribution[] = [
      { participantId: "Binh", kind: "contribution", amount: "3.2" },
    ];
    const before = summarizePlan({
      rules: USD,
      participants,
      expenses,
      contributions,
    });

    const binh = settlementFor(before.people[1]);
    const an = settlementFor(before.people[0]);
    expect(binh).toMatchObject({ participantId: "Binh", kind: "contribution" });
    expect(binh?.amount.toString()).toBe("0.5");
    expect(an).toMatchObject({ participantId: "An", kind: "refund" });
    expect(an?.amount.toString()).toBe("6.5");

    const after = summarizePlan({
      rules: USD,
      participants,
      expenses,
      contributions: [...contributions, binh!, an!].map((c) => ({
        ...c,
        amount: c.amount.toString(),
      })),
    });
    expect(after.people[0]).toMatchObject({ settled: true });
    expect(after.people[0].surplus.toString()).toBe("0");
    expect(after.people[1]).toMatchObject({ settled: true });
    expect(after.people[1].shortage.toString()).toBe("0");
    expect(settlementFor(after.people[1])).toBeNull();
  });

  it("R23 người đã đủ thì không có gì để ghi", () => {
    const summary = summarizePlan({
      rules: VND,
      participants: [{ participantId: "An", status: "active" }],
      expenses: [],
      contributions: [],
    });
    expect(settlementFor(summary.people[0])).toBeNull();
  });
});

describe("Ghi tiền đóng", () => {
  it("R75 cùng số tiền: mỗi người được tích một khoản", () => {
    const result = buildContributionBatch(
      { mode: "same", amount: "500000", participantIds: ["An", "Binh", "Chi"] },
      VND,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.batch.rows.map((r) => [r.participantId, r.amount.toString()]),
    ).toEqual([
      ["An", "500000"],
      ["Binh", "500000"],
      ["Chi", "500000"],
    ]);
    expect(result.batch.total.toString()).toBe("1500000");
  });

  it("R75 mỗi người một số: bỏ qua ô trống hoặc bằng 0", () => {
    const result = buildContributionBatch(
      {
        mode: "each",
        amounts: [
          { participantId: "An", amount: "300000" },
          { participantId: "Binh", amount: "0" },
          { participantId: "Chi", amount: "" },
          { participantId: "Dung", amount: null },
          { participantId: "Minh", amount: "150000" },
        ],
      },
      VND,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.batch.rows.map((r) => r.participantId)).toEqual([
      "An",
      "Minh",
    ]);
    expect(result.batch.total.toString()).toBe("450000");
  });

  it("R75 R18 báo số tiền sai theo từng người", () => {
    const result = buildContributionBatch(
      {
        mode: "each",
        amounts: [
          { participantId: "An", amount: "300000.5" },
          { participantId: "Binh", amount: "-1000" },
        ],
      },
      VND,
    );
    expect(result).toEqual({
      ok: false,
      issues: [
        { code: "fraction_not_allowed", participantId: "An" },
        { code: "not_positive", participantId: "Binh" },
      ],
    });
  });

  it("R75 cùng số tiền bằng 0 hoặc không ai được tích thì không ghi", () => {
    expect(
      buildContributionBatch(
        { mode: "same", amount: "0", participantIds: ["An", "Binh"] },
        VND,
      ),
    ).toEqual({
      ok: false,
      issues: [{ code: "not_positive" }],
    });
    expect(
      buildContributionBatch(
        { mode: "same", amount: "100000", participantIds: [] },
        VND,
      ),
    ).toEqual({ ok: false, issues: [{ code: "no_participants" }] });
    expect(
      buildContributionBatch(
        { mode: "each", amounts: [{ participantId: "An", amount: "0" }] },
        VND,
      ),
    ).toEqual({ ok: false, issues: [{ code: "nothing_to_record" }] });
  });

  it("một người không được ghi hai lần trong cùng một lần", () => {
    const result = buildContributionBatch(
      { mode: "same", amount: "1000", participantIds: ["An", "An"] },
      VND,
    );
    expect(result).toEqual({
      ok: false,
      issues: [{ code: "duplicate_participant", participantId: "An" }],
    });
  });
});
