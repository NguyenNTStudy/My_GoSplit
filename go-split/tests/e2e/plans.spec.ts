import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

// Sample data from scripts/seed.mjs, loaded into the test database for every run.
const AN = { username: "an.nguyen", password: "mat-khau-cua-an" };
const BINH = { username: "binh", password: "mat-khau-cua-binh" };
const DALAT = "/p/0041234567/dalatCuoiTuanDemoKey01";

test.use({ locale: "vi-VN" });

// Better Auth allows 3 sign-in attempts per 10 seconds per IP in production builds; each test
// gets its own address so parallel tests don't use up each other's attempts.
test.beforeEach(async ({ page }) => {
  const part = () => Math.floor(Math.random() * 250) + 1;
  await page.setExtraHTTPHeaders({
    "x-forwarded-for": `10.${part()}.${part()}.${part()}`,
  });
});

async function signIn(
  page: Page,
  user: { username: string; password: string },
  next = "/",
) {
  await page.goto(`/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email hoặc username").fill(user.username);
  await page.getByLabel("Mật khẩu").fill(user.password);
  await page
    .getByRole("main")
    .getByRole("button", { name: "Đăng nhập" })
    .click();
  await page.waitForURL((url) => url.pathname === next);
}

const unique = (name: string) => `${name} ${Date.now().toString(36)}`;

test.describe("kế hoạch", () => {
  test("R61 chưa đăng nhập thì tạo kế hoạch đưa tới đăng nhập, xong quay lại", async ({
    page,
  }) => {
    await page.goto("/plans/new");
    await expect(page).toHaveURL(/\/login\?next=%2Fplans%2Fnew$/);
    await page.getByLabel("Email hoặc username").fill(AN.username);
    await page.getByLabel("Mật khẩu").fill("sai-mat-khau");
    await page
      .getByRole("main")
      .getByRole("button", { name: "Đăng nhập" })
      .click();
    // Inside main: Next.js also has a role="alert" route announcer.
    await expect(page.getByRole("main").getByRole("alert")).toHaveText(
      "Email, username hoặc mật khẩu không đúng.",
    );
    await page.getByLabel("Mật khẩu").fill(AN.password);
    await page
      .getByRole("main")
      .getByRole("button", { name: "Đăng nhập" })
      .click();
    await expect(
      page.getByText("Bạn cần chia tiền cho việc gì?"),
    ).toBeVisible();
  });

  test("R93 R95 tạo kế hoạch cơ bản: thông tin, người tham gia, passcode", async ({
    page,
  }) => {
    const name = unique("Bún chả");
    await signIn(page, AN, "/plans/new");
    await page.getByText("Cơ bản", { exact: true }).click();
    await page.getByRole("button", { name: "Tiếp tục" }).click();

    // Empty name: stays on the step with a message (R73).
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await expect(page.getByText("Không được để trống.")).toBeVisible();

    await page.getByLabel("Tên kế hoạch").fill(name);
    await page.getByLabel("Thêm tên").fill("Bình");
    await page.getByRole("button", { name: "Thêm", exact: true }).click();
    await page.getByLabel("Thêm tên").fill("Chi");
    await page.keyboard.press("Enter");
    await expect(page.getByText("Người tham gia · 3")).toBeVisible();
    await page.getByLabel("Mô tả ngắn").fill("Quán đầu hẻm");
    await page.getByRole("button", { name: "Tiếp tục" }).click();

    await page.getByLabel("Passcode (6 số)").fill("111111");
    await expect(page.getByText(/Passcode này dễ đoán/)).toBeVisible();
    await page.getByLabel("Passcode (6 số)").fill("730916");
    await page.getByRole("button", { name: "Tạo kế hoạch" }).click();

    await expect(page).toHaveURL(/\/p\/\d{10}\/[\w-]{22}\/costs$/);
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await expect(page.getByText("Quán đầu hẻm")).toBeVisible();
    await expect(page.getByText("3 người")).toBeVisible();
    // R94: only Costs and Summary.
    const tabs = page.getByRole("navigation", {
      name: "Các phần của kế hoạch",
    });
    await expect(tabs.getByRole("link")).toHaveText(["Chi phí", "Tổng kết"]);
  });

  test("R2 R29 tạo kế hoạch chi tiết: ngày, theme, passcode", async ({
    page,
  }) => {
    const name = unique("Hội An");
    await signIn(page, AN, "/plans/new");
    await page.getByText("Kế hoạch chi tiết", { exact: true }).click();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await page.getByLabel("Tên kế hoạch").fill(name);
    await page.getByLabel("Địa điểm").fill("Hội An");
    await page.getByLabel("Ngày đi").fill("2027-03-10");
    await page.getByLabel("Ngày về").fill("2027-03-12");
    await expect(page.getByText("3 ngày · tối đa 60 ngày")).toBeVisible();
    await page.getByRole("button", { name: "Tiếp tục" }).click();

    await page.getByText("Biển", { exact: true }).click();
    await page.getByRole("button", { name: "Tiếp tục" }).click();
    await page.getByLabel("Passcode (6 số)").fill("730916");
    await page.getByRole("button", { name: "Tạo kế hoạch" }).click();

    await expect(page).toHaveURL(/\/p\/\d{10}\/[\w-]{22}$/);
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await expect(
      page.getByText(/Hội An · 10–12\/03\/2027 · 1 người/),
    ).toBeVisible();
    await expect(page.locator('[data-theme="bien"]')).toHaveCount(1);
    const tabs = page.getByRole("navigation", {
      name: "Các phần của kế hoạch",
    });
    await expect(tabs.getByRole("link")).toHaveText([
      "Lịch trình",
      "Ăn gì",
      "Chi phí",
      "Tổng kết",
    ]);
  });

  test("R62 R84 danh sách: Sắp diễn ra, plan đang tham gia có nhãn quyền, bộ lọc", async ({
    page,
  }) => {
    await signIn(page, BINH);
    const upcoming = page.getByRole("region", { name: /Sắp diễn ra/ });
    await expect(
      upcoming.getByRole("link", { name: /Đà Lạt cuối tuần/ }),
    ).toContainText("Đang tham gia · Sửa");
    await page.getByRole("link", { name: "Tôi tạo" }).click();
    await expect(page).toHaveURL(/\?filter=mine$/);
    await expect(
      page.getByText("Chưa có kế hoạch nào sắp diễn ra."),
    ).toBeVisible();
  });

  test("R3 mở kế hoạch bằng link không cần đăng nhập; sai khóa thì Không tìm thấy", async ({
    page,
  }) => {
    await page.goto(DALAT);
    await expect(
      page.getByRole("heading", { name: "Đà Lạt cuối tuần" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );

    const wrongKey = await page.goto("/p/0041234567/wrongKeyWrongKeyWrong1");
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy kế hoạch" }),
    ).toBeVisible();
    const wrongId = await page.goto("/p/9999999999/dalatCuoiTuanDemoKey01");
    // Same answer whichever part is wrong (R3). Dev answers 404; production streams the page
    // with Cache Components and answers 200 with the same content.
    expect(wrongId?.status()).toBe(wrongKey?.status());
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy kế hoạch" }),
    ).toBeVisible();
  });

  test("R94 kế hoạch cơ bản không có tab Lịch trình, Ăn gì: chuyển về Chi phí", async ({
    page,
  }) => {
    await page.goto("/p/0041234568/lauThuSauDemoKey000001/food");
    await expect(page).toHaveURL(/\/costs$/);
    await expect(page.getByText("Lẩu bò Ba Toa, quận 3")).toBeVisible();
  });
});
