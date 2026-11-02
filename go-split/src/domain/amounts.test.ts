import { describe, expect, it } from "vitest";

import { validateAmount, validateRatio } from "./amounts";

const VND = { minorUnits: 0 };
const USD = { minorUnits: 2 };

const error = (
  result: ReturnType<typeof validateAmount> | ReturnType<typeof validateRatio>,
) => (result.ok ? null : result.error);

describe("kiểm tra số tiền", () => {
  it("R14 số tiền phải lớn hơn 0", () => {
    expect(error(validateAmount("0", VND))).toBe("not_positive");
    expect(error(validateAmount("-50000", VND))).toBe("not_positive");
    expect(error(validateAmount("abc", VND))).toBe("not_a_number");
    expect(error(validateAmount(Number.NaN, VND))).toBe("not_a_number");
  });

  it("R18 tiền tệ không có phần lẻ chỉ nhận số nguyên", () => {
    const ok = validateAmount("50000", VND);
    expect(ok.ok && ok.value.toString()).toBe("50000");
    expect(error(validateAmount("50000.5", VND))).toBe("fraction_not_allowed");
  });

  it("R18 tiền tệ khác nhận tối đa 3 chữ số thập phân", () => {
    expect(validateAmount("12.345", USD).ok).toBe(true);
    expect(error(validateAmount("12.3456", USD))).toBe("too_many_decimals");
  });

  it("số tiền không vượt quá giới hạn lưu trữ NUMERIC(14,3)", () => {
    expect(validateAmount("99999999999", VND).ok).toBe(true);
    expect(error(validateAmount("100000000000", VND))).toBe("too_large");
  });
});

describe("kiểm tra tỷ lệ", () => {
  it("R16 tỷ lệ phải lớn hơn 0", () => {
    expect(validateRatio("1").ok).toBe(true);
    expect(validateRatio("0.5").ok).toBe(true);
    expect(error(validateRatio("0"))).toBe("not_positive");
    expect(error(validateRatio("-1"))).toBe("not_positive");
    expect(error(validateRatio("1.23456"))).toBe("too_many_decimals");
  });
});
