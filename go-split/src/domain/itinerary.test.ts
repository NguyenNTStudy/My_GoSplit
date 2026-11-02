import { describe, expect, it } from "vitest";

import {
  copyItineraryActivitiesToPlan,
  copyItineraryToNewPlan,
  createItineraryDraft,
  planDateForItineraryDay,
  validateItineraryDraft,
  type PlanActivity,
} from "./itinerary";

const VND = { code: "VND", minorUnits: 0, roundingStep: "1000" };
const USD = { code: "USD", minorUnits: 2, roundingStep: "0.5" };

const activity = (
  name: string,
  date: string | null,
  time: string | null = null,
): PlanActivity => ({
  name,
  date,
  time,
  location: null,
  mapLink: null,
  notes: null,
});

const finalPlan = {
  kind: "detailed" as const,
  summaryStatus: "final" as const,
  name: "Đà Lạt cuối tuần",
  location: "Đà Lạt",
  startDate: "2026-12-12",
  endDate: "2026-12-14",
  theme: "gao-am",
  currency: USD,
};

const baseInput = {
  plan: finalPlan,
  participantCount: 5,
  expenseAmounts: ["398.50"],
  activities: [] as PlanActivity[],
  stays: [],
  foods: [],
  language: "vi",
};

describe("tạo hành trình từ kế hoạch đã chốt", () => {
  it("R64 R81 ngày thật đổi thành số thứ tự ngày, bỏ hoạt động chưa xác định ngày", () => {
    const result = createItineraryDraft({
      ...baseInput,
      activities: [
        activity("Dốc Bắc Sum", "2026-12-12", "15:00"),
        activity("Xuất phát", "2026-12-12", "06:00"),
        activity("Chợ đêm", "2026-12-13"),
        activity("Cột cờ", "2026-12-13", "07:00"),
        activity("Chưa xếp ngày", null, "09:00"),
        activity("Ngoài chuyến đi", "2026-12-20", "09:00"),
      ],
      stays: [
        {
          name: "Homestay trên đồi",
          area: "Đà Lạt",
          country: "VN",
          address: null,
          mapLink: null,
          checkInDate: "2026-12-12",
          checkOutDate: "2026-12-14",
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.droppedActivityCount).toBe(2);
    expect(result.draft.dayCount).toBe(3);
    expect(result.draft.activities.map((a) => [a.day, a.time, a.name])).toEqual(
      [
        [1, "06:00", "Xuất phát"],
        [1, "15:00", "Dốc Bắc Sum"],
        [2, "07:00", "Cột cờ"],
        [2, null, "Chợ đêm"],
      ],
    );
    expect(result.draft.activities[0]).not.toHaveProperty("date");
    expect(result.draft.stays[0]).toMatchObject({
      areaSearch: "da lat",
      checkInDay: 1,
      checkOutDay: 3,
    });
    expect(result.draft.destinationSearch).toBe("da lat");
  });

  it("R65 chi phí ước tính mỗi người là tổng chi chia đều cho số người, làm tròn lên như R19", () => {
    const usd = createItineraryDraft({
      ...baseInput,
      expenseAmounts: ["398.50"],
      participantCount: 5,
    });
    expect(usd.ok && usd.draft.estimatedCostPerPerson).toBe("80");
    const vnd = createItineraryDraft({
      ...baseInput,
      plan: { ...finalPlan, currency: VND },
      expenseAmounts: ["640000", "120000", "180000", "90000"],
      participantCount: 4,
    });
    expect(vnd.ok && vnd.draft.estimatedCostPerPerson).toBe("258000");
  });

  it("R65 không có khoản chi hoặc tác giả bỏ chi phí ước tính thì không có chi phí", () => {
    const none = createItineraryDraft({ ...baseInput, expenseAmounts: [] });
    expect(none.ok && none.draft.estimatedCostPerPerson).toBeNull();
    const omitted = createItineraryDraft({
      ...baseInput,
      includeEstimatedCost: false,
    });
    expect(omitted.ok && omitted.draft.estimatedCostPerPerson).toBeNull();
  });

  it("R63 R94 chỉ kế hoạch chi tiết đã chốt mới chia sẻ được", () => {
    expect(
      createItineraryDraft({
        ...baseInput,
        plan: { ...finalPlan, summaryStatus: "locked" },
      }),
    ).toEqual({
      ok: false,
      error: "summary_not_final",
    });
    expect(
      createItineraryDraft({
        ...baseInput,
        plan: { ...finalPlan, kind: "basic" },
      }),
    ).toEqual({
      ok: false,
      error: "not_detailed",
    });
  });

  it("R66 R73 hành trình cần ít nhất một hoạt động và tiêu đề hợp lệ", () => {
    expect(validateItineraryDraft({ title: "Đà Lạt", activities: [] })).toEqual(
      ["no_activities"],
    );
    expect(
      validateItineraryDraft({
        title: "x".repeat(51),
        activities: [{ day: 1, ...activity("A", null) }],
      }),
    ).toEqual(["too_long"]);
  });
});

describe("sao chép hành trình", () => {
  const itinerary = {
    title: "Đà Lạt 3 ngày 2 đêm",
    destination: "Đà Lạt",
    theme: "nui-rung",
    currency: "JPY",
    dayCount: 3,
    activities: [
      {
        day: 1,
        time: "06:00",
        name: "Xuất phát",
        location: null,
        mapLink: null,
        notes: null,
      },
      {
        day: 3,
        time: null,
        name: "Về",
        location: null,
        mapLink: null,
        notes: null,
      },
    ],
    stays: [
      {
        name: "Homestay",
        area: "Đà Lạt",
        country: "VN",
        address: null,
        mapLink: null,
        checkInDay: 1,
        checkOutDay: 3,
      },
    ],
    foods: [
      {
        dishName: "Lẩu bò",
        placeName: "Ba Toa",
        directions: null,
        mealSlots: ["evening" as const],
        notes: null,
        order: 5,
      },
    ],
  };

  it("R68 sao chép thành kế hoạch mới: chỉ chọn ngày đi, ngày về theo số ngày, hoạt động đúng ngày và giữ giờ", () => {
    const result = copyItineraryToNewPlan(itinerary, "2027-03-20");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.plan).toEqual({
      kind: "detailed",
      name: "Đà Lạt 3 ngày 2 đêm",
      location: "Đà Lạt",
      startDate: "2027-03-20",
      endDate: "2027-03-22",
      theme: "nui-rung",
      currency: "JPY",
    });
    expect(result.activities.map((a) => [a.date, a.time])).toEqual([
      ["2027-03-20", "06:00"],
      ["2027-03-22", null],
    ]);
    expect(result.stays[0]).toMatchObject({
      checkInDate: "2027-03-20",
      checkOutDate: "2027-03-22",
      areaSearch: "da lat",
    });
    expect(result.foods).toEqual([{ ...itinerary.foods[0], order: 0 }]);
  });

  it("R79 R81 kế hoạch 3 ngày nhận lịch trình 4 ngày: Ngày 4 vào mục Ngày chưa xác định, giữ giờ", () => {
    const plan = {
      kind: "detailed" as const,
      summaryStatus: "open" as const,
      startDate: "2026-12-12",
      endDate: "2026-12-14",
    };
    expect(
      [1, 2, 3, 4].map((day) => planDateForItineraryDay(plan, day)),
    ).toEqual(["2026-12-12", "2026-12-13", "2026-12-14", null]);
    const result = copyItineraryActivitiesToPlan(plan, [
      {
        day: 1,
        time: null,
        name: "Chợ Đà Lạt",
        location: null,
        mapLink: null,
        notes: null,
      },
      {
        day: 4,
        time: "07:30",
        name: "Đồi chè Cầu Đất",
        location: null,
        mapLink: null,
        notes: null,
      },
    ]);
    expect(
      result.ok && result.activities.map((a) => [a.name, a.date, a.time]),
    ).toEqual([
      ["Chợ Đà Lạt", "2026-12-12", null],
      ["Đồi chè Cầu Đất", null, "07:30"],
    ]);
  });

  it("R79 tổng kết đang khóa thì không sao chép được hoạt động; phải chọn ít nhất một hoạt động", () => {
    const locked = {
      kind: "detailed" as const,
      summaryStatus: "locked" as const,
      startDate: "2026-12-12",
      endDate: "2026-12-14",
    };
    expect(copyItineraryActivitiesToPlan(locked, itinerary.activities)).toEqual(
      { ok: false, error: "summary_not_open" },
    );
    expect(
      copyItineraryActivitiesToPlan({ ...locked, summaryStatus: "open" }, []),
    ).toEqual({
      ok: false,
      error: "nothing_selected",
    });
  });
});
