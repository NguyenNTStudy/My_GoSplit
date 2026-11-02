import { describe, expect, it, vi } from "vitest";

import { sendEmail } from "./email";
import { authEmail, unlockEmail } from "./email-templates";

describe("nội dung email", () => {
  it("R28 xác nhận email và đặt lại mật khẩu theo ngôn ngữ người dùng đang dùng", () => {
    const vi = authEmail({
      kind: "verify-email",
      to: "an@example.com",
      url: "https://app.example/api/auth/verify-email?token=abc",
      locale: "vi",
      name: "Nguyễn An",
    });
    expect(vi.subject).toBe("Xác nhận email cho Góp Gạo");
    expect(vi.text).toContain("Chào Nguyễn An,");
    expect(vi.text).toContain(
      "Xác nhận email: https://app.example/api/auth/verify-email?token=abc",
    );
    expect(vi.html).toContain('<html lang="vi">');

    const reset = {
      kind: "reset-password" as const,
      to: "an@example.com",
      url: "https://app.example/reset",
    };
    const en = authEmail({ ...reset, locale: "en" });
    expect(en.subject).toBe("Reset your GoSplit password");
    expect(en.text).not.toContain("Hi");
    // An unknown language falls back to English.
    expect(authEmail({ ...reset, locale: "fr" }).subject).toBe(en.subject);
  });

  it("R9 email mở khóa có tên kế hoạch; tên do người dùng nhập được escape trong HTML", () => {
    const email = unlockEmail({
      to: "chu@example.com",
      locale: "vi",
      planName: '<b>Đà Lạt</b> & "bạn bè"',
      url: "https://app.example/unlock/token-123",
    });
    expect(email.subject).toBe(
      'Kế hoạch “<b>Đà Lạt</b> & "bạn bè"” đang tạm khóa nhập passcode',
    );
    expect(email.html).toContain(
      "&lt;b&gt;Đà Lạt&lt;/b&gt; &amp; &quot;bạn bè&quot;",
    );
    expect(email.html).not.toContain("<b>Đà Lạt</b>");
    expect(email.html).toContain('href="https://app.example/unlock/token-123"');
  });
});

describe("gửi email qua Resend", () => {
  const message = {
    to: "an@example.com",
    subject: "Chủ đề",
    text: "Nội dung",
    html: "<p>Nội dung</p>",
  };

  it("gọi API của Resend với key và người gửi trong biến môi trường", async () => {
    const fetchImpl = vi.fn(async () => new Response("{}"));
    await sendEmail(
      message,
      {
        apiKey: "re_test",
        from: "Góp Gạo <no-reply@app.example>",
        production: true,
      },
      fetchImpl,
    );
    expect(fetchImpl).toHaveBeenCalledWith("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer re_test",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Góp Gạo <no-reply@app.example>",
        to: ["an@example.com"],
        subject: "Chủ đề",
        text: "Nội dung",
        html: "<p>Nội dung</p>",
      }),
    });
  });

  it("Resend báo lỗi thì báo lỗi; chưa có key thì dev in ra log, production từ chối", async () => {
    await expect(
      sendEmail(
        message,
        { apiKey: "re_test", from: "x@app.example", production: true },
        async () => new Response("{}", { status: 422 }),
      ),
    ).rejects.toThrow("422");

    const log = vi.spyOn(console, "warn").mockImplementation(() => {});
    await sendEmail(message, {
      apiKey: undefined,
      from: undefined,
      production: false,
    });
    expect(log).toHaveBeenCalledWith(expect.stringContaining("Nội dung"));
    await expect(
      sendEmail(message, {
        apiKey: undefined,
        from: undefined,
        production: true,
      }),
    ).rejects.toThrow("RESEND_API_KEY");
  });
});
