import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

// The same page for a plan id that doesn't exist and a wrong share key (R3).
export default async function PlanNotFound() {
  const t = await getTranslations("plan");
  return (
    <>
      <AppHeader />
      <main>
        <PageContainer className="flex max-w-xl flex-col items-start gap-4 py-16">
          <h1 className="font-heading text-3xl font-bold">
            {t("notFoundTitle")}
          </h1>
          <p className="text-muted-foreground">{t("notFoundBody")}</p>
          <Link href="/" className={buttonVariants({})}>
            {t("goHome")}
          </Link>
        </PageContainer>
      </main>
    </>
  );
}
