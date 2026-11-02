import { describe, expect, it } from "vitest";

import {
  PASSCODE_UNLOCKED,
  afterPasscodeAttempt,
  isPasscodeLocked,
  isValidPasscode,
  isWeakPasscode,
} from "./passcode";

const at = (iso: string) => new Date(iso);

describe("passcode", () => {
  it("R5 đúng 6 chữ số", () => {
    expect(isValidPasscode("048213")).toBe(true);
    for (const bad of [
      "12345",
      "1234567",
      "12a456",
      "１２３４５６",
      " 123456",
    ]) {
      expect(isValidPasscode(bad), bad).toBe(false);
    }
  });

  it("R6 cảnh báo passcode dễ đoán", () => {
    for (const weak of [
      "123456",
      "000000",
      "111111",
      "654321",
      "345678",
      "121212",
      "123123",
      "112233",
      "159753",
    ]) {
      expect(isWeakPasscode(weak), weak).toBe(true);
    }
    for (const fine of ["048213", "730916", "135790", "246813"]) {
      expect(isWeakPasscode(fine), fine).toBe(false);
    }
  });

  it("R9 sai 5 lần liên tiếp thì khóa 12 giờ, báo gửi email một lần", () => {
    let guard = PASSCODE_UNLOCKED;
    const now = at("2026-12-01T10:00:00Z");
    for (let i = 1; i <= 4; i++) {
      const next = afterPasscodeAttempt(guard, false, now);
      expect(next.lockedNow).toBe(false);
      expect(next.guard.failedAttempts).toBe(i);
      guard = next.guard;
    }
    const fifth = afterPasscodeAttempt(guard, false, now);
    expect(fifth.lockedNow).toBe(true);
    expect(fifth.guard.lockedUntil).toEqual(at("2026-12-01T22:00:00Z"));
    expect(isPasscodeLocked(fifth.guard, at("2026-12-01T21:59:59Z"))).toBe(
      true,
    );
    expect(isPasscodeLocked(fifth.guard, at("2026-12-01T22:00:00Z"))).toBe(
      false,
    );
  });

  it("R9 nhập đúng thì đếm lại từ đầu; hết khóa thì lần sai đầu tiên là lần 1", () => {
    const twoWrong = { failedAttempts: 2, lockedUntil: null };
    expect(
      afterPasscodeAttempt(twoWrong, true, at("2026-12-01T10:00:00Z")).guard,
    ).toEqual(PASSCODE_UNLOCKED);

    const expiredLock = {
      failedAttempts: 0,
      lockedUntil: at("2026-12-01T22:00:00Z"),
    };
    const next = afterPasscodeAttempt(
      expiredLock,
      false,
      at("2026-12-02T08:00:00Z"),
    );
    expect(next.guard).toEqual({ failedAttempts: 1, lockedUntil: null });
  });
});
