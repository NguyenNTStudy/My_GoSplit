import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  COVER_MAX_BYTES,
  COVER_MAX_WIDTH,
  processCoverImage,
} from "./cover-image";

async function photo(width: number, height: number) {
  return sharp({
    create: { width, height, channels: 3, background: "#b4532a" },
  })
    .jpeg()
    .withExif({
      IFD0: { Make: "Phone" },
      IFD3: { GPSLatitudeRef: "N", GPSLatitude: "10/1 45/1 0/1" },
    })
    .toBuffer();
}

describe("ảnh nền riêng của kế hoạch", () => {
  it("R30 chuyển sang WebP, thu nhỏ, xóa thông tin vị trí và metadata khác", async () => {
    const input = await photo(3000, 2000);
    expect((await sharp(input).metadata()).exif).toBeDefined();

    const result = await processCoverImage(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const meta = await sharp(result.data).metadata();
    expect(meta.format).toBe("webp");
    expect(result.width).toBe(COVER_MAX_WIDTH);
    expect(result.height).toBe(Math.round((COVER_MAX_WIDTH * 2000) / 3000));
    expect(meta.exif).toBeUndefined();
  });

  it("R30 ảnh nhỏ giữ nguyên kích thước", async () => {
    const result = await processCoverImage(await photo(800, 600));
    expect(result.ok && result.width).toBe(800);
  });

  it("R30 ảnh chụp dọc từ điện thoại được xoay đúng chiều", async () => {
    const input = await sharp({
      create: { width: 300, height: 200, channels: 3, background: "#000" },
    })
      .jpeg()
      .withMetadata({ orientation: 6 })
      .toBuffer();
    const result = await processCoverImage(input);
    expect(result.ok && [result.width, result.height]).toEqual([200, 300]);
  });

  it("R30 từ chối ảnh quá 10 MB, file không phải ảnh, định dạng khác", async () => {
    expect(
      await processCoverImage(new Uint8Array(COVER_MAX_BYTES + 1)),
    ).toEqual({
      ok: false,
      error: "too_large",
    });
    expect(
      await processCoverImage(new TextEncoder().encode("not an image")),
    ).toEqual({
      ok: false,
      error: "unreadable",
    });
    const gif = await sharp({
      create: { width: 4, height: 4, channels: 3, background: "#000" },
    })
      .gif()
      .toBuffer();
    expect(await processCoverImage(gif)).toEqual({
      ok: false,
      error: "unsupported_format",
    });
  });
});
