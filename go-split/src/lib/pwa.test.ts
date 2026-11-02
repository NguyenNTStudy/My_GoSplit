import path from "node:path";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { IOS_SCREENS, startupImagePath } from "./pwa";

const publicFile = (url: string) => path.join(process.cwd(), "public", url);

describe("cài app lên màn hình chính", () => {
  it("mỗi màn hình iPhone có ảnh khởi động đúng kích thước (chạy npm run pwa:generate khi đổi danh sách)", async () => {
    const paths = IOS_SCREENS.map(startupImagePath);
    expect(new Set(paths).size).toBe(IOS_SCREENS.length);
    for (const screen of IOS_SCREENS) {
      const { width, height } = await sharp(
        publicFile(startupImagePath(screen)),
      ).metadata();
      expect([width, height]).toEqual([
        screen.width * screen.ratio,
        screen.height * screen.ratio,
      ]);
    }
  });

  it("icon có đủ kích thước manifest khai báo", async () => {
    for (const [file, size] of [
      ["/pwa/icon-192.png", 192],
      ["/pwa/icon-512.png", 512],
      ["/pwa/icon-maskable-512.png", 512],
    ] as const) {
      const { width, height } = await sharp(publicFile(file)).metadata();
      expect([width, height], file).toEqual([size, size]);
    }
  });
});
