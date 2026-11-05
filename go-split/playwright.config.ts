import { randomBytes } from "node:crypto";

import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const DB_PORT = 5434;
const CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  reporter: CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  // Every flow is designed for phone and desktop, so E2E runs on both.
  projects: [
    { name: "phone", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    {
      // A fresh in-memory database with the sample data (scripts/seed.mjs) for every run.
      command: `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/dev-db.mjs --memory --port ${DB_PORT}`,
      port: DB_PORT,
      reuseExistingServer: !CI,
    },
    {
      // CI runs against a production build (`npm run build` happens before).
      command: CI ? "npm run start" : "npm run dev",
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !CI,
      env: {
        DATABASE_URL: `postgresql://postgres:postgres@127.0.0.1:${DB_PORT}/postgres?sslmode=disable`,
        // Better Auth refuses to start in production without a secret; throwaway secrets per
        // run are enough because test sessions never outlive the server.
        BETTER_AUTH_SECRET:
          process.env.BETTER_AUTH_SECRET ?? randomBytes(32).toString("base64"),
        BETTER_AUTH_URL: `http://localhost:${PORT}`,
        EDIT_SESSION_SECRET: randomBytes(32).toString("base64"),
      },
    },
  ],
});
