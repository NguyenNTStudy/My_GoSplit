// One editor at a time per plan (R8). Whoever enters edit mode first holds the lock; it ends
// when they leave edit mode or 5 minutes after their last activity. The holder is an opaque id
// chosen by the edit screen. Every statement is a single conditional UPDATE, so two devices
// asking at the same moment can't both get the lock.

import type { Sql } from "./sql";

export const EDIT_LOCK_TTL_MS = 5 * 60 * 1000;
/** How often the edit screen renews the lock while the person is still active. */
export const EDIT_LOCK_HEARTBEAT_MS = 30 * 1000;

export type EditLockResult =
  { held: true; expiresAt: Date } | { held: false; expiresAt: Date | null };

const expiry = (now: Date) => new Date(now.getTime() + EDIT_LOCK_TTL_MS);

/**
 * Enters edit mode: takes the lock when it is free, expired or already ours. Otherwise says
 * until when someone else holds it, for the view-only notice.
 */
export async function acquireEditLock(
  sql: Sql,
  planId: string,
  holderId: string,
  now: Date,
): Promise<EditLockResult> {
  const [taken] = await sql.query<{ editLockExpiresAt: Date }>(
    `UPDATE "Plan" SET "editLockSessionId" = $2, "editLockExpiresAt" = $3
     WHERE "planId" = $1 AND ("editLockSessionId" IS NULL OR "editLockSessionId" = $2
       OR "editLockExpiresAt" IS NULL OR "editLockExpiresAt" <= $4)
     RETURNING "editLockExpiresAt"`,
    [planId, holderId, expiry(now), now],
  );
  if (taken) return { held: true, expiresAt: taken.editLockExpiresAt };
  const [current] = await sql.query<{ editLockExpiresAt: Date | null }>(
    `SELECT "editLockExpiresAt" FROM "Plan" WHERE "planId" = $1`,
    [planId],
  );
  return { held: false, expiresAt: current?.editLockExpiresAt ?? null };
}

/**
 * Heartbeat, and the check before every save (R8): extends the lock only if this holder still
 * has it and it hasn't expired. A save after the lock expired is refused even if nobody took it,
 * so it can't silently overwrite changes; the screen then asks for the lock again.
 */
export async function renewEditLock(
  sql: Sql,
  planId: string,
  holderId: string,
  now: Date,
): Promise<boolean> {
  const rows = await sql.query(
    `UPDATE "Plan" SET "editLockExpiresAt" = $3
     WHERE "planId" = $1 AND "editLockSessionId" = $2 AND "editLockExpiresAt" > $4
     RETURNING 1`,
    [planId, holderId, expiry(now), now],
  );
  return rows.length === 1;
}

/** Leaving edit mode or closing the tab; only the holder can release. */
export async function releaseEditLock(
  sql: Sql,
  planId: string,
  holderId: string,
): Promise<void> {
  await sql.query(
    `UPDATE "Plan" SET "editLockSessionId" = NULL, "editLockExpiresAt" = NULL
     WHERE "planId" = $1 AND "editLockSessionId" = $2`,
    [planId, holderId],
  );
}
