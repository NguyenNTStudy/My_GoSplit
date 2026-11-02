import { describe, expect, it } from "vitest";

import { parseAmountInput } from "./amount-input";

const vnd = { locale: "vi", minorUnits: 0 } as const;
const usdVi = { locale: "vi", minorUnits: 2 } as const;
const usdEn = { locale: "en", minorUnits: 2 } as const;
const value = (result: ReturnType<typeof parseAmountInput>) =>
  result.ok ? result.value : result.error;

describe("đọc số tiền người dùng gõ", () => {
  it("R18 tiền tệ không có phần lẻ: . và , đều là dấu phân cách hàng nghìn", () => {
    expect(value(parseAmountInput("50.000", vnd))).toBe("50000");
    expect(value(parseAmountInput("50,000", vnd))).toBe("50000");
    expect(value(parseAmountInput("1.250.000", vnd))).toBe("1250000");
    expect(value(parseAmountInput(" 85 500 ₫", vnd))).toBe("85500");
  });

  it("R74 nhận hậu tố k hoặc K", () => {
    expect(value(parseAmountInput("50k", vnd))).toBe("50000");
    expect(value(parseAmountInput("5.250K", vnd))).toBe("5250000");
    expect(value(parseAmountInput("1,5k", vnd))).toBe("1500");
    expect(value(parseAmountInput("2.5k", usdEn))).toBe("2500");
  });

  it("R18 tiền tệ có phần lẻ: nhận đúng dấu thập phân của từng ngôn ngữ", () => {
    expect(value(parseAmountInput("398.50", usdEn))).toBe("398.5");
    expect(value(parseAmountInput("398,5", usdVi))).toBe("398.5");
    expect(value(parseAmountInput("1,234.56", usdEn))).toBe("1234.56");
    expect(value(parseAmountInput("1.234,56", usdVi))).toBe("1234.56");
    // Exactly three digits after a lone separator follow the language's convention.
    expect(value(parseAmountInput("1,234", usdEn))).toBe("1234");
    expect(value(parseAmountInput("1,234", usdVi))).toBe("1.234");
    expect(value(parseAmountInput("$12.5", usdEn))).toBe("12.5");
  });

  it("chữ trống hoặc không phải số thì báo lỗi", () => {
    expect(value(parseAmountInput("   ", vnd))).toBe("empty");
    expect(value(parseAmountInput("abc", vnd))).toBe("invalid");
    expect(value(parseAmountInput("-50", vnd))).toBe("invalid");
    expect(value(parseAmountInput("5k0", vnd))).toBe("invalid");
    expect(value(parseAmountInput("1.2.3,4,5", usdEn))).toBe("invalid");
  });
});
