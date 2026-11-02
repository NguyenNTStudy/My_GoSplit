import type { MetadataRoute } from "next";

import { LOCALES, isLocale } from "@/i18n/config";
import { PWA_BACKGROUND } from "@/lib/pwa";

// Web app manifest in the language of the page that links it (R28). Browsers fetch the
// manifest without cookies, so the language is in the URL here instead of negotiated like
// pages; the root layout links the right one. One static file per language.

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function GET(
  _request: Request,
  { params }: RouteContext<"/manifests/[locale]">,
) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });
  const { app } = (await import(`../../../../messages/${locale}.json`)).default;

  const manifest: MetadataRoute.Manifest = {
    id: "/",
    name: app.name,
    short_name: app.name,
    description: app.description,
    lang: locale,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: PWA_BACKGROUND,
    theme_color: PWA_BACKGROUND,
    icons: [
      { src: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/pwa/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
  return new Response(JSON.stringify(manifest), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
