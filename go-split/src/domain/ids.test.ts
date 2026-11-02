import { describe, expect, it } from "vitest";

import {
  generatePlanId,
  generatePublicId,
  generateShareKey,
  generateUserTag,
} from "./ids";

const sample = (generate: () => string, count = 2000) =>
  Array.from({ length: count }, generate);

describe("mã ngẫu nhiên", () => {
  it("R4 planId gồm đúng 10 chữ số, có thể bắt đầu bằng 0", () => {
    const ids = sample(generatePlanId);
    for (const id of ids) expect(id).toMatch(/^\d{10}$/);
    expect(ids.some((id) => id.startsWith("0"))).toBe(true);
    expect(new Set(ids.map((id) => id[0])).size).toBe(10);
  });

  it("R3 shareKey có 128 bit, an toàn cho URL, không lặp lại", () => {
    const keys = sample(generateShareKey);
    for (const key of keys) expect(key).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("R83 publicId gồm 12 ký tự dễ đọc, không lặp lại", () => {
    const ids = sample(generatePublicId);
    for (const id of ids) expect(id).toMatch(/^[0-9a-hjkmnp-tv-z]{12}$/);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("R37 userTag mặc định 4 chữ số, tăng được số chữ số", () => {
    for (const tag of sample(() => generateUserTag()))
      expect(tag).toMatch(/^\d{4}$/);
    for (const tag of sample(() => generateUserTag(6), 200))
      expect(tag).toMatch(/^\d{6}$/);
  });
});
