// Builds the app icons and iPhone launch screens from one drawing (task 7).
// The mark is provisional (a bowl with rice grains falling in): redraw MARK when the app name
// and logo are final, then run `npm run pwa:generate` and commit the output.
//
// Output: src/app/icon.svg, src/app/favicon.ico, src/app/apple-icon.png, public/pwa/*.png

import { mkdir, writeFile } from "node:fs/promises";

import sharp from "sharp";

import {
  IOS_SCREENS,
  PWA_BACKGROUND,
  startupImagePath,
} from "../src/lib/pwa.ts";

const BRAND = "#b4532a";
const CREAM = "#f6efe1";
const RICE = "#fffbf2";

/** The mark inside a 100×100 box. */
const MARK = `
  <ellipse cx="40" cy="21" rx="3.4" ry="6.2" transform="rotate(-28 40 21)" fill="${RICE}"/>
  <ellipse cx="53" cy="13" rx="3.4" ry="6.2" transform="rotate(10 53 13)" fill="${RICE}"/>
  <ellipse cx="64" cy="25" rx="3.4" ry="6.2" transform="rotate(36 64 25)" fill="${RICE}"/>
  <path d="M25 52 C25 39 36 33 50 33 C64 33 75 39 75 52 Z" fill="${RICE}"/>
  <path d="M14 55 H86 C86 72 71 83 50 83 C29 83 14 72 14 55 Z" fill="${CREAM}"/>
  <path d="M20 63.5 H80" stroke="${BRAND}" stroke-width="2.6" stroke-linecap="round"/>
  <rect x="39" y="81" width="22" height="6" rx="2.5" fill="${CREAM}"/>`;

/**
 * @param {number} size output size in px
 * @param {{ radius: number, scale: number }} shape corner radius (of 100) and mark size;
 *   maskable icons keep the mark inside the central 80% circle that Android never crops.
 */
function iconSvg(size, { radius, scale }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${radius}" fill="${BRAND}"/>
  <g transform="translate(50 52) scale(${scale}) translate(-50 -50)">${MARK}
  </g>
</svg>
`;
}

const ROUNDED = { radius: 22, scale: 0.9 };
const FULL_BLEED = { radius: 0, scale: 0.8 }; // iOS rounds the corners itself
const MASKABLE = { radius: 0, scale: 0.68 };

const png = (svg) =>
  sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

/** An .ico holding PNG images, which every current browser reads. */
async function ico(sizes) {
  const images = await Promise.all(
    sizes.map((size) => png(iconSvg(size, ROUNDED))),
  );
  const header = Buffer.alloc(6 + 16 * sizes.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((size, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(images[i].length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += images[i].length;
  });
  return Buffer.concat([header, ...images]);
}

/** Background colour with the rounded icon in the middle, like Android's own splash. */
async function startupImage({ width, height, ratio }) {
  const iconSize = 112 * ratio;
  return sharp({
    create: {
      width: width * ratio,
      height: height * ratio,
      channels: 3,
      background: PWA_BACKGROUND,
    },
  })
    .composite([
      { input: await png(iconSvg(iconSize, ROUNDED)), gravity: "center" },
    ])
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

await mkdir("public/pwa", { recursive: true });
const files = {
  "src/app/icon.svg": iconSvg(32, ROUNDED),
  "src/app/favicon.ico": await ico([16, 32, 48]),
  "src/app/apple-icon.png": await png(iconSvg(180, FULL_BLEED)),
  "public/pwa/icon-192.png": await png(iconSvg(192, ROUNDED)),
  "public/pwa/icon-512.png": await png(iconSvg(512, ROUNDED)),
  "public/pwa/icon-maskable-512.png": await png(iconSvg(512, MASKABLE)),
};
for (const screen of IOS_SCREENS) {
  files[`public${startupImagePath(screen)}`] = await startupImage(screen);
}
for (const [file, data] of Object.entries(files)) {
  await writeFile(file, data);
}
process.stdout.write(`Wrote ${Object.keys(files).length} files\n`);
