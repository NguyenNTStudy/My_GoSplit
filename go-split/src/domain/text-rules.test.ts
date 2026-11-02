import { describe, expect, it } from "vitest";

import {
  countChars,
  validateBasicDescription,
  validateItineraryTitle,
  validatePlanName,
} from "./text-rules";

describe("giới hạn độ dài chữ", () => {
  it("R73 tên 50 ký tự lưu được, 51 ký tự bị từ chối", () => {
    expect(validatePlanName("a".repeat(50))).toEqual({
      ok: true,
      value: "a".repeat(50),
    });
    expect(validatePlanName("a".repeat(51))).toEqual({
      ok: false,
      error: "too_long",
      length: 51,
    });
  });

  it("R73 tên rỗng hoặc chỉ có khoảng trắng bị từ chối, khoảng trắng đầu cuối không tính", () => {
    expect(validatePlanName("   ")).toEqual({
      ok: false,
      error: "empty",
      length: 0,
    });
    expect(validatePlanName(`  ${"a".repeat(50)}  `)).toEqual({
      ok: true,
      value: "a".repeat(50),
    });
  });

  it("R73 chữ có dấu gõ dựng sẵn hay tổ hợp đều đếm là một ký tự và lưu dạng NFC", () => {
    const nfd = `${"a".repeat(49)}${"ệ".normalize("NFD")}`;
    expect(Array.from(nfd).length).toBe(52);
    expect(countChars(nfd)).toBe(50);
    expect(validatePlanName(nfd)).toEqual({
      ok: true,
      value: nfd.normalize("NFC"),
    });
    expect(validatePlanName("Đà Lạt cuối tuần".normalize("NFD"))).toEqual({
      ok: true,
      value: "Đà Lạt cuối tuần",
    });
  });

  it("R73 tiêu đề hành trình cùng giới hạn với tên kế hoạch", () => {
    expect(validateItineraryTitle("b".repeat(51)).ok).toBe(false);
  });

  it("R94 mô tả ngắn tối đa 100 ký tự, bỏ trống thì không có mô tả", () => {
    expect(validateBasicDescription("x".repeat(100))).toEqual({
      ok: true,
      value: "x".repeat(100),
    });
    expect(validateBasicDescription("x".repeat(101))).toEqual({
      ok: false,
      error: "too_long",
      length: 101,
    });
    expect(validateBasicDescription("  ")).toEqual({ ok: true, value: null });
    expect(validateBasicDescription(null)).toEqual({ ok: true, value: null });
  });
});
