import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { MoneyStatusAmount } from "@/components/theme/money-status-amount";
import { PlanHero } from "@/components/theme/plan-hero";
import { ThemePicker } from "@/components/theme/theme-picker";
import { ThemeScope } from "@/components/theme/theme-scope";
import { Button } from "@/components/ui/button";
import { THEMES } from "@/domain/themes";
import { formatMoney } from "@/i18n/format";

// Development aid: every theme side by side, to compare with the wireframes (task 6).
export default async function ThemesPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  const [t, names, locale] = await Promise.all([
    getTranslations("dev"),
    getTranslations("themes.names"),
    getLocale(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 py-10 px-page">
      <div>
        <h1 className="font-heading text-3xl font-bold">{t("themesTitle")}</h1>
        <p className="mt-1 text-muted-foreground">{t("themesIntro")}</p>
      </div>

      {THEMES.map((theme) => (
        <section key={theme.code} aria-labelledby={`theme-${theme.code}`}>
          <h2 id={`theme-${theme.code}`} className="mb-2 font-semibold">
            {names(theme.code)}
          </h2>
          <ThemeScope
            theme={theme.code}
            className="overflow-hidden rounded-2xl border"
          >
            <PlanHero
              theme={theme.code}
              title={t("samplePlan")}
              subtitle={t("sampleSubtitle")}
            />
            <div className="flex flex-wrap items-center gap-3 p-4">
              <Button>{t("primary")}</Button>
              <Button variant="outline">{t("outline")}</Button>
              <Button variant="secondary">{t("secondary")}</Button>
              <span className="rounded-xl bg-brand px-3 py-2 font-heading text-lg font-bold text-brand-foreground">
                {formatMoney("398.5", "USD", locale)}
              </span>
              <MoneyStatusAmount
                status="short"
                amount={formatMoney(35500, "VND", locale)}
              />
              <MoneyStatusAmount
                status="surplus"
                amount={formatMoney(405000, "VND", locale)}
              />
            </div>
          </ThemeScope>
        </section>
      ))}

      <ThemePicker previewTitle={t("samplePlan")} />
    </main>
  );
}
