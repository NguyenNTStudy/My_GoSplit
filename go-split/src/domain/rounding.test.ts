import { describe, expect, it } from "vitest";

import { Dec } from "./decimal";
import { roundDownToStep, roundUpToStep } from "./rounding";
import { normalizeSearchText } from "./search-text";

describe("làm tròn theo bước của tiền tệ", () => {
  it("R19 tiền tệ có phần lẻ làm tròn lên bội số 0,5", () => {
    expect(roundUpToStep("3.11", "0.5").toString()).toBe("3.5");
    expect(roundUpToStep("3.6", "0.5").toString()).toBe("4");
    expect(roundUpToStep("3.5", "0.5").toString()).toBe("3.5");
  });

  it("R19 VND làm tròn lên bội số 1.000, JPY 10, KRW 100", () => {
    expect(roundUpToStep("79200", "1000").toString()).toBe("80000");
    expect(roundUpToStep("80000", "1000").toString()).toBe("80000");
    expect(roundUpToStep("1234", "10").toString()).toBe("1240");
    expect(roundUpToStep("1201", "100").toString()).toBe("1300");
  });

  it("R19 số dư làm tròn xuống", () => {
    expect(roundDownToStep("3.6", "0.5").toString()).toBe("3.5");
    expect(roundDownToStep("405999", "1000").toString()).toBe("405000");
    expect(roundDownToStep("0.4", "0.5").toString()).toBe("0");
  });

  it("R18 giữ đủ độ chính xác trước khi làm tròn", () => {
    // 100.000 ₫ chia 3 người: 33.333,33… mỗi người, làm tròn lên thành 34.000.
    const exact = new Dec(100000).div(3);
    expect(exact.mul(3).toDecimalPlaces(20).toString()).toBe("100000");
    expect(roundUpToStep(exact, "1000").toString()).toBe("34000");
  });
});

describe("chuẩn hóa chữ để tìm kiếm", () => {
  it("R34 bỏ dấu, chữ thường, đ thành d, gộp khoảng trắng", () => {
    expect(normalizeSearchText("Đà  Lạt")).toBe("da lat");
    expect(normalizeSearchText("  ĐÀ NẴNG ")).toBe("da nang");
    expect(normalizeSearchText("Huế")).toBe("hue");
    expect(normalizeSearchText("Phú Quốc\tKiên Giang")).toBe(
      "phu quoc kien giang",
    );
  });

  it("R34 chữ có dấu gõ bằng bộ gõ khác nhau (dựng sẵn và tổ hợp) cho cùng kết quả", () => {
    expect(normalizeSearchText("Lạt".normalize("NFC"))).toBe(
      normalizeSearchText("Lạt".normalize("NFD")),
    );
  });
});
