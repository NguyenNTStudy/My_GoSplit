import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { ThemeCode } from "./themes";
import { DEFAULT_THEME, THEMES, resolveTheme, themeArtPath } from "./themes";

const css = readFileSync(
  path.join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

function token(code: ThemeCode, name: string) {
  const block = css.match(
    new RegExp(String.raw`\[data-theme="${code}"\][^{]*\{([^}]*)\}`),
  )?.[1];
  const value = block?.match(
    new RegExp(String.raw`--${name}:\s*([^;]+);`),
  )?.[1];
  if (!value) throw new Error(`${code} thiếu --${name}`);
  return value.trim();
}

/** `#rrggbb` or `rgb(r g b / a)`, as written in globals.css. */
function parseColor(value: string) {
  if (value.startsWith("#")) {
    return {
      rgb: [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)),
      a: 1,
    };
  }
  const [r, g, b, a] = value.match(/[\d.]+/g)!.map(Number);
  return { rgb: [r, g, b], a: a ?? 1 };
}

function contrast(a: number[], b: number[]) {
  const luminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

describe("theme của kế hoạch", () => {
  it("R29 theme đã gỡ khỏi app hoặc không có thì dùng Gạo ấm", () => {
    expect(resolveTheme("bien").code).toBe("bien");
    expect(resolveTheme("theme-da-go").code).toBe(DEFAULT_THEME);
    expect(resolveTheme(null).code).toBe("gao-am");
  });

  it("R29 mỗi theme có đủ một bộ token và một hình minh họa", () => {
    for (const { code } of THEMES) {
      expect(css, code).toContain(`[data-theme="${code}"]`);
      expect(
        existsSync(path.join(process.cwd(), "public", themeArtPath(code))),
        code,
      ).toBe(true);
    }
  });

  it("chữ trên hình đạt WCAG AA kể cả khi ảnh nền trắng hoặc đen", () => {
    for (const { code } of THEMES) {
      const scrim = parseColor(token(code, "scrim"));
      for (const art of [
        [0, 0, 0],
        [255, 255, 255],
      ]) {
        const panel = scrim.rgb.map(
          (c, i) => c * scrim.a + art[i] * (1 - scrim.a),
        );
        for (const text of ["foreground", "muted-foreground"]) {
          const ratio = contrast(parseColor(token(code, text)).rgb, panel);
          expect(ratio, `${code} ${text}`).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });

  it("R77 màu trạng thái tiền chỉ khai báo một lần, không theme nào đổi", () => {
    for (const name of ["--money-ok:", "--money-short:"]) {
      expect(css.split(name).length - 1, name).toBe(1);
    }
    const blockStart = css.lastIndexOf("}", css.indexOf("--money-ok:")) + 1;
    expect(css.slice(blockStart, css.indexOf("{", blockStart)).trim()).toBe(
      ":root",
    );
  });
});
