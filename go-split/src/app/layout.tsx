import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import {
  IOS_SCREENS,
  PWA_BACKGROUND,
  startupImageMedia,
  startupImagePath,
} from "@/lib/pwa";
import "./globals.css";

// Gạo ấm typography: Be Vietnam Pro for text, Lora for headings and amounts.
const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

// The language comes from a cookie or the browser, never the URL (R28), so no page has a
// language-free static shell: every route renders per request.
export const instant = false;

export const viewport: Viewport = {
  themeColor: PWA_BACKGROUND,
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations("app"), getLocale()]);
  return {
    title: t("name"),
    description: t("description"),
    manifest: `/manifests/${locale}`,
    appleWebApp: {
      title: t("name"),
      statusBarStyle: "default",
      startupImage: IOS_SCREENS.map((screen) => ({
        url: startupImagePath(screen),
        media: startupImageMedia(screen),
      })),
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${sans.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
