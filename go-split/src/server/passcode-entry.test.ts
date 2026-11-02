import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { planPermissions } from "@/domain/permissions";

import {
  acquireEditLock,
  EDIT_LOCK_TTL_MS,
  releaseEditLock,
  renewEditLock,
} from "./edit-lock";
import { hashEmailToken } from "./email-token";
import type { UnlockEmail } from "./passcode-entry";
import {
  changePasscode,
  enterPasscode,
  unlockWithToken,
} from "./passcode-entry";
import { hashPasscode } from "./passcode-hash";
import type { Sql } from "./sql";
import { insertPlan, migratedDatabase, pgliteSql } from "./testing/database";

let pg: PGlite;
let sql: Sql;
let passcodeHash: string;

beforeAll(async () => {
  pg = await migratedDatabase();
  sql = pgliteSql(pg);
  passcodeHash = await hashPasscode("048213");
}, 60_000);

afterAll(async () => {
  await pg?.close();
});

const at = (iso: string) => new Date(iso);
const minutes = (date: Date, n: number) =>
  new Date(date.getTime() + n * 60_000);

function attempts(planId: string, now: Date) {
  const sent: UnlockEmail[] = [];
  const enter = (passcode: string, when = now) =>
    enterPasscode(sql, planId, passcode, {
      now: when,
      sendUnlockEmail: async (email) => {
        sent.push(email);
      },
    });
  return { sent, enter };
}

describe("nhập passcode và khóa nhập (R9)", () => {
  it("R5 đúng passcode thì được sửa với phiên bản passcode hiện tại", async () => {
    const planId = await insertPlan(pg, { passcodeHash });
    const { enter } = attempts(planId, at("2026-12-01T10:00:00Z"));
    expect(await enter("048213")).toEqual({
      outcome: "accepted",
      passcodeVersion: 1,
    });
    expect(await enter("000000")).toEqual({
      outcome: "wrong",
      attemptsLeft: 4,
    });
  });

  it("R9 sai 5 lần liên tiếp thì khóa 12 giờ, gửi đúng một email mở khóa cho chủ plan", async () => {
    const planId = await insertPlan(pg, {
      passcodeHash,
      ownerEmail: "chu-plan@example.com",
    });
    const now = at("2026-12-01T10:00:00Z");
    const { sent, enter } = attempts(planId, now);
    for (let i = 4; i >= 1; i--) {
      expect(await enter("111111")).toEqual({
        outcome: "wrong",
        attemptsLeft: i,
      });
    }
    expect(await enter("111111")).toEqual({
      outcome: "locked",
      lockedUntil: at("2026-12-01T22:00:00Z"),
    });
    // While locked even the right passcode is refused, and no second email goes out.
    expect(await enter("048213", minutes(now, 60))).toMatchObject({
      outcome: "locked",
    });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      to: "chu-plan@example.com",
      locale: "vi",
      planName: "Đà Lạt cuối tuần",
    });
    // Only the token's hash is stored.
    const { rows } = await pg.query<{ tokenHash: string }>(
      `SELECT "tokenHash" FROM "EmailToken" WHERE "planId" = $1`,
      [planId],
    );
    expect(rows).toEqual([{ tokenHash: hashEmailToken(sent[0].token) }]);

    // After 12 hours entry works again.
    expect(await enter("048213", at("2026-12-01T22:00:01Z"))).toMatchObject({
      outcome: "accepted",
    });
  });

  it("R9 mở link trong email thì gỡ khóa ngay; link chỉ dùng một lần", async () => {
    const planId = await insertPlan(pg, { passcodeHash });
    const now = at("2026-12-01T10:00:00Z");
    const { sent, enter } = attempts(planId, now);
    for (let i = 0; i < 5; i++) await enter("111111");
    const later = minutes(now, 5);

    expect(await unlockWithToken(sql, "not-a-real-token", later)).toBeNull();
    expect(await unlockWithToken(sql, sent[0].token, later)).toBe(planId);
    expect(await enter("048213", later)).toMatchObject({ outcome: "accepted" });
    expect(await unlockWithToken(sql, sent[0].token, later)).toBeNull();
  });

  it("R9 link hết hạn cùng lúc khóa tự hết", async () => {
    const planId = await insertPlan(pg, { passcodeHash });
    const now = at("2026-12-01T10:00:00Z");
    const { sent, enter } = attempts(planId, now);
    for (let i = 0; i < 5; i++) await enter("111111");
    expect(
      await unlockWithToken(sql, sent[0].token, at("2026-12-01T22:00:00Z")),
    ).toBeNull();
  });

  it("R11 đổi passcode: thiết bị dùng passcode cũ mất quyền sửa, khóa và link mở khóa cũ bị gỡ", async () => {
    const planId = await insertPlan(pg, { passcodeHash });
    const now = at("2026-12-01T10:00:00Z");
    const { sent, enter } = attempts(planId, now);
    const accepted = await enter("048213");
    for (let i = 0; i < 5; i++) await enter("111111");

    await changePasscode(sql, planId, await hashPasscode("730916"));

    const [plan] = await sql.query<{ passcodeVersion: number }>(
      `SELECT "passcodeVersion" FROM "Plan" WHERE "planId" = $1`,
      [planId],
    );
    const oldDevice = planPermissions({
      memberRole: null,
      hasShareLink: true,
      editSessionVersion:
        accepted.outcome === "accepted" ? accepted.passcodeVersion : null,
      passcodeVersion: plan.passcodeVersion,
    });
    expect(oldDevice.edit).toBe(false);
    expect(await unlockWithToken(sql, sent[0].token, now)).toBeNull();
    expect(await enter("048213")).toEqual({
      outcome: "wrong",
      attemptsLeft: 4,
    });
    expect(await enter("730916")).toEqual({
      outcome: "accepted",
      passcodeVersion: 2,
    });
  });
});

describe("edit lock (R8)", () => {
  it("R8 người vào trước giữ lock; người sau chỉ xem, biết khi nào lock hết", async () => {
    const planId = await insertPlan(pg);
    const now = at("2026-12-01T10:00:00Z");
    const first = await acquireEditLock(sql, planId, "tab-an", now);
    expect(first).toEqual({ held: true, expiresAt: minutes(now, 5) });
    expect(await acquireEditLock(sql, planId, "tab-binh", now)).toEqual({
      held: false,
      expiresAt: minutes(now, 5),
    });
    // The holder entering again keeps it.
    expect(
      await acquireEditLock(sql, planId, "tab-an", minutes(now, 1)),
    ).toMatchObject({
      held: true,
    });
  });

  it("R8 thao tác gia hạn lock; 5 phút không thao tác thì người khác vào được, lưu muộn bị từ chối", async () => {
    const planId = await insertPlan(pg);
    const now = at("2026-12-01T10:00:00Z");
    await acquireEditLock(sql, planId, "tab-an", now);
    expect(await renewEditLock(sql, planId, "tab-an", minutes(now, 4))).toBe(
      true,
    );
    // Renewed at 10:04, so still held at 10:08.
    expect(
      (await acquireEditLock(sql, planId, "tab-binh", minutes(now, 8))).held,
    ).toBe(false);

    const idle = new Date(minutes(now, 4).getTime() + EDIT_LOCK_TTL_MS);
    expect(await renewEditLock(sql, planId, "tab-an", idle)).toBe(false);
    expect((await acquireEditLock(sql, planId, "tab-binh", idle)).held).toBe(
      true,
    );
    expect(await renewEditLock(sql, planId, "tab-an", minutes(idle, 1))).toBe(
      false,
    );
  });

  it("R8 thoát chế độ sửa thì nhả lock; người khác không nhả hộ được", async () => {
    const planId = await insertPlan(pg);
    const now = at("2026-12-01T10:00:00Z");
    await acquireEditLock(sql, planId, "tab-an", now);
    await releaseEditLock(sql, planId, "tab-binh");
    expect((await acquireEditLock(sql, planId, "tab-binh", now)).held).toBe(
      false,
    );
    await releaseEditLock(sql, planId, "tab-an");
    expect((await acquireEditLock(sql, planId, "tab-binh", now)).held).toBe(
      true,
    );
  });

  it("R8 hai thiết bị cùng lúc vào sửa: chỉ một người được", async () => {
    const planId = await insertPlan(pg);
    const now = at("2026-12-01T10:00:00Z");
    const results = await Promise.all(
      ["tab-1", "tab-2", "tab-3"].map((holder) =>
        acquireEditLock(sql, planId, holder, now),
      ),
    );
    expect(results.filter((r) => r.held)).toHaveLength(1);
  });
});
