import { describe, expect, it } from "vitest";

import { splitExpense } from "./expense-split";
import {
  summarizePlan,
  type SummaryContribution,
  type SummaryExpense,
  type SummaryParticipant,
} from "./summary";

const VND = { roundingStep: "1000" };
const USD = { roundingStep: "0.5" };

const people = (...ids: string[]): SummaryParticipant[] =>
  ids.map((participantId) => ({ participantId, status: "active" }));
const equal = (...ids: string[]) =>
  ids.map((participantId) => ({ participantId, ratio: 1 }));

/** Rounded amounts of each person as plain strings, for readable expectations. */
function view(summary: ReturnType<typeof summarizePlan>) {
  return Object.fromEntries(
    summary.people.map((p) => [
      p.participantId,
      {
        spend: p.spend.toString(),
        paid: p.paid.toString(),
        shortage: p.shortage.toString(),
        surplus: p.surplus.toString(),
        settled: p.settled,
      },
    ]),
  );
}

describe("chia chi phí", () => {
  it("R17 phần chia bằng số tiền × tỷ lệ / tổng tỷ lệ", () => {
    const shares = splitExpense("300000", [
      { participantId: "An", ratio: 2 },
      { participantId: "Binh", ratio: 1 },
    ]);
    expect(shares.map((s) => s.share.toString())).toEqual(["200000", "100000"]);
  });

  it("R14 R16 cần ít nhất một người chia và tỷ lệ lớn hơn 0", () => {
    expect(() => splitExpense("1000", [])).toThrow(/R14/);
    expect(() =>
      splitExpense("1000", [{ participantId: "An", ratio: 0 }]),
    ).toThrow(/R16/);
  });
});

describe("tổng kết từng người", () => {
  // Bữa "Lẩu thứ 6" trên wireframe kế hoạch cơ bản (G15e, G16e).
  const expenses: SummaryExpense[] = [
    {
      amount: "640000",
      paidByParticipantId: "An",
      shares: equal("An", "Binh", "Chi", "Dung"),
    },
    {
      amount: "120000",
      paidByParticipantId: "Binh",
      shares: equal("An", "Binh", "Chi", "Dung"),
    },
    {
      amount: "180000",
      paidByParticipantId: "Chi",
      shares: equal("Binh", "Chi", "Dung"),
    },
    {
      amount: "90000",
      paidByParticipantId: "Dung",
      shares: equal("An", "Dung"),
    },
  ];

  it("R76 bữa Lẩu thứ 6: chi tiêu, đã đóng, còn thiếu và dư của từng người", () => {
    const summary = summarizePlan({
      rules: VND,
      participants: people("An", "Binh", "Chi", "Dung"),
      expenses,
      contributions: [],
    });

    expect(summary.totalExpenses.toString()).toBe("1030000");
    expect(view(summary)).toEqual({
      An: {
        spend: "235000",
        paid: "640000",
        shortage: "0",
        surplus: "405000",
        settled: true,
      },
      Binh: {
        spend: "250000",
        paid: "120000",
        shortage: "130000",
        surplus: "0",
        settled: false,
      },
      Chi: {
        spend: "250000",
        paid: "180000",
        shortage: "70000",
        surplus: "0",
        settled: false,
      },
      Dung: {
        spend: "295000",
        paid: "90000",
        shortage: "205000",
        surplus: "0",
        settled: false,
      },
    });
    expect(summary.settledCount).toBe(1);
    expect(summary.shortCount).toBe(3);
    expect(summary.collectorHolds.toString()).toBe("0");
  });

  it("R19 100.000 ₫ chia 3 người thì mỗi người 34.000", () => {
    const summary = summarizePlan({
      rules: VND,
      participants: people("An", "Binh", "Chi"),
      expenses: [
        {
          amount: "100000",
          paidByParticipantId: "An",
          shares: equal("An", "Binh", "Chi"),
        },
      ],
      contributions: [],
    });
    expect(summary.people.map((p) => p.spend.toString())).toEqual([
      "34000",
      "34000",
      "34000",
    ]);
    // An trả 100.000, chi tiêu 34.000: dư 66.000; hai người kia mỗi người thiếu 34.000.
    expect(view(summary).An.surplus).toBe("66000");
    expect(view(summary).Binh.shortage).toBe("34000");
  });

  it("R19 USD làm tròn theo bước 0,5: chi tiêu và thiếu làm tròn lên, dư làm tròn xuống", () => {
    const summary = summarizePlan({
      rules: USD,
      participants: people("An", "Binh", "Chi"),
      expenses: [
        {
          amount: "10",
          paidByParticipantId: "An",
          shares: equal("An", "Binh", "Chi"),
        },
      ],
      contributions: [
        { participantId: "Binh", kind: "contribution", amount: "3" },
        { participantId: "Chi", kind: "contribution", amount: "3.75" },
      ],
    });
    expect(view(summary)).toEqual({
      An: {
        spend: "3.5",
        paid: "10",
        shortage: "0",
        surplus: "6.5",
        settled: true,
      },
      Binh: {
        spend: "3.5",
        paid: "3",
        shortage: "0.5",
        surplus: "0",
        settled: false,
      },
      Chi: {
        spend: "3.5",
        paid: "3.75",
        shortage: "0",
        surplus: "0",
        settled: true,
      },
    });
    expect(summary.collectorHolds.toString()).toBe("6.75");
  });

  it("R18 sai số khi chia không đẩy chi tiêu lên thêm một bước", () => {
    // 3 khoản 32 USD chia 3: phần của mỗi người đúng bằng 32, nhưng cộng ba lần 32/3
    // ra 32,000…001; không cắt sai số thì làm tròn lên thành 32,5.
    const third = equal("An", "Binh", "Chi");
    const summary = summarizePlan({
      rules: USD,
      participants: people("An", "Binh", "Chi"),
      expenses: Array.from({ length: 3 }, () => ({
        amount: "32",
        paidByParticipantId: "Binh",
        shares: third,
      })),
      contributions: [],
    });
    expect(summary.people.map((p) => p.spend.toString())).toEqual([
      "32",
      "32",
      "32",
    ]);
    expect(view(summary).Binh.surplus).toBe("64");
  });

  it("R16 tỷ lệ khác 1: phòng đôi tính gấp đôi", () => {
    const summary = summarizePlan({
      rules: VND,
      participants: people("An", "Binh", "Chi"),
      expenses: [
        {
          amount: "1200000",
          paidByParticipantId: "An",
          shares: [
            { participantId: "An", ratio: 2 },
            { participantId: "Binh", ratio: 1 },
            { participantId: "Chi", ratio: 1 },
          ],
        },
      ],
      contributions: [],
    });
    expect(summary.people.map((p) => p.spend.toString())).toEqual([
      "600000",
      "300000",
      "300000",
    ]);
  });

  it("R13 R76 người đã rời kế hoạch vẫn được tính", () => {
    const participants: SummaryParticipant[] = [
      { participantId: "An", status: "active" },
      { participantId: "Minh", status: "inactive" },
    ];
    const summary = summarizePlan({
      rules: VND,
      participants,
      expenses: [
        {
          amount: "100000",
          paidByParticipantId: "An",
          shares: equal("An", "Minh"),
        },
      ],
      contributions: [],
    });
    expect(summary.people[1]).toMatchObject({
      status: "inactive",
      settled: false,
    });
    expect(summary.people[1].shortage.toString()).toBe("50000");
    expect(summary.shortCount).toBe(1);
  });

  it("R15 R76 người trả tiền không cần nằm trong số người chia", () => {
    const summary = summarizePlan({
      rules: VND,
      participants: people("An", "Binh"),
      expenses: [
        { amount: "200000", paidByParticipantId: "An", shares: equal("Binh") },
      ],
      contributions: [],
    });
    expect(view(summary)).toEqual({
      An: {
        spend: "0",
        paid: "200000",
        shortage: "0",
        surplus: "200000",
        settled: true,
      },
      Binh: {
        spend: "200000",
        paid: "0",
        shortage: "200000",
        surplus: "0",
        settled: false,
      },
    });
  });

  it("R23 R54 tiền đóng trừ tiền trả lại là số người thu tiền đang giữ", () => {
    const contributions: SummaryContribution[] = [
      { participantId: "An", kind: "contribution", amount: "500000" },
      { participantId: "Binh", kind: "contribution", amount: "500000" },
      { participantId: "An", kind: "refund", amount: "100000" },
    ];
    const summary = summarizePlan({
      rules: VND,
      participants: people("An", "Binh"),
      expenses: [
        {
          amount: "800000",
          paidByParticipantId: "An",
          shares: equal("An", "Binh"),
        },
      ],
      contributions,
    });
    expect(summary.collectorHolds.toString()).toBe("900000");
    expect(view(summary).An.paid).toBe("1200000");
  });

  it("báo lỗi khi khoản chi nhắc tới người không có trong kế hoạch", () => {
    expect(() =>
      summarizePlan({
        rules: VND,
        participants: people("An"),
        expenses: [
          { amount: "1000", paidByParticipantId: "Lan", shares: equal("An") },
        ],
        contributions: [],
      }),
    ).toThrow(/Unknown participant/);
  });
});
