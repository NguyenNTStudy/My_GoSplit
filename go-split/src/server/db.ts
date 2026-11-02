import "server-only";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "./generated/prisma/client";
import type { Sql } from "./sql";

// Reuse one client across hot reloads in dev so each reload doesn't open a new pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Pooled connection for the app; migrations use DIRECT_URL (prisma7.config.ts).
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

type QueryClient = Pick<PrismaClient, "$queryRawUnsafe"> &
  Partial<Pick<PrismaClient, "$transaction">>;

function prismaSql(client: QueryClient): Sql {
  return {
    query: (text, params = []) => client.$queryRawUnsafe(text, ...params),
    transaction: (fn) =>
      client.$transaction
        ? client.$transaction((tx) => fn(prismaSql(tx)))
        : fn(prismaSql(client)),
  };
}

/** For the statements in SQL (see src/server/sql.ts). */
export const sql: Sql = prismaSql(db);
