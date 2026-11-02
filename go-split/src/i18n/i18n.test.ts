import { describe, expect, it } from "vitest";
import { z } from "zod";

import en from "../../messages/en.json";
import vi from "../../messages/vi.json";

import { negotiateLocale } from "./config";
import {
  formatMoney,
  formatTripDate,
  formatTripDateRange,
  formatTripDay,
  formatTripTime,
} from "./format";
import { DOMAIN_ERRORS, issueText, safeParseLocalized } from "./validation";

// Intl puts no-break spaces between number and symbol; compare with plain spaces.
const plain = (text: string) => text.replace(/[  ]/g, " ");

type Tree = { [key: string]: string | Tree };
const flatten = (tree: Tree, prefix = ""): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string"
      ? { ...acc, [path]: value }
      : { ...acc, ...flatten(value, path) };
  }, {});
const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)/g)].map((m) => m[1]).sort();

describe("chọn ngôn ngữ", () => {
  it("R28 theo ngôn ngữ của trình duyệt, ngôn ngữ khác thì dùng English", () => {
    expect(negotiateLocale("vi-VN,vi;q=0.9,en;q=0.8")).toBe("vi");
    expect(negotiateLocale("en-US,en;q=0.9")).toBe("en");
    expect(negotiateLocale("fr-FR,vi;q=0.8")).toBe("vi");
    expect(negotiateLocale("fr-FR,de;q=0.8")).toBe("en");
    expect(negotiateLocale("vi;q=0")).toBe("en");
    expect(negotiateLocale(null)).toBe("en");
  });
});

describe("file dịch", () => {
  const viKeys = flatten(vi as Tree);
  const enKeys = flatten(en as Tree);

  it("tiếng Việt và English có cùng các key, không key nào trống", () => {
    expect(Object.keys(enKeys).sort()).toEqual(Object.keys(viKeys).sort());
    for (const value of [...Object.values(viKeys), ...Object.values(enKeys)]) {
      expect(value.trim()).not.toBe("");
    }
  });

  it("biến trong câu dịch giống nhau ở hai ngôn ngữ", () => {
    for (const [key, value] of Object.entries(viKeys)) {
      expect(placeholders(enKeys[key]), key).toEqual(placeholders(value));
    }
  });

  it("mọi mã lỗi của src/domain đều có câu dịch", () => {
    for (const [area, codes] of Object.entries(DOMAIN_ERRORS)) {
      for (const code of codes) {
        expect(
          viKeys[`validation.${area}.${code}`],
          `${area}.${code}`,
        ).toBeTruthy();
      }
    }
  });
});

describe("định dạng số tiền", () => {
  it("R74 bội số của 1.000 rút gọn: k trong tiếng Việt, K trong tiếng Anh", () => {
    expect(plain(formatMoney(50000, "VND", "vi"))).toBe("50k ₫");
    expect(plain(formatMoney(5250000, "VND", "vi"))).toBe("5.250k ₫");
    expect(plain(formatMoney(50000, "VND", "en"))).toBe("₫50K");
    expect(plain(formatMoney(2000, "USD", "en"))).toBe("$2K");
  });

  it("R74 không rút gọn khi mất chữ số; phần lẻ chỉ hiện khi tiền tệ có phần lẻ", () => {
    expect(plain(formatMoney(85500, "VND", "vi"))).toBe("85.500 ₫");
    expect(plain(formatMoney("398.5", "USD", "en"))).toBe("$398.50");
    expect(plain(formatMoney(0, "VND", "vi"))).toBe("0 ₫");
    expect(plain(formatMoney(50000, "VND", "vi", { shorten: false }))).toBe(
      "50.000 ₫",
    );
  });

  it("R28 ký hiệu tiền tệ không đổi theo ngôn ngữ", () => {
    expect(plain(formatMoney("12.5", "USD", "vi"))).toContain("$");
    expect(plain(formatMoney("12.5", "USD", "vi"))).not.toContain("US$");
  });
});

describe("định dạng ngày giờ của chuyến đi", () => {
  it("ngày kèm thứ: T7 05/12 trong tiếng Việt, Sat, Dec 5 trong tiếng Anh", () => {
    expect(formatTripDay("2026-12-05", "vi")).toBe("T7 05/12");
    expect(formatTripDay("2026-12-06", "vi")).toBe("CN 06/12");
    expect(plain(formatTripDay("2026-12-05", "en"))).toBe("Sat, Dec 5");
  });

  it("khoảng ngày gọn: cùng tháng, khác tháng, khác năm", () => {
    expect(formatTripDateRange("2026-12-12", "2026-12-14", "vi")).toBe(
      "12–14/12/2026",
    );
    expect(formatTripDateRange("2026-11-30", "2026-12-02", "vi")).toBe(
      "30/11–02/12/2026",
    );
    expect(formatTripDateRange("2026-12-30", "2027-01-02", "vi")).toBe(
      "30/12/2026–02/01/2027",
    );
    expect(
      plain(formatTripDateRange("2026-12-12", "2026-12-14", "en")),
    ).toMatch(/^Dec 12\s?–\s?14, 2026$/);
    expect(formatTripDate("2026-12-05", "vi")).toBe("05/12/2026");
  });

  it("giờ theo ngôn ngữ", () => {
    expect(formatTripTime("06:00", "vi")).toBe("06:00");
    expect(plain(formatTripTime("06:00", "en"))).toBe("6:00 AM");
    expect(plain(formatTripTime("15:30", "en"))).toBe("3:30 PM");
  });
});

describe("lỗi kiểm tra dữ liệu", () => {
  it("câu lỗi của Zod theo ngôn ngữ của người dùng, từng lần kiểm tra", () => {
    const schema = z.string();
    const viIssue = safeParseLocalized(schema, 1, "vi").error!.issues[0];
    const enIssue = safeParseLocalized(schema, 1, "en").error!.issues[0];
    expect(viIssue.message).not.toBe(enIssue.message);
  });

  it("câu lỗi riêng của schema là key trong file dịch", () => {
    const schema = z.string().max(50, { error: "validation.text.too_long" });
    const issue = safeParseLocalized(schema, "x".repeat(51), "vi").error!
      .issues[0];
    expect(issueText(issue, (key) => `t:${key}`)).toBe("t:text.too_long");
  });
});
