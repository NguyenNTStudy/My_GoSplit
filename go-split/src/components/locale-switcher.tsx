import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { setLocale } from "@/i18n/actions";
import { LOCALES } from "@/i18n/config";

/** Language buttons; the choice is saved on the device (R28). Works without JavaScript. */
export async function LocaleSwitcher() {
  const [current, t] = await Promise.all([
    getLocale(),
    getTranslations("language"),
  ]);
  return (
    <form role="group" aria-label={t("label")} className="flex gap-1 md:gap-2">
      {LOCALES.map((locale) => (
        <Button
          key={locale}
          type="submit"
          variant={locale === current ? "default" : "outline"}
          aria-pressed={locale === current}
          formAction={setLocale.bind(null, locale)}
          lang={locale}
          aria-label={t(locale)}
        >
          {/* Phones show the short code, as in the wireframes (VI, EN). */}
          <span className="md:hidden">{locale.toUpperCase()}</span>
          <span className="hidden md:inline">{t(locale)}</span>
        </Button>
      ))}
    </form>
  );
}
