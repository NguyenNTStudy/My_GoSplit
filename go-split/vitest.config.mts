import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // Unit tests cover src/domain (plain TypeScript); E2E lives in tests/e2e with Playwright.
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
    // Vitest 5 with Vite 8 on Windows leaves a few file handles open after the run
    // ("something prevents 2 Vite servers from exiting"); results are unaffected, so don't wait 10 s.
    teardownTimeout: 2000,
  },
});
