import { describe, expect, it } from "vitest";

import {
  countDistinctPlaces,
  hasEnoughPlaces,
  isSameFood,
  prepareFoodsToAdd,
} from "./food-match";

describe("quán và món trùng", () => {
  it("R35 nhiều món ở cùng một quán chỉ tính một quán, so tên không dấu", () => {
    const entries = [
      { placeName: "Bánh căn Nhà Chung" },
      { placeName: "banh can nha chung" },
      { placeName: "  BÁNH CĂN  NHÀ CHUNG " },
      { placeName: "Dì Đinh" },
    ];
    expect(countDistinctPlaces(entries)).toBe(2);
    expect(hasEnoughPlaces(entries)).toBe(false);
    expect(hasEnoughPlaces([...entries, { placeName: "Quán Gỗ" }])).toBe(true);
  });

  it("R35 mục không có tên quán không được tính", () => {
    expect(
      countDistinctPlaces([
        { placeName: "" },
        { placeName: null },
        { placeName: "Dì Đinh" },
      ]),
    ).toBe(1);
  });

  it("R41 cùng món, cùng quán là trùng; khác quán thì không", () => {
    expect(
      isSameFood(
        { dishName: "Bánh căn", placeName: "Nhà Chung" },
        { dishName: "banh can", placeName: "nha chung" },
      ),
    ).toBe(true);
    expect(
      isSameFood(
        { dishName: "Bánh căn", placeName: "Nhà Chung" },
        { dishName: "Bánh căn", placeName: "Dì Đinh" },
      ),
    ).toBe(false);
    expect(
      isSameFood(
        { dishName: "Cà phê sữa", placeName: null },
        { dishName: "ca phe sua", placeName: "" },
      ),
    ).toBe(true);
  });

  it("R41 R79 món thêm vào nằm cuối danh sách và đánh dấu món đã có trong kế hoạch", () => {
    const existing = [
      { dishName: "Bánh căn", placeName: "Bánh căn Nhà Chung", order: 0 },
      { dishName: "Bánh tráng nướng", placeName: "Dì Đinh", order: 3 },
    ];
    const items = [
      { dishName: "banh trang nuong", placeName: "di dinh" },
      { dishName: "Lẩu bò", placeName: "Ba Toa" },
      { dishName: "Lẩu bò", placeName: "Ba Toa" },
    ];
    expect(prepareFoodsToAdd(existing, items)).toEqual([
      { ...items[0], order: 4, alreadyInPlan: true },
      { ...items[1], order: 5, alreadyInPlan: false },
      { ...items[2], order: 6, alreadyInPlan: true },
    ]);
    expect(prepareFoodsToAdd([], items)[0]).toMatchObject({
      order: 0,
      alreadyInPlan: false,
    });
  });
});
