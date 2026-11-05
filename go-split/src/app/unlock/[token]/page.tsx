import { getTranslations } from "next-intl/server";

import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";

import { UnlockForm } from "./unlock-form";

// Rendered per request for the visitor's session, so navigations here may wait.
export const instant = false;

// Opened from the unlock email sent to the plan owner (R9).
export default async function UnlockPage({
  params,
}: PageProps<"/unlock/[token]">) {
  const [{ token }, t] = await Promise.all([params, getTranslations("unlock")]);
  return (
    <>
      <SiteHeader />
      <main>
        <PageContainer className="flex max-w-xl flex-col gap-4 py-10">
          <h1 className="font-heading text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("body")}</p>
          <UnlockForm token={token} />
        </PageContainer>
      </main>
    </>
  );
}
