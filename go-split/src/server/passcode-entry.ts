// Entering a plan's passcode, the lock after repeated wrong attempts and its email link (R9),
// and the owner changing the passcode (R11). Each step that reads and writes the counters runs
// in one transaction with the plan row locked, so attempts at the same moment are all counted.

import { generateUuidV7 } from "@/domain/ids";
import type { PasscodeGuard } from "@/domain/passcode";
import {
  PASSCODE_MAX_FAILED_ATTEMPTS,
  afterPasscodeAttempt,
  isPasscodeLocked,
} from "@/domain/passcode";

import { hashEmailToken, newEmailToken } from "./email-token";
import { verifyPasscode } from "./passcode-hash";
import type { Sql } from "./sql";

export type UnlockEmail = {
  to: string;
  locale: string | null;
  planName: string;
  token: string;
  lockedUntil: Date;
};

export type PasscodeEntryResult =
  /** Set the edit cookie for this version (src/server/edit-session.ts). */
  | { outcome: "accepted"; passcodeVersion: number }
  | { outcome: "wrong"; attemptsLeft: number }
  | { outcome: "locked"; lockedUntil: Date }
  | { outcome: "not_found" };

type GuardRow = {
  passcodeHash: string;
  passcodeVersion: number;
  failedPasscodeAttempts: number;
  passcodeLockedUntil: Date | null;
};

const toGuard = (row: GuardRow): PasscodeGuard => ({
  failedAttempts: row.failedPasscodeAttempts,
  lockedUntil: row.passcodeLockedUntil,
});

/**
 * Checks a passcode for a plan (R5, R9). While entry is locked the passcode isn't even checked.
 * The fifth wrong attempt in a row locks entry for 12 hours and emails the owner one unlock link.
 */
export async function enterPasscode(
  sql: Sql,
  planId: string,
  passcode: string,
  options: {
    now: Date;
    sendUnlockEmail: (email: UnlockEmail) => Promise<void>;
  },
): Promise<PasscodeEntryResult> {
  const { now } = options;
  const [before] = await sql.query<GuardRow>(
    `SELECT "passcodeHash", "passcodeVersion", "failedPasscodeAttempts", "passcodeLockedUntil"
     FROM "Plan" WHERE "planId" = $1`,
    [planId],
  );
  if (!before) return { outcome: "not_found" };
  if (isPasscodeLocked(toGuard(before), now)) {
    return { outcome: "locked", lockedUntil: before.passcodeLockedUntil! };
  }
  // The slow hash check happens before the transaction, so the row stays locked only briefly.
  const correct = await verifyPasscode(passcode, before.passcodeHash);

  const { result, unlockEmail } = await sql.transaction(async (tx) => {
    const [row] = await tx.query<GuardRow>(
      `SELECT "passcodeHash", "passcodeVersion", "failedPasscodeAttempts", "passcodeLockedUntil"
       FROM "Plan" WHERE "planId" = $1 FOR UPDATE`,
      [planId],
    );
    if (!row) return { result: { outcome: "not_found" } as const };
    const guard = toGuard(row);
    // Another attempt may have locked entry, or the owner changed the passcode, meanwhile.
    if (isPasscodeLocked(guard, now)) {
      return {
        result: {
          outcome: "locked",
          lockedUntil: row.passcodeLockedUntil!,
        } as const,
      };
    }
    const stillCorrect = correct && row.passcodeHash === before.passcodeHash;
    const next = afterPasscodeAttempt(guard, stillCorrect, now);
    await tx.query(
      `UPDATE "Plan" SET "failedPasscodeAttempts" = $2, "passcodeLockedUntil" = $3,
         "unlockEmailSentAt" = CASE WHEN $4 THEN $5::timestamptz ELSE "unlockEmailSentAt" END
       WHERE "planId" = $1`,
      [
        planId,
        next.guard.failedAttempts,
        next.guard.lockedUntil,
        next.lockedNow,
        now,
      ],
    );
    if (stillCorrect) {
      return {
        result: {
          outcome: "accepted",
          passcodeVersion: row.passcodeVersion,
        } as const,
      };
    }
    if (!next.lockedNow) {
      return {
        result: {
          outcome: "wrong",
          attemptsLeft:
            PASSCODE_MAX_FAILED_ATTEMPTS - next.guard.failedAttempts,
        } as const,
      };
    }
    const lockedUntil = next.guard.lockedUntil!;
    return {
      result: { outcome: "locked", lockedUntil } as const,
      unlockEmail: await createUnlockEmail(tx, planId, lockedUntil, now),
    };
  });

  // Sent after the transaction: a slow mail server must not hold the plan row (one email per
  // lock, R9; `unlockEmailSentAt` records it).
  if (unlockEmail) await options.sendUnlockEmail(unlockEmail);
  return result;
}

async function createUnlockEmail(
  tx: Sql,
  planId: string,
  lockedUntil: Date,
  now: Date,
): Promise<UnlockEmail> {
  const { token, tokenHash } = newEmailToken();
  await tx.query(
    `INSERT INTO "EmailToken" ("id", "planId", "purpose", "tokenHash", "expiresAt")
     VALUES ($1, $2, 'unlock', $3, $4)`,
    [generateUuidV7(now.getTime()), planId, tokenHash, lockedUntil],
  );
  // The owner's account email, never shown to anyone (R10).
  const [owner] = await tx.query<{
    email: string;
    language: string | null;
    name: string;
  }>(
    `SELECT u."email", u."language", p."name" FROM "Plan" p
     JOIN "User" u ON u."id" = p."ownerId" WHERE p."planId" = $1`,
    [planId],
  );
  return {
    to: owner.email,
    locale: owner.language,
    planName: owner.name,
    token,
    lockedUntil,
  };
}

/**
 * The unlock link from the email (R9): lifts the lock at once. Works once, and only until the
 * lock would have ended anyway. Returns the plan id, or `null` for a used or unknown link.
 */
export async function unlockWithToken(
  sql: Sql,
  token: string,
  now: Date,
): Promise<string | null> {
  return sql.transaction(async (tx) => {
    const [used] = await tx.query<{ planId: string }>(
      `UPDATE "EmailToken" SET "usedAt" = $2
       WHERE "tokenHash" = $1 AND "purpose" = 'unlock' AND "usedAt" IS NULL AND "expiresAt" > $2
       RETURNING "planId"`,
      [hashEmailToken(token), now],
    );
    if (!used) return null;
    await tx.query(
      `UPDATE "Plan" SET "failedPasscodeAttempts" = 0, "passcodeLockedUntil" = NULL,
         "unlockEmailSentAt" = NULL
       WHERE "planId" = $1`,
      [used.planId],
    );
    return used.planId;
  });
}

/**
 * The owner sets a new passcode (R11): devices using the old one lose edit rights (the version
 * goes up), and any lock and unused unlock link go away. The caller checks it is the owner.
 */
export async function changePasscode(
  sql: Sql,
  planId: string,
  passcodeHash: string,
): Promise<void> {
  await sql.transaction(async (tx) => {
    await tx.query(
      `UPDATE "Plan" SET "passcodeHash" = $2, "passcodeVersion" = "passcodeVersion" + 1,
         "failedPasscodeAttempts" = 0, "passcodeLockedUntil" = NULL, "unlockEmailSentAt" = NULL
       WHERE "planId" = $1`,
      [planId, passcodeHash],
    );
    await tx.query(
      `DELETE FROM "EmailToken" WHERE "planId" = $1 AND "purpose" = 'unlock' AND "usedAt" IS NULL`,
      [planId],
    );
  });
}
