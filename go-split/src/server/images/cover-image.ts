// Processing for a plan's own cover photo (R30): checked, shrunk, converted to WebP, and
// stripped of location and all other metadata before it is stored.

import sharp, { type Metadata } from "sharp";

export const COVER_MAX_BYTES = 10 * 1024 * 1024;
/** Wide enough for the desktop hero on high-density screens. */
export const COVER_MAX_WIDTH = 2000;

export type CoverImageError =
  | "too_large"
  | "unreadable"
  | "unsupported_format"
  /** iPhone HEIC (HEVC) can't be decoded by sharp's prebuilt libvips; see tasks 6. */
  | "heic_not_supported";

export type CoverImageResult =
  | { ok: true; data: Buffer; width: number; height: number }
  | { ok: false; error: CoverImageError };

const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "heif"]);

export async function processCoverImage(
  input: Uint8Array,
): Promise<CoverImageResult> {
  if (input.byteLength > COVER_MAX_BYTES)
    return { ok: false, error: "too_large" };

  let metadata: Metadata;
  try {
    metadata = await sharp(input).metadata();
  } catch {
    return { ok: false, error: "unreadable" };
  }
  if (!metadata.format || !ACCEPTED_FORMATS.has(metadata.format)) {
    return { ok: false, error: "unsupported_format" };
  }
  if (metadata.format === "heif" && metadata.compression === "hevc") {
    return { ok: false, error: "heic_not_supported" };
  }

  try {
    // rotate() applies the EXIF orientation first; sharp then writes no metadata at all
    // (no EXIF, no GPS) unless asked to keep it.
    const { data, info } = await sharp(input, { failOn: "error" })
      .rotate()
      .resize({ width: COVER_MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    return { ok: true, data, width: info.width, height: info.height };
  } catch {
    return { ok: false, error: "unreadable" };
  }
}
