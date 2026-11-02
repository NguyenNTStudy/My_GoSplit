import { describe, expect, it } from "vitest";

import {
  addDays,
  changePlanStartDate,
  isLocalDate,
  planDayCount,
  shouldAskToMoveItems,
  validatePlanDateRange,
} from "./plan-dates";

describe("ngày của kế hoạch", () => {
  it("R2 kế hoạch dài tối đa 60 ngày, tính cả ngày đi và ngày về", () => {
    expect(validatePlanDateRange("2026-12-01", "2027-01-29")).toBeNull();
    expect(planDayCount("2026-12-01", "2027-01-29")).toBe(60);
    expect(validatePlanDateRange("2026-12-01", "2027-01-30")).toBe("too_long");
    expect(validatePlanDateRange("2026-12-12", "2026-12-12")).toBeNull();
    expect(validatePlanDateRange("2026-12-14", "2026-12-12")).toBe(
      "end_before_start",
    );
    expect(validatePlanDateRange("2026-02-30", "2026-03-02")).toBe(
      "invalid_date",
    );
  });

  it("tính ngày qua tháng, năm và năm nhuận theo lịch, không lệch theo múi giờ", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-03-29", 1)).toBe("2026-03-30");
    expect(isLocalDate("2027-02-29")).toBe(false);
    expect(isLocalDate("2026-1-5")).toBe(false);
  });

  it("R80 đổi ngày đi thì ngày về dời theo, hoạt động và nơi ở dời cùng số ngày, giữ giờ", () => {
    const plan = { startDate: "2026-12-12", endDate: "2026-12-14" };
    const activities = [
      { id: "a1", date: "2026-12-12", time: "06:00" },
      { id: "a2", date: "2026-12-14", time: null },
      { id: "a3", date: null, time: "20:00" },
    ];
    const stays = [
      { id: "s1", checkInDate: "2026-12-12", checkOutDate: "2026-12-14" },
    ];

    const result = changePlanStartDate(plan, "2026-12-30", {
      activities,
      stays,
      moveItems: true,
    });

    expect(result).toEqual({
      ok: true,
      startDate: "2026-12-30",
      endDate: "2027-01-01",
      activities: [
        { id: "a1", date: "2026-12-30", time: "06:00" },
        { id: "a2", date: "2027-01-01", time: null },
        { id: "a3", date: null, time: "20:00" },
      ],
      stays: [
        { id: "s1", checkInDate: "2026-12-30", checkOutDate: "2027-01-01" },
      ],
      staysOutOfRange: [],
    });
  });

  it("R80 không dời thì hoạt động giữ ngày cũ, nơi ở ngoài khoảng ngày mới phải sửa trước khi lưu", () => {
    const plan = { startDate: "2026-12-12", endDate: "2026-12-14" };
    const stays = [
      { id: "s1", checkInDate: "2026-12-12", checkOutDate: "2026-12-14" },
    ];
    const result = changePlanStartDate(plan, "2026-12-13", {
      activities: [{ date: "2026-12-12" }],
      stays,
      moveItems: false,
    });
    expect(result.ok && result.activities).toEqual([{ date: "2026-12-12" }]);
    expect(result.ok && result.staysOutOfRange).toEqual(stays);
  });

  it("R80 R59 chỉ hỏi dời hoạt động và nơi ở khi tổng kết đang mở và có mục để dời", () => {
    expect(shouldAskToMoveItems("open", true)).toBe(true);
    expect(shouldAskToMoveItems("open", false)).toBe(false);
    expect(shouldAskToMoveItems("locked", true)).toBe(false);
  });
});
