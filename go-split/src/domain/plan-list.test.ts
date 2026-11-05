import { describe, expect, it } from "vitest";

import type { ListedPlan } from "./plan-list";
import { groupPlans, isUnsettled, readPlanFilter } from "./plan-list";

const plan = (
  name: string,
  fields: Partial<ListedPlan> = {},
): ListedPlan & { name: string } => ({
  name,
  kind: "detailed",
  role: "owner",
  summaryStatus: "open",
  startDate: "2026-12-12",
  endDate: "2026-12-14",
  createdAt: "2026-11-01T10:00:00.000Z",
  ...fields,
});

describe("danh sách kế hoạch", () => {
  const plans = [
    plan("Phú Quốc", { startDate: "2027-01-02", endDate: "2027-01-05" }),
    plan("Đà Lạt"),
    plan("Mù Cang Chải", {
      summaryStatus: "final",
      startDate: "2026-09-25",
      endDate: "2026-09-27",
    }),
    plan("Sa Pa", {
      summaryStatus: "final",
      startDate: "2026-10-10",
      endDate: "2026-10-12",
    }),
    plan("Lẩu thứ 6", {
      kind: "basic",
      startDate: null,
      endDate: null,
      createdAt: "2026-11-20T10:00:00.000Z",
      role: "editor",
    }),
  ];

  it("R60 R62 R96 Sắp diễn ra theo ngày đi tăng dần (cơ bản theo ngày tạo), Đã tổng kết mới nhất trước", () => {
    const { upcoming, finished } = groupPlans(plans, "all");
    expect(upcoming.map((p) => p.name)).toEqual([
      "Lẩu thứ 6",
      "Đà Lạt",
      "Phú Quốc",
    ]);
    expect(finished.map((p) => p.name)).toEqual(["Sa Pa", "Mù Cang Chải"]);
  });

  it("R84 lọc Tôi tạo và Đang tham gia", () => {
    expect(groupPlans(plans, "joined").upcoming.map((p) => p.name)).toEqual([
      "Lẩu thứ 6",
    ]);
    expect(groupPlans(plans, "mine").upcoming).toHaveLength(2);
    expect(readPlanFilter("joined")).toBe("joined");
    expect(readPlanFilter("anything")).toBe("all");
  });

  it("R62 đã qua ngày về mà chưa chốt thì có nhãn Chưa chốt tổng kết", () => {
    expect(isUnsettled(plan("Đà Lạt"), "2026-12-15")).toBe(true);
    expect(isUnsettled(plan("Đà Lạt"), "2026-12-14")).toBe(false);
    expect(
      isUnsettled(plan("Sa Pa", { summaryStatus: "final" }), "2027-01-01"),
    ).toBe(false);
    expect(
      isUnsettled(plan("Lẩu", { kind: "basic", endDate: null }), "2027-01-01"),
    ).toBe(false);
  });
});
