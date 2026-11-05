import { describe, expect, it } from "vitest";

import { safeNextPath } from "./safe-next";

describe("đường dẫn sau khi đăng nhập", () => {
  it("chỉ nhận đường dẫn trong app", () => {
    expect(safeNextPath("/plans/new")).toBe("/plans/new");
    expect(safeNextPath("/p/0041234567/key?x=1")).toBe("/p/0041234567/key?x=1");
    for (const bad of [
      null,
      "",
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "plans",
    ]) {
      expect(safeNextPath(bad), String(bad)).toBe("/");
    }
  });
});
