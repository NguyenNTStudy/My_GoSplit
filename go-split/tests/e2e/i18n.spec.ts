import { expect, test } from "@playwright/test";

test.describe("trình duyệt tiếng Việt", () => {
  test.use({ locale: "vi-VN" });

  test("R28 thấy giao diện tiếng Việt, đổi sang English và giữ lựa chọn", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(
      page.getByRole("button", { name: "Tiếng Việt" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("button", { name: "English" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

test.describe("trình duyệt ngôn ngữ khác", () => {
  test.use({ locale: "fr-FR" });

  test("R28 ngôn ngữ không có trong app thì dùng English", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});
