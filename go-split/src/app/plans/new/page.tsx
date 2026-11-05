import { headers } from "next/headers";
import { getLocale } from "next-intl/server";

import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { defaultCurrency, regionOfLocale } from "@/domain/currency";
import { createPlanDefaults } from "@/server/plans";
import { requireUser } from "@/server/session";

import { CreatePlanWizard } from "./create-plan-wizard";

// Rendered per request for the visitor's session, so navigations here may wait.
export const instant = false;

// Creating a plan needs an account (R61); type, then details, theme and passcode (R93, R95).
export default async function NewPlanPage() {
  const user = await requireUser("/plans/new");
  const [defaults, locale, headerStore] = await Promise.all([
    createPlanDefaults(user.id),
    getLocale(),
    headers(),
  ]);
  const browserLanguage =
    headerStore.get("accept-language")?.split(",")[0]?.split(";")[0] ?? "";

  return (
    <>
      <AppHeader className="hidden md:block" />
      <main>
        <PageContainer className="max-w-2xl py-4 md:py-10">
          <CreatePlanWizard
            initialKind={defaults.lastKind ?? "basic"}
            defaultCurrency={defaultCurrency({
              lastPlanCurrency: defaults.lastCurrency,
              browserRegion: regionOfLocale(browserLanguage),
              language: locale,
            })}
            recentCurrencies={defaults.recentCurrencies}
            ownerName={user.name}
          />
        </PageContainer>
      </main>
    </>
  );
}
