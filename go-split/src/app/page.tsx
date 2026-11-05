import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AppHeader } from "@/components/layout/app-header";
import { BottomActionBar } from "@/components/layout/bottom-action-bar";
import { PageContainer } from "@/components/layout/page-container";
import { PlanCard } from "@/components/plan/plan-card";
import { buttonVariants } from "@/components/ui/button";
import type { PlanFilter } from "@/domain/plan-list";
import { groupPlans, readPlanFilter } from "@/domain/plan-list";
import { cn } from "@/lib/utils";
import { listPlansFor } from "@/server/plans";
import { getCurrentUser } from "@/server/session";

// Rendered per request for the visitor's session, so navigations here may wait.
export const instant = false;

// The account's plans (G01, GD1); visitors see what the app is for and a way in.
export default async function Home({ searchParams }: PageProps<"/">) {
  const [user, { filter: rawFilter }, t, nav, home] = await Promise.all([
    getCurrentUser(),
    searchParams,
    getTranslations("plans"),
    getTranslations("nav"),
    getTranslations("home"),
  ]);

  if (!user) {
    return (
      <>
        <AppHeader />
        <main>
          <PageContainer className="flex max-w-2xl flex-col items-start gap-4 py-16">
            <h1 className="font-heading text-4xl font-bold">
              {home("signedOutTitle")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {home("signedOutBody")}
            </p>
            <Link href="/plans/new" className={buttonVariants({ size: "lg" })}>
              {nav("createPlan")}
            </Link>
          </PageContainer>
        </main>
      </>
    );
  }

  const filter = readPlanFilter(
    typeof rawFilter === "string" ? rawFilter : null,
  );
  const plans = await listPlansFor(user.id);
  const { upcoming, finished } = groupPlans(plans, filter);
  const today = new Date().toISOString().slice(0, 10);
  const filters: [PlanFilter, string][] = [
    ["all", t("filterAll")],
    ["mine", t("filterMine")],
    ["joined", t("filterJoined")],
  ];

  return (
    <>
      <AppHeader />
      <main>
        <PageContainer className="flex flex-col gap-6 py-6">
          <h1 className="font-heading text-3xl font-bold">{t("title")}</h1>
          <nav aria-label={t("filter")}>
            <ul className="flex gap-2">
              {filters.map(([value, label]) => (
                <li key={value}>
                  <Link
                    href={value === "all" ? "/" : `/?filter=${value}`}
                    aria-current={filter === value ? "page" : undefined}
                    className={cn(
                      "block rounded-full border px-3 py-1.5 text-sm font-medium",
                      filter === value &&
                        "border-primary bg-primary text-primary-foreground",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {[
            {
              key: "upcoming",
              title: t("upcoming"),
              hint: t("byStartDate"),
              items: upcoming,
              empty: t("upcomingEmpty"),
            },
            {
              key: "finished",
              title: t("finished"),
              hint: t("newestFirst"),
              items: finished,
              empty: t("finishedEmpty"),
            },
          ].map((section) => (
            <section key={section.key} aria-labelledby={`plans-${section.key}`}>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <h2
                  id={`plans-${section.key}`}
                  className="font-heading text-xl font-bold"
                >
                  {section.title}
                  <span className="ml-1.5 text-base font-normal text-muted-foreground">
                    {section.items.length}
                  </span>
                </h2>
                <span className="text-sm text-muted-foreground">
                  {section.hint}
                </span>
              </div>
              {section.items.length === 0 ? (
                <p className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                  {section.empty}
                </p>
              ) : (
                <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((plan) => (
                    <li key={plan.planId}>
                      <PlanCard plan={plan} today={today} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </PageContainer>
      </main>
      <BottomActionBar>
        <Link
          href="/plans/new"
          className={cn(buttonVariants({ size: "lg" }), "h-14 text-base")}
        >
          {nav("createPlan")}
        </Link>
      </BottomActionBar>
    </>
  );
}
