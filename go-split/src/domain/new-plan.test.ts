import { describe, expect, it } from "vitest";

import { validateNewPlan } from "./new-plan";

const basic = {
  kind: "basic",
  name: "  Lẩu thứ 6 ",
  currency: "vnd",
  passcode: "048213",
  description: "Quán lẩu bò đầu ngõ",
  participantNames: ["Bình", " ", "Chi", "bình"],
};

const detailed = {
  kind: "detailed",
  name: "Đà Lạt cuối tuần",
  currency: "USD",
  passcode: "048213",
  location: "Đà Lạt",
  startDate: "2026-12-12",
  endDate: "2026-12-14",
  notes: "",
  theme: "bien",
};

describe("tạo kế hoạch", () => {
  it("R93 R95 kế hoạch cơ bản: tên, tiền tệ, mô tả ngắn, tên người tham gia (bỏ trống và trùng)", () => {
    expect(validateNewPlan(basic)).toEqual({
      ok: true,
      plan: {
        kind: "basic",
        name: "Lẩu thứ 6",
        currency: "VND",
        passcode: "048213",
        description: "Quán lẩu bò đầu ngõ",
        participantNames: ["Bình", "Chi"],
      },
    });
  });

  it("R94 mô tả ngắn tối đa 100 ký tự", () => {
    expect(
      validateNewPlan({ ...basic, description: "x".repeat(101) }),
    ).toMatchObject({
      ok: false,
      errors: { description: { area: "text", code: "too_long" } },
    });
  });

  it("R2 R29 kế hoạch chi tiết: ngày đi, ngày về tối đa 60 ngày, theme", () => {
    expect(validateNewPlan(detailed)).toMatchObject({
      ok: true,
      plan: {
        kind: "detailed",
        theme: "bien",
        notes: null,
        location: "Đà Lạt",
      },
    });
    expect(
      validateNewPlan({ ...detailed, endDate: "2026-12-11" }),
    ).toMatchObject({ errors: { endDate: { code: "end_before_start" } } });
    expect(
      validateNewPlan({ ...detailed, endDate: "2027-02-10" }),
    ).toMatchObject({
      errors: { endDate: { code: "too_long", values: { max: 60 } } },
    });
    expect(validateNewPlan({ ...detailed, theme: "khong-co" })).toMatchObject({
      plan: { theme: "gao-am" },
    });
  });

  it("R5 R73 báo lỗi từng ô: tên trống, tiền tệ lạ, passcode sai dạng", () => {
    expect(
      validateNewPlan({
        ...detailed,
        name: " ",
        currency: "XXX",
        passcode: "12345",
      }),
    ).toEqual({
      ok: false,
      errors: {
        name: { area: "text", code: "empty", values: { max: 50 } },
        currency: { area: "currency", code: "unsupported" },
        passcode: { area: "passcode", code: "invalid" },
      },
    });
  });
});
