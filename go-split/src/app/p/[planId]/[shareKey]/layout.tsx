import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { PlanTabs } from "@/components/plan/plan-tabs";
import { PlanHero } from "@/components/theme/plan-hero";
import { ThemeScope } from "@/components/theme/theme-scope";
import { resolveTheme } from "@/domain/themes";
import type { Locale } from "@/i18n/config";
import { formatTripDateRange } from "@/i18n/format";
import { loadSharedPlan } from "@/server/plans";

// Rendered per request for the visitor's session, so navigations here may wait.
export const instant = false;

// Opening a plan by its share link, no sign-in needed (R3). Wrong id or key both end at the
// same "Không tìm thấy kế hoạch" page (../not-found.tsx).

export async function generateMetadata({
  params,
}: LayoutProps<"/p/[planId]/[shareKey]">): Promise<Metadata> {
  const { planId, shareKey } = await params;
  const plan = await loadSharedPlan(planId, shareKey);
  return {
    title: plan?.name,
    // Never indexed, never sent to other sites (R46, R50); the headers say the same.
    robots: { index: false, follow: false },
    referrer: "no-referrer",
  };
}

export default async function PlanLayout({
  params,
  children,
}: LayoutProps<"/p/[planId]/[shareKey]">) {
  const { planId, shareKey } = await params;
  const [plan, t, nav, locale] = await Promise.all([
    loadSharedPlan(planId, shareKey),
    getTranslations("plan"),
    getTranslations("nav"),
    getLocale(),
  ]);
  if (!plan) notFound();

  const base = `/p/${plan.planId}/${plan.shareKey}`;
  const people = t("people", { count: plan.participantCount });
  const back = (
    <Link
      href="/"
      aria-label={nav("yourPlans")}
      className="flex size-11 items-center justify-center rounded-full bg-scrim"
    >
      <ChevronLeft aria-hidden className="size-5" />
    </Link>
  );

  return (
    <ThemeScope
      theme={
        plan.kind === "detailed" ? resolveTheme(plan.theme).code : "gao-am"
      }
      className="min-h-dvh"
    >
      <AppHeader className="hidden md:block" />
      {plan.kind === "detailed" ? (
        <PlanHero
          theme={plan.theme}
          title={plan.name}
          subtitle={[
            plan.location,
            plan.startDate &&
              plan.endDate &&
              formatTripDateRange(
                plan.startDate,
                plan.endDate,
                locale as Locale,
              ),
            people,
          ]
            .filter(Boolean)
            .join(" · ")}
          actions={back}
        />
      ) : (
        <header className="border-b bg-card">
          <PageContainer className="flex items-start gap-3 py-4">
            <div className="md:hidden">{back}</div>
            <div className="min-w-0 flex-1">
              <p className="mb-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">
                {t("basic")}
              </p>
              <h1 className="font-heading text-2xl leading-tight font-bold">
                {plan.name}
              </h1>
              {plan.notes && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.notes}
                </p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">{people}</p>
            </div>
          </PageContainer>
        </header>
      )}
      <PageContainer className="py-4">
        <PlanTabs base={base} kind={plan.kind} />
        <main className="py-4">{children}</main>
      </PageContainer>
    </ThemeScope>
  );
}
