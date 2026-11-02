import { describe, expect, it } from "vitest";

import data from "./currencies.json";
import {
  currencyPickerSections,
  defaultCurrency,
  findCurrency,
  getCurrencyRules,
  isSelectableCurrency,
  regionOfLocale,
  searchCurrencies,
} from "./currency";

const codes = (list: { code: string }[]) =>
  list.map((currency) => currency.code);

describe("danh sách tiền tệ", () => {
  it("R71 chỉ gồm tiền tệ đang lưu hành, có tên tiếng Việt, tiếng Anh, ký hiệu và nước dùng", () => {
    expect(data.currencies.length).toBeGreaterThan(140);
    for (const currency of data.currencies) {
      expect(currency.code).toMatch(/^[A-Z]{3}$/);
      expect(currency.name.vi).toBeTruthy();
      expect(currency.name.en).toBeTruthy();
      expect(currency.narrowSymbol).toBeTruthy();
      expect(currency.countries.length).toBeGreaterThan(0);
    }
    expect(isSelectableCurrency("HRK")).toBe(false);
    expect(findCurrency("vnd")?.name.vi).toBe("Đồng Việt Nam");
  });

  it("R18 R19 VND, JPY, KRW không có phần lẻ, bước làm tròn 1.000, 10, 100", () => {
    expect(getCurrencyRules("VND")).toEqual({
      code: "VND",
      minorUnits: 0,
      roundingStep: "1000",
    });
    expect(getCurrencyRules("JPY")).toEqual({
      code: "JPY",
      minorUnits: 0,
      roundingStep: "10",
    });
    expect(getCurrencyRules("KRW")).toEqual({
      code: "KRW",
      minorUnits: 0,
      roundingStep: "100",
    });
  });

  it("R19 tiền tệ có phần lẻ dùng bước 0,5", () => {
    expect(getCurrencyRules("USD")).toEqual({
      code: "USD",
      minorUnits: 2,
      roundingStep: "0.5",
    });
    expect(getCurrencyRules("KWD")).toEqual({
      code: "KWD",
      minorUnits: 3,
      roundingStep: "0.5",
    });
    for (const currency of data.currencies) {
      if (currency.minorUnits > 0) expect(currency.roundingStep).toBe("0.5");
    }
  });

  it("R72 tiền tệ đã bỏ khỏi danh sách vẫn tính được cho kế hoạch cũ", () => {
    expect(getCurrencyRules("HRK")).toEqual({
      code: "HRK",
      minorUnits: 2,
      roundingStep: "0.5",
    });
    expect(() => getCurrencyRules("not a code")).toThrow(RangeError);
  });
});

describe("tìm tiền tệ", () => {
  it("R71 tìm `nhat`, `yen`, `yên`, `JPY`, `Japan` đều ra Yên Nhật đầu tiên", () => {
    for (const query of [
      "nhat",
      "yen",
      "yên",
      "JPY",
      "jpy",
      "Japan",
      "Nhật Bản",
    ]) {
      expect(searchCurrencies(query)[0]?.code, query).toBe("JPY");
    }
  });

  it("R71 tìm theo ký hiệu", () => {
    expect(searchCurrencies("₫")[0]?.code).toBe("VND");
    expect(searchCurrencies("$")[0]?.code).toBe("USD");
    expect(codes(searchCurrencies("$"))).toContain("SGD");
  });

  it("R34 không phân biệt dấu và hoa thường", () => {
    expect(searchCurrencies("dong viet nam")[0]?.code).toBe("VND");
    expect(searchCurrencies("ĐỒNG")[0]?.code).toBe("VND");
    expect(searchCurrencies("thai")[0]?.code).toBe("THB");
    expect(searchCurrencies("singapore")[0]?.code).toBe("SGD");
  });

  it("R71 không có kết quả khi ô trống hoặc không khớp", () => {
    expect(searchCurrencies("   ")).toEqual([]);
    expect(searchCurrencies("khongcotientenay")).toEqual([]);
  });
});

describe("bộ chọn tiền tệ khi chưa gõ", () => {
  it("R71 hiện tiền tệ dùng gần đây, rồi nhóm phổ biến, rồi toàn bộ theo chữ cái", () => {
    const sections = currencyPickerSections(["USD", "vnd", "USD", "HRK"]);
    expect(codes(sections.recent)).toEqual(["USD", "VND"]);
    expect(codes(sections.popular)).toEqual([
      "EUR",
      "THB",
      "JPY",
      "KRW",
      "SGD",
      "CNY",
    ]);
    expect(codes(sections.all)).toEqual([...codes(sections.all)].sort());
    expect(sections.all.length).toBe(data.currencies.length);
  });

  it("R71 chưa có kế hoạch nào thì nhóm phổ biến đủ 8 tiền tệ", () => {
    const sections = currencyPickerSections([]);
    expect(sections.recent).toEqual([]);
    expect(codes(sections.popular)).toEqual([
      "VND",
      "USD",
      "EUR",
      "THB",
      "JPY",
      "KRW",
      "SGD",
      "CNY",
    ]);
  });
});

describe("tiền tệ mặc định khi tạo kế hoạch", () => {
  it("R70 ưu tiên tiền tệ của kế hoạch gần nhất", () => {
    expect(
      defaultCurrency({
        lastPlanCurrency: "JPY",
        browserRegion: "VN",
        language: "vi",
      }),
    ).toBe("JPY");
  });

  it("R70 chưa có kế hoạch thì theo vùng của trình duyệt", () => {
    expect(
      defaultCurrency({
        browserRegion: regionOfLocale("vi-VN"),
        language: "vi",
      }),
    ).toBe("VND");
    expect(
      defaultCurrency({
        browserRegion: regionOfLocale("en-SG"),
        language: "en",
      }),
    ).toBe("SGD");
    expect(
      defaultCurrency({
        lastPlanCurrency: "HRK",
        browserRegion: "TH",
        language: "vi",
      }),
    ).toBe("THB");
  });

  it("R70 trình duyệt không có vùng thì theo ngôn ngữ: tiếng Việt là VND, tiếng Anh là USD", () => {
    expect(regionOfLocale("vi")).toBeNull();
    expect(
      defaultCurrency({ browserRegion: regionOfLocale("vi"), language: "vi" }),
    ).toBe("VND");
    expect(defaultCurrency({ browserRegion: null, language: "en" })).toBe(
      "USD",
    );
    expect(defaultCurrency({ browserRegion: "ZZ", language: "en" })).toBe(
      "USD",
    );
  });
});
