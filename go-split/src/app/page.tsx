import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { LocaleSwitcher } from "@/components/locale-switcher";

// Placeholder until the plan list (G01) is built.
export default async function Home() {
  const t = await getTranslations("home");
  return (
    <>
      <SiteHeader>
        <LocaleSwitcher />
      </SiteHeader>
      <main>
        <PageContainer className="flex flex-col gap-4 py-10">
          <h1 className="font-heading text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("body")}</p>
        </PageContainer>
      </main>
    </>
  );
}
