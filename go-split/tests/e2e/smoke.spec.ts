import { expect, test } from "@playwright/test";

test("trang chủ mở được", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(page.locator("main")).toBeVisible();
});
