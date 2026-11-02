import { readFileSync } from "node:fs";
import path from "node:path";

import { getAuthTables } from "@better-auth/core/db";
import { memoryAdapter } from "better-auth/adapters/memory";
import { describe, expect, it } from "vitest";

import type { AuthEmail } from "./create-auth";
import { createAuth } from "./create-auth";
import { requestPasswordResetFor } from "./password-reset";

// The real setup on Better Auth's in-memory database: sign-up, email confirmation, sign-in by
// email or username, password reset. Emails are captured instead of sent.
function setup() {
  const db: Record<string, Record<string, unknown>[]> = {
    user: [],
    session: [],
    account: [],
    verification: [],
  };
  const sent: AuthEmail[] = [];
  const auth = createAuth({
    database: memoryAdapter(db),
    secret: "test-secret-that-is-long-enough-for-better-auth",
    baseURL: "http://localhost:3000",
    sendEmail: async (email) => {
      sent.push(email);
    },
  });
  return { db, sent, auth };
}

type Setup = ReturnType<typeof setup>;

const PASSWORD = "mat-khau-du-dai";
const browser = new Headers({
  "accept-language": "vi-VN,vi;q=0.9,en;q=0.5",
});

function signUp({ auth }: Setup, body: Record<string, string> = {}) {
  return auth.api.signUpEmail({
    body: {
      name: "Nguyễn An",
      email: "an@example.com",
      password: PASSWORD,
      username: "An.Nguyen",
      ...body,
    },
    headers: browser,
  });
}

/** Confirms the email with the token from the last email sent. */
async function confirmEmail({ auth, sent }: Setup) {
  const token = new URL(sent.at(-1)!.url).searchParams.get("token")!;
  await auth.api.verifyEmail({ query: { token } });
}

/** The error code Better Auth answers with, or `null` when the call succeeds. */
async function errorCode(call: Promise<unknown>) {
  try {
    await call;
    return null;
  } catch (error) {
    return (error as { body?: { code?: string } }).body?.code ?? "UNKNOWN";
  }
}

describe("tài khoản (Better Auth)", () => {
  it("R78 R37 R28 đăng ký: username chữ thường, tag 4 số, publicId, ngôn ngữ đang dùng; gửi email xác nhận", async () => {
    const s = setup();
    await signUp(s);

    expect(s.db.user[0]).toMatchObject({
      name: "Nguyễn An",
      email: "an@example.com",
      emailVerified: false,
      username: "an.nguyen",
      language: "vi",
    });
    expect(s.db.user[0].userTag).toMatch(/^\d{4}$/);
    expect(s.db.user[0].publicId).toMatch(/^[0-9a-z]{12}$/);
    expect(s.sent).toMatchObject([
      { kind: "verify-email", to: "an@example.com", locale: "vi" },
    ]);
  });

  it("R61 chưa xác nhận email thì chưa đăng nhập được; xác nhận xong đăng nhập bằng email hoặc username", async () => {
    const s = setup();
    await signUp(s);
    expect(
      await errorCode(
        s.auth.api.signInEmail({
          body: { email: "an@example.com", password: PASSWORD },
        }),
      ),
    ).toBe("EMAIL_NOT_VERIFIED");

    await confirmEmail(s);
    expect(s.db.user[0].emailVerified).toBe(true);
    const byUsername = await s.auth.api.signInUsername({
      body: { username: "AN.NGUYEN", password: PASSWORD },
    });
    expect(byUsername?.user.email).toBe("an@example.com");
    const byEmail = await s.auth.api.signInEmail({
      body: { email: "an@example.com", password: PASSWORD },
    });
    expect(byEmail.user.id).toBe(byUsername?.user.id);
  });

  it("R78 username trùng (không phân biệt hoa thường) bị báo, kể cả khi đang gõ; username và tên sai quy tắc bị từ chối", async () => {
    const s = setup();
    await signUp(s);
    expect(
      await s.auth.api.isUsernameAvailable({ body: { username: "AN.nguyen" } }),
    ).toEqual({ available: false });
    expect(
      await s.auth.api.isUsernameAvailable({ body: { username: "binh" } }),
    ).toEqual({ available: true });

    const other = { email: "binh@example.com" };
    expect(
      await errorCode(signUp(s, { ...other, username: "AN.nguyen" })),
    ).toBe("USERNAME_IS_ALREADY_TAKEN");
    expect(await errorCode(signUp(s, { ...other, username: "đức" }))).toBe(
      "INVALID_USERNAME",
    );
    expect(
      await errorCode(
        signUp(s, { ...other, username: "binh", name: "B".repeat(41) }),
      ),
    ).toBe("INVALID_DISPLAY_NAME");
    expect(s.db.user).toHaveLength(1);
  });

  it("R78 sai thông tin nào cũng cùng một lỗi, không lộ tài khoản nào tồn tại", async () => {
    const s = setup();
    await signUp(s);
    await confirmEmail(s);
    const wrongPassword = { password: "sai-mat-khau-roi" };

    expect(
      await errorCode(
        s.auth.api.signInUsername({
          body: { username: "an.nguyen", ...wrongPassword },
        }),
      ),
    ).toBe(
      await errorCode(
        s.auth.api.signInUsername({
          body: { username: "khong.co", ...wrongPassword },
        }),
      ),
    );
    expect(
      await errorCode(
        s.auth.api.signInEmail({
          body: { email: "an@example.com", ...wrongPassword },
        }),
      ),
    ).toBe(
      await errorCode(
        s.auth.api.signInEmail({
          body: { email: "khong-co@example.com", ...wrongPassword },
        }),
      ),
    );
  });

  it("R78 quên mật khẩu bằng username: link gửi tới email tài khoản; không có tài khoản thì không gửi gì", async () => {
    const s = setup();
    await signUp(s);
    await confirmEmail(s);
    s.sent.length = 0;

    await requestPasswordResetFor(s.auth, "khong.co", "/reset-password");
    expect(s.sent).toEqual([]);
    await requestPasswordResetFor(s.auth, " An.Nguyen ", "/reset-password");
    expect(s.sent).toMatchObject([
      { kind: "reset-password", to: "an@example.com", locale: "vi" },
    ]);
  });

  it("R61 tài khoản tạo bằng Google đặt được mật khẩu qua email, vẫn là một tài khoản; chưa có username", async () => {
    const s = setup();
    const ctx = await s.auth.$context;
    const user = await ctx.internalAdapter.createUser(
      { email: "chi@gmail.com", name: "Trần Thị Chi", emailVerified: true },
      { method: "oauth", oauth: { providerId: "google" } },
    );
    await ctx.internalAdapter.linkAccount({
      userId: user.id,
      providerId: "google",
      accountId: "google-chi",
    });
    expect(s.db.user[0].username ?? null).toBeNull();

    await requestPasswordResetFor(s.auth, "chi@gmail.com", "/reset-password");
    const token = new URL(s.sent.at(-1)!.url).pathname.split("/").at(-1)!;
    await s.auth.api.resetPassword({ body: { token, newPassword: PASSWORD } });

    const signedIn = await s.auth.api.signInEmail({
      body: { email: "chi@gmail.com", password: PASSWORD },
    });
    expect(signedIn.user.id).toBe(user.id);
    expect(s.db.account.map((a) => a.providerId).sort()).toEqual([
      "credential",
      "google",
    ]);
  });

  it("R28 đổi ngôn ngữ của tài khoản; ngôn ngữ app không có bị từ chối", async () => {
    const s = setup();
    await signUp(s);
    await confirmEmail(s);
    const { headers } = await s.auth.api.signInEmail({
      body: { email: "an@example.com", password: PASSWORD },
      returnHeaders: true,
    });
    const session = new Headers({
      cookie: headers
        .getSetCookie()
        .map((cookie) => cookie.split(";")[0])
        .join("; "),
    });

    await s.auth.api.updateUser({ body: { language: "en" }, headers: session });
    expect(s.db.user[0].language).toBe("en");
    expect(
      await errorCode(
        s.auth.api.updateUser({ body: { language: "fr" }, headers: session }),
      ),
    ).toBe("INVALID_LANGUAGE");
  });

  it("bảng và cột Better Auth cần đều có trong schema.prisma", () => {
    const schema = readFileSync(
      path.join(process.cwd(), "prisma/schema.prisma"),
      "utf8",
    );
    const models = new Map(
      // Up to the closing brace on its own line: comments may contain braces.
      [...schema.matchAll(/^model (\w+) \{\n([\s\S]*?)\n\}/gm)].map(
        ([, name, body]) => [
          name.toLowerCase(),
          new Set(
            body
              .split("\n")
              .map((line) => line.trim().split(/\s+/)[0])
              .filter(Boolean),
          ),
        ],
      ),
    );
    for (const table of Object.values(getAuthTables(setup().auth.options))) {
      const columns = models.get(table.modelName.toLowerCase());
      expect(columns, table.modelName).toBeDefined();
      for (const [key, field] of Object.entries(table.fields)) {
        expect(columns, `${table.modelName}.${key}`).toContain(
          field.fieldName ?? key,
        );
      }
    }
  });
});
