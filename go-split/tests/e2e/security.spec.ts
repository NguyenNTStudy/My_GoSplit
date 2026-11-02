import { expect, test } from "@playwright/test";

test.describe("header bảo mật và chống lập chỉ mục", () => {
  test("R46 R50 trang plan: noindex, không gửi referrer", async ({
    request,
  }) => {
    const response = await request.get("/p/0041234567/AbCdEfGhIjKlMnOpQrStUv");
    const headers = response.headers();
    expect(headers["x-robots-tag"]).toBe("noindex, nofollow");
    expect(headers["referrer-policy"]).toBe("no-referrer");
  });

  test("R46 danh sách gợi ý, hành trình, trang người dùng, tin chiêu mộ: noindex", async ({
    request,
  }) => {
    for (const path of [
      "/guides/abc",
      "/itineraries/abc",
      "/u/abc",
      "/recruit/abc",
    ]) {
      const response = await request.get(path);
      expect(response.headers()["x-robots-tag"], path).toBe(
        "noindex, nofollow",
      );
    }
  });

  test("trang chủ được lập chỉ mục, có header bảo mật cơ bản", async ({
    request,
  }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["x-robots-tag"]).toBeUndefined();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("R46 robots.txt không chặn các trang cần noindex, không có sitemap", async ({
    request,
  }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Allow: /");
    for (const path of ["/p", "/guides", "/itineraries", "/u", "/recruit"]) {
      expect(robots).not.toMatch(new RegExp(`Disallow: ${path}\\b`));
    }
    expect(robots.toLowerCase()).not.toContain("sitemap");
  });
});

test("R9 trang mở khóa: noindex, không gửi referrer, chỉ mở khóa khi bấm nút", async ({
  page,
}) => {
  const response = await page.goto("/unlock/some-token");
  expect(response?.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  expect(response?.headers()["referrer-policy"]).toBe("no-referrer");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button")).toBeVisible();
});
