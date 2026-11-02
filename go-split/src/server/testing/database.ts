// Tests only: an in-memory Postgres (PGlite) with every migration applied, reachable through the
// same Sql interface the app gets from Prisma.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Transaction } from "@electric-sql/pglite";
import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { unaccent } from "@electric-sql/pglite/contrib/unaccent";

import type { Sql } from "../sql";

const MIGRATIONS = path.join(process.cwd(), "prisma", "migrations");

export async function migratedDatabase(): Promise<PGlite> {
  const pg = await PGlite.create({ extensions: { pg_trgm, unaccent } });
  const folders = readdirSync(MIGRATIONS, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  for (const folder of folders) {
    await pg.exec(
      readFileSync(path.join(MIGRATIONS, folder, "migration.sql"), "utf8"),
    );
  }
  return pg;
}

export function pgliteSql(pg: PGlite | Transaction): Sql {
  return {
    query: async (text, params = []) =>
      (await pg.query(text, [...params])).rows as never[],
    transaction: (fn) =>
      pg instanceof PGlite
        ? pg.transaction((tx) => fn(pgliteSql(tx)))
        : fn(pgliteSql(pg)),
  };
}

let planSeq = 0;

/** An account and a plan it owns, with passcode hash `hash`; returns the plan id. */
export async function insertPlan(
  pg: PGlite,
  fields: { passcodeHash?: string; ownerEmail?: string } = {},
): Promise<string> {
  planSeq += 1;
  const planId = String(2_000_000_000 + planSeq);
  const userId = `owner-${planId}`;
  await pg.query(
    `INSERT INTO "User" ("id", "name", "email", "userTag", "publicId", "language", "updatedAt")
     VALUES ($1, 'An', $2, $3, $4, 'vi', now())`,
    [
      userId,
      fields.ownerEmail ?? `${userId}@example.com`,
      String(planSeq).padStart(6, "0"),
      `pub${planId}`,
    ],
  );
  await pg.query(
    `INSERT INTO "Plan" ("planId", "shareKey", "kind", "name", "currency", "ownerId", "passcodeHash", "startDate", "endDate", "updatedAt")
     VALUES ($1, $2, 'detailed', 'Đà Lạt cuối tuần', 'VND', $3, $4, '2026-12-12', '2026-12-14', now())`,
    [planId, `key-${planId}`, userId, fields.passcodeHash ?? "hash"],
  );
  return planId;
}
