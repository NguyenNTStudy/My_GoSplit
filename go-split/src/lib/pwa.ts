// Install-to-home-screen settings (task 7), shared by the manifest, the root layout and
// scripts/generate-pwa-assets.mjs (which imports this file directly, so keep it plain TS).

/** Gạo ấm background: the splash screen and browser bars blend into the app. */
export const PWA_BACKGROUND = "#f6efe1";

/** iPhone screens in CSS pixels, portrait. Without a matching launch image iOS shows white. */
export const IOS_SCREENS = [
  { width: 375, height: 667, ratio: 2 }, // SE, 8
  { width: 414, height: 736, ratio: 3 }, // 8 Plus
  { width: 375, height: 812, ratio: 3 }, // X, XS, 11 Pro, 12 mini, 13 mini
  { width: 414, height: 896, ratio: 2 }, // XR, 11
  { width: 414, height: 896, ratio: 3 }, // XS Max, 11 Pro Max
  { width: 390, height: 844, ratio: 3 }, // 12, 13, 14, 16e
  { width: 428, height: 926, ratio: 3 }, // 12 Pro Max, 13 Pro Max, 14 Plus
  { width: 393, height: 852, ratio: 3 }, // 14 Pro, 15, 15 Pro, 16
  { width: 430, height: 932, ratio: 3 }, // 14 Pro Max, 15 Plus, 15 Pro Max, 16 Plus
  { width: 402, height: 874, ratio: 3 }, // 16 Pro, 17, 17 Pro
  { width: 420, height: 912, ratio: 3 }, // Air
  { width: 440, height: 956, ratio: 3 }, // 16 Pro Max, 17 Pro Max
] as const;

export type IosScreen = (typeof IOS_SCREENS)[number];

export function startupImagePath({ width, height, ratio }: IosScreen) {
  return `/pwa/startup-${width * ratio}x${height * ratio}.png`;
}

export function startupImageMedia({ width, height, ratio }: IosScreen) {
  return `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`;
}
