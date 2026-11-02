import { expect, test } from "@playwright/test";

import { IOS_SCREENS, PWA_BACKGROUND } from "../../src/lib/pwa";

test.describe("cài app lên màn hình chính (PWA)", () => {
  for (const [locale, name] of [
    ["vi", "Góp Gạo"],
    ["en", "GoSplit"],
  ] as const) {
    test(`R28 manifest theo ngôn ngữ đang dùng: ${locale}`, async ({
      page,
      context,
      request,
      baseURL,
    }) => {
      await context.addCookies([
        { name: "locale", value: locale, url: baseURL! },
      ]);
      await page.goto("/");

      const href = await page
        .locator('link[rel="manifest"]')
        .getAttribute("href");
      expect(href).toBe(`/manifests/${locale}`);
      // Like a browser: the manifest request carries no cookies.
      const response = await request.get(href!);
      expect(response.headers()["content-type"]).toContain(
        "application/manifest+json",
      );
      const manifest = await response.json();
      expect(manifest).toMatchObject({
        name,
        lang: locale,
        start_url: "/",
        display: "standalone",
      });
      expect(
        manifest.icons.map((icon: { sizes: string }) => icon.sizes),
      ).toEqual(expect.arrayContaining(["192x192", "512x512"]));
      for (const icon of manifest.icons) {
        const image = await page.request.get(icon.src);
        expect(image.headers()["content-type"], icon.src).toBe("image/png");
      }
    });
  }

  test("manifest không có cho ngôn ngữ app không hỗ trợ", async ({
    request,
  }) => {
    expect((await request.get("/manifests/fr")).status()).toBe(404);
  });

  test("có icon, màu thanh trình duyệt và ảnh khởi động cho iPhone", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      PWA_BACKGROUND,
    );
    const icons = await page
      .locator('link[rel="apple-touch-icon"], link[rel="icon"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
    const startup = await page
      .locator('link[rel="apple-touch-startup-image"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
    expect(startup).toHaveLength(IOS_SCREENS.length);
    for (const href of [...icons, ...startup]) {
      expect((await page.request.get(href)).ok(), href).toBe(true);
    }
  });

  test("Chrome đọc được manifest, không báo lỗi", async ({ page, context }) => {
    await page.goto("/");
    const cdp = await context.newCDPSession(page);
    const { url, errors, data } = await cdp.send("Page.getAppManifest");
    expect(url).toMatch(/\/manifests\/(vi|en)$/);
    expect(data).toBeTruthy();
    expect(errors).toEqual([]);
  });

  test("trang không bị cuộn ngang", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
