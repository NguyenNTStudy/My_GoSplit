import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { BottomActionBar } from "@/components/layout/bottom-action-bar";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { SplitLayout } from "@/components/layout/split-layout";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/i18n/format";

// Development aid: the shared layout pieces at phone, tablet and desktop widths (task 7).
export default async function LayoutPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  const [t, locale] = await Promise.all([getTranslations("dev"), getLocale()]);
  const items = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <>
      <SiteHeader>
        <LocaleSwitcher />
        <Button className="hidden md:inline-flex">{t("primary")}</Button>
      </SiteHeader>
      <main>
        <PageContainer className="py-6">
          <h1 className="font-heading text-3xl font-bold">
            {t("layoutTitle")}
          </h1>
          <p className="mt-1 mb-6 text-muted-foreground">{t("layoutIntro")}</p>
          <SplitLayout
            aside={
              <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
                <p className="text-sm">{t("layoutAside")}</p>
                <p className="font-heading text-3xl font-bold">
                  {formatMoney("398.5", "USD", locale)}
                </p>
              </div>
            }
          >
            <ul className="flex flex-col gap-2">
              {items.map((n) => (
                <li
                  key={n}
                  className="flex justify-between rounded-2xl border bg-card px-4 py-3"
                >
                  <span>{t("layoutItem", { n })}</span>
                  <span className="font-heading font-bold">
                    {formatMoney(n * 12, "USD", locale)}
                  </span>
                </li>
              ))}
            </ul>
          </SplitLayout>
        </PageContainer>
      </main>
      <BottomActionBar>
        <Button size="lg">{t("primary")}</Button>
      </BottomActionBar>
    </>
  );
}
