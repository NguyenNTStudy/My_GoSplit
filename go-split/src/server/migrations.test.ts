// Applies prisma/migrations to an in-memory Postgres (PGlite) and checks the rules that live
// in SQL rather than in the Prisma schema: CHECK constraints, triggers, cascades, extensions.
import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { migratedDatabase } from "./testing/database";

let db: PGlite;

beforeAll(async () => {
  db = await migratedDatabase();
  await db.exec(`
    INSERT INTO "User" ("id", "name", "email", "userTag", "publicId", "updatedAt")
    VALUES ('u1', 'An', 'an@example.com', '4821', 'k3m9q2x7v1ab', now());
  `);
}, 60_000);

afterAll(async () => {
  await db?.close();
});

let planSeq = 0;

/** Inserts a plan with its owner participant; returns the plan id. */
async function createPlan(
  fields: Record<string, string | null> = {},
): Promise<string> {
  planSeq += 1;
  const planId = String(1_000_000_000 + planSeq);
  const values: Record<string, string | null> = {
    kind: "detailed",
    startDate: "2026-12-12",
    endDate: "2026-12-14",
    ...fields,
  };
  await db.query(
    `INSERT INTO "Plan" ("planId", "shareKey", "kind", "name", "currency", "ownerId", "passcodeHash", "startDate", "endDate", "notes", "updatedAt")
     VALUES ($1, $2, $3::"PlanKind", 'Đà Lạt cuối tuần', 'VND', 'u1', 'hash', $4::date, $5::date, $6, now())`,
    [
      planId,
      `key-${planId}`,
      values.kind,
      values.startDate,
      values.endDate,
      values.notes ?? null,
    ],
  );
  return planId;
}

async function addParticipant(planId: string, name: string): Promise<string> {
  const { rows } = await db.query<{ participantId: string }>(
    `INSERT INTO "Participant" ("participantId", "planId", "displayName") VALUES (gen_random_uuid(), $1, $2) RETURNING "participantId"`,
    [planId, name],
  );
  return rows[0].participantId;
}

async function addExpense(
  planId: string,
  paidBy: string,
  amount: string,
): Promise<string> {
  const { rows } = await db.query<{ expenseId: string }>(
    `INSERT INTO "Expense" ("expenseId", "planId", "description", "amount", "paidByParticipantId")
     VALUES (gen_random_uuid(), $1, 'Lẩu bò', $2::numeric, $3) RETURNING "expenseId"`,
    [planId, amount, paidBy],
  );
  return rows[0].expenseId;
}

describe("migration", () => {
  it("tạo đủ các bảng và extension tìm không dấu", async () => {
    const tables = await db.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
    );
    expect(tables.rows[0].count).toBe(34);
    const { rows } = await db.query<{ plain: string; close: boolean }>(
      `SELECT unaccent('Đà Lạt') AS plain, similarity('da lat', 'dalat') > 0.2 AS close`,
    );
    expect(rows[0]).toEqual({ plain: "Da Lat", close: true });
  });

  it("R2 kế hoạch chi tiết dài tối đa 60 ngày", async () => {
    await expect(
      createPlan({ startDate: "2026-12-01", endDate: "2027-01-29" }),
    ).resolves.toBeTruthy();
    await expect(
      createPlan({ startDate: "2026-12-01", endDate: "2027-01-30" }),
    ).rejects.toThrow(/Plan_kind_fields_check/);
    await expect(
      createPlan({ startDate: "2026-12-14", endDate: "2026-12-12" }),
    ).rejects.toThrow(/Plan_kind_fields_check/);
  });

  it("R94 kế hoạch cơ bản không có ngày, mô tả ngắn tối đa 100 ký tự", async () => {
    const basic = { kind: "basic", startDate: null, endDate: null };
    await expect(
      createPlan({ ...basic, notes: "Lẩu Manwah Nguyễn Trãi" }),
    ).resolves.toBeTruthy();
    await expect(
      createPlan({ ...basic, notes: "x".repeat(101) }),
    ).rejects.toThrow(/Plan_kind_fields_check/);
    await expect(
      createPlan({ ...basic, startDate: "2026-12-12" }),
    ).rejects.toThrow(/Plan_kind_fields_check/);
    await expect(
      createPlan({ kind: "detailed", startDate: null, endDate: null }),
    ).rejects.toThrow(/Plan_kind_fields_check/);
  });

  it("R14 R16 số tiền và tỷ lệ chia phải lớn hơn 0", async () => {
    const planId = await createPlan();
    const an = await addParticipant(planId, "An");
    await expect(addExpense(planId, an, "0")).rejects.toThrow(
      /Expense_amount_check/,
    );
    const expenseId = await addExpense(planId, an, "640000");
    await expect(
      db.query(
        `INSERT INTO "ExpenseShare" ("expenseId", "participantId", "ratio") VALUES ($1, $2, 0)`,
        [expenseId, an],
      ),
    ).rejects.toThrow(/ExpenseShare_ratio_check/);
  });

  it("Plan.updatedAt đổi khi dữ liệu của kế hoạch đổi", async () => {
    const planId = await createPlan();
    const an = await addParticipant(planId, "An");
    await db.query(
      `UPDATE "Plan" SET "updatedAt" = '2020-01-01' WHERE "planId" = $1`,
      [planId],
    );
    const expenseId = await addExpense(planId, an, "120000");
    const afterExpense = await db.query<{ updatedAt: Date }>(
      `SELECT "updatedAt" FROM "Plan" WHERE "planId" = $1`,
      [planId],
    );
    expect(afterExpense.rows[0].updatedAt.getFullYear()).toBeGreaterThan(2020);

    await db.query(
      `UPDATE "Plan" SET "updatedAt" = '2020-01-01' WHERE "planId" = $1`,
      [planId],
    );
    await db.query(
      `INSERT INTO "ExpenseShare" ("expenseId", "participantId") VALUES ($1, $2)`,
      [expenseId, an],
    );
    const afterShare = await db.query<{ updatedAt: Date }>(
      `SELECT "updatedAt" FROM "Plan" WHERE "planId" = $1`,
      [planId],
    );
    expect(afterShare.rows[0].updatedAt.getFullYear()).toBeGreaterThan(2020);
  });

  it("R13 người đã có khoản chi không bị xóa hẳn, người chưa có thì xóa được", async () => {
    const planId = await createPlan();
    const binh = await addParticipant(planId, "Bình");
    const chi = await addParticipant(planId, "Chi");
    const expenseId = await addExpense(planId, binh, "180000");
    await expect(
      db.query(`DELETE FROM "Participant" WHERE "participantId" = $1`, [binh]),
    ).rejects.toThrow(/R13/);

    await db.query(
      `INSERT INTO "ExpenseShare" ("expenseId", "participantId") VALUES ($1, $2)`,
      [expenseId, chi],
    );
    await expect(
      db.query(`DELETE FROM "Participant" WHERE "participantId" = $1`, [chi]),
    ).rejects.toThrow(/R13/);

    const dung = await addParticipant(planId, "Dũng");
    await db.query(`DELETE FROM "Participant" WHERE "participantId" = $1`, [
      dung,
    ]);
    const { rows } = await db.query<{ count: number }>(
      `SELECT count(*)::int AS count FROM "Participant" WHERE "planId" = $1`,
      [planId],
    );
    expect(rows[0].count).toBe(2);
  });

  it("R22 xóa kế hoạch thì xóa toàn bộ dữ liệu con", async () => {
    const planId = await createPlan();
    const an = await addParticipant(planId, "An");
    const expenseId = await addExpense(planId, an, "90000");
    await db.query(
      `INSERT INTO "ExpenseShare" ("expenseId", "participantId") VALUES ($1, $2)`,
      [expenseId, an],
    );
    await db.query(
      `UPDATE "Plan" SET "ownerParticipantId" = $2, "collectorParticipantId" = $2 WHERE "planId" = $1`,
      [planId, an],
    );

    await db.query(`DELETE FROM "Plan" WHERE "planId" = $1`, [planId]);

    const { rows } = await db.query<{
      participants: number;
      expenses: number;
      shares: number;
    }>(
      `SELECT
         (SELECT count(*)::int FROM "Participant" WHERE "planId" = $1) AS participants,
         (SELECT count(*)::int FROM "Expense" WHERE "planId" = $1) AS expenses,
         (SELECT count(*)::int FROM "ExpenseShare" WHERE "expenseId" = $2) AS shares`,
      [planId, expenseId],
    );
    expect(rows[0]).toEqual({ participants: 0, expenses: 0, shares: 0 });
  });
});
