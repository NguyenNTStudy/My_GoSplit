import { describe, expect, it } from "vitest";

import {
  canUseCommunity,
  isAccountLocked,
  isAdmin,
  validateUsername,
} from "./account";
import { validateDisplayName } from "./text-rules";

const now = new Date("2026-12-01T10:00:00Z");

describe("tài khoản", () => {
  it("R78 username 3–20 ký tự, chữ thường không dấu, số, dấu chấm, gạch dưới", () => {
    expect(validateUsername("an.nguyen_92")).toEqual({
      ok: true,
      value: "an.nguyen_92",
    });
    expect(validateUsername(" An.Nguyen ")).toEqual({
      ok: true,
      value: "an.nguyen",
    });
    expect(validateUsername("an")).toEqual({ ok: false, error: "too_short" });
    expect(validateUsername("a".repeat(21))).toEqual({
      ok: false,
      error: "too_long",
    });
    for (const bad of ["đức", "an nguyen", "an-nguyen", "an@x"]) {
      expect(validateUsername(bad), bad).toEqual({
        ok: false,
        error: "invalid_characters",
      });
    }
  });

  it("R78 tên hiển thị 1–40 ký tự, không cần duy nhất", () => {
    expect(validateDisplayName("  Nguyễn Văn An ")).toEqual({
      ok: true,
      value: "Nguyễn Văn An",
    });
    expect(validateDisplayName("   ")).toMatchObject({
      ok: false,
      error: "empty",
    });
    expect(validateDisplayName("ệ".repeat(40)).ok).toBe(true);
    expect(validateDisplayName("ệ".repeat(41))).toMatchObject({
      ok: false,
      error: "too_long",
    });
  });

  it("R44 admin do người vận hành chỉ định", () => {
    expect(isAdmin({ role: "admin" })).toBe(true);
    expect(isAdmin({ role: "user" })).toBe(false);
    expect(isAdmin({})).toBe(false);
  });

  it("R44 tài khoản bị khóa không đăng, thả tim, báo cáo; hết hạn khóa thì dùng lại được", () => {
    expect(canUseCommunity({ banned: false }, now)).toBe(true);
    expect(canUseCommunity({ banned: true }, now)).toBe(false);
    expect(
      isAccountLocked(
        { banned: true, banExpires: new Date("2026-12-02T00:00:00Z") },
        now,
      ),
    ).toBe(true);
    expect(
      canUseCommunity(
        { banned: true, banExpires: new Date("2026-11-30T00:00:00Z") },
        now,
      ),
    ).toBe(true);
  });
});
