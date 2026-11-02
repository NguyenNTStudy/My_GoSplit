import { randomBytes } from "node:crypto";

import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
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
  webServer: {
    // CI runs against a production build (`npm run build` happens before).
    command: CI ? "npm run start" : "npm run dev",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    // Better Auth refuses to start in production without a secret; a throwaway one per run
    // is enough because test sessions never outlive the server.
    env: {
      BETTER_AUTH_SECRET:
        process.env.BETTER_AUTH_SECRET ?? randomBytes(32).toString("base64"),
      BETTER_AUTH_URL: `http://localhost:${PORT}`,
    },
  },
});
