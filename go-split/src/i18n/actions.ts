"use server";

import { cookies, headers } from "next/headers";

import { auth } from "@/server/auth";
import { getCurrentUser } from "@/server/session";

import { LOCALE_COOKIE, isLocale } from "./config";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Saves the language on this device and, when signed in, on the account (R28); the page
 * re-renders in that language.
 */
export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    maxAge: ONE_YEAR,
    path: "/",
    sameSite: "lax",
  });
  if (await getCurrentUser()) {
    await auth.api.updateUser({
      body: { language: locale },
      headers: await headers(),
    });
  }
}
