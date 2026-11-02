import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { getCurrentUser } from "@/server/session";

import { LOCALE_COOKIE, isLocale, resolveLocale } from "./config";

export default getRequestConfig(async () => {
  const [user, cookieStore, headerStore] = await Promise.all([
    getCurrentUser(),
    cookies(),
    headers(),
  ]);
  // The account's language wins on every device it signs in on, then this device's choice,
  // then the browser (R28).
  const saved = isLocale(user?.language)
    ? user.language
    : cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = resolveLocale(saved, headerStore.get("accept-language"));

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
