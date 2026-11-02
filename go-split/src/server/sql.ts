// The few statements that must be atomic (passcode attempts, email tokens, edit lock) are
// written in SQL. This interface runs them on Prisma in the app (src/server/db.ts) and on an
// in-memory Postgres in tests (src/server/testing/database.ts).

export interface Sql {
  /** One parameterised statement ($1, $2, …); the text is always a constant, never user input. */
  query<T = Record<string, unknown>>(
    text: string,
    params?: readonly unknown[],
  ): Promise<T[]>;
  /** Runs `fn` in one transaction; inside a transaction it just runs `fn`. */
  transaction<T>(fn: (tx: Sql) => Promise<T>): Promise<T>;
}
