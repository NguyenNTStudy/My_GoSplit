// Local Postgres for development and E2E tests, with nothing to install: PGlite (Postgres
// compiled to WebAssembly) behind a socket, so the app connects with a normal DATABASE_URL.
// A new database gets every migration and the sample data in scripts/seed.mjs.
//
//   npm run db:dev                          data kept between runs (npm run db:reset clears it)
//   node scripts/dev-db.mjs --memory --port 5434   fresh database (E2E tests)
//
// PGlite itself has one session; the socket server shares it between up to 10 connections and
// runs one connection's open transaction to the end before anyone else's queries.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";

import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import { unaccent } from "@electric-sql/pglite/contrib/unaccent";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

import { seed } from "./seed.mjs";

const { values } = parseArgs({
  options: {
    memory: { type: "boolean", default: false },
    port: { type: "string", default: "5433" },
    reset: { type: "boolean", default: false },
  },
});

// Outside the project: PGlite writes its files after every query, and the dev server watches
// the whole project (node_modules included), so it would keep recompiling and reloading pages.
// A cleaned-up temp folder just means a fresh database with the sample data again.
const DATA_DIR = path.join(os.tmpdir(), "gosplit-dev-db");
if (values.reset) {
  rmSync(DATA_DIR, { recursive: true, force: true });
  process.stdout.write(`Removed ${DATA_DIR}\n`);
  process.exit(0);
}
const fresh = values.memory || !existsSync(DATA_DIR);
if (!values.memory) mkdirSync(path.dirname(DATA_DIR), { recursive: true });
const db = await PGlite.create({
  dataDir: values.memory ? undefined : DATA_DIR,
  extensions: { pg_trgm, unaccent },
});

// Same files Prisma applies on Neon; recorded so a restart only runs new ones.
await db.exec(
  `CREATE TABLE IF NOT EXISTS "_dev_migrations" ("name" text PRIMARY KEY)`,
);
const applied = new Set(
  (await db.query(`SELECT "name" FROM "_dev_migrations"`)).rows.map(
    (r) => r.name,
  ),
);
const folder = path.join("prisma", "migrations");
for (const name of readdirSync(folder, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()) {
  if (applied.has(name)) continue;
  await db.exec(readFileSync(path.join(folder, name, "migration.sql"), "utf8"));
  await db.query(`INSERT INTO "_dev_migrations" ("name") VALUES ($1)`, [name]);
  process.stdout.write(`Applied migration ${name}\n`);
}

if (fresh) {
  await seed(async (text, params) => (await db.query(text, params)).rows);
  process.stdout.write("Added sample data (scripts/seed.mjs)\n");
}

const server = new PGLiteSocketServer({
  db,
  port: Number(values.port),
  host: "127.0.0.1",
  // Production builds may create a few Prisma clients (one per server bundle).
  maxConnections: 10,
});
await server.start();
process.stdout.write(
  `Database ready: postgresql://postgres:postgres@127.0.0.1:${values.port}/postgres\n`,
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await server.stop();
    await db.close();
    process.exit(0);
  });
}
