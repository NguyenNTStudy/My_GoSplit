import { describe, expect, it } from "vitest";

import {
  MAX_PAGE,
  PAGE_SIZE,
  pageQuery,
  pageResult,
  readPage,
} from "./pagination";

describe("phân trang kết quả tìm kiếm", () => {
  it("R52 số trang lấy từ URL, sai thì về trang 1, không vượt trang cuối cho phép", () => {
    expect(readPage("3")).toBe(3);
    for (const bad of [null, "", "0", "-2", "1.5", "abc"]) {
      expect(readPage(bad), String(bad)).toBe(1);
    }
    expect(readPage("9999")).toBe(MAX_PAGE);
  });

  it("R52 cỡ trang do server đặt; trang cuối cho phép không có trang sau", () => {
    expect(pageQuery(2)).toEqual({ offset: PAGE_SIZE, limit: PAGE_SIZE + 1 });
    const rows = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => i);
    expect(pageResult(rows, 1)).toMatchObject({ hasNext: true });
    expect(pageResult(rows, 1).items).toHaveLength(PAGE_SIZE);
    expect(pageResult(rows, MAX_PAGE).hasNext).toBe(false);
    expect(pageResult(rows.slice(0, 3), 1).hasNext).toBe(false);
  });
});
