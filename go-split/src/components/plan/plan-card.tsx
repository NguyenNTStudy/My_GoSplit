import { Users } from "lucide-react";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { isUnsettled } from "@/domain/plan-list";
import { planDayCount } from "@/domain/plan-dates";
import { resolveTheme, themeArtPath } from "@/domain/themes";
import type { Locale } from "@/i18n/config";
import { formatMoney, formatTripDateRange } from "@/i18n/format";
import type { PlanListItem } from "@/server/plans";

/** One plan in the list (G01): theme strip, name on two lines at most, total, people, dates. */
export async function PlanCard({
  plan,
  today,
}: {
  plan: PlanListItem;
  today: string;
}) {
  const [t, locale] = await Promise.all([
    getTranslations("plans"),
    getLocale() as Promise<Locale>,
  ]);
  const labels = [
    plan.kind === "basic" ? t("basic") : null,
    isUnsettled(plan, today) ? t("notSettled") : null,
    plan.role === "editor"
      ? t("joinedEditor")
      : plan.role === "viewer"
        ? t("joinedViewer")
        : null,
  ].filter((label): label is string => Boolean(label));

  return (
    <Link
      href={`/p/${plan.planId}/${plan.shareKey}`}
      className="block overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {plan.kind === "detailed" && (
        <div
          aria-hidden
          className="h-16 bg-hero bg-cover bg-bottom"
          style={{
            backgroundImage: `url(${themeArtPath(resolveTheme(plan.theme).code)})`,
          }}
        />
      )}
      <div className="flex gap-3 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-heading text-lg leading-snug font-bold">
            {plan.name}
          </h3>
          {plan.kind === "basic" && plan.notes && (
            <p className="truncate text-sm text-muted-foreground">
              {plan.notes}
            </p>
          )}
          {labels.length > 0 && (
            <p className="mt-1 flex flex-wrap gap-1.5">
              {labels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                >
                  {label}
                </span>
              ))}
            </p>
          )}
          {plan.startDate && plan.endDate && (
            <p className="mt-2 text-sm text-muted-foreground">
              {formatTripDateRange(plan.startDate, plan.endDate, locale)}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <p className="font-heading text-lg font-bold">
            <span className="sr-only">{t("total")} </span>
            {formatMoney(plan.total, plan.currency, locale)}
          </p>
          <p className="flex items-center gap-1 text-sm">
            <Users aria-hidden className="size-4" />
            <span className="sr-only">
              {t("people", { count: plan.participantCount })}
            </span>
            <span aria-hidden>{plan.participantCount}</span>
          </p>
          {plan.startDate && plan.endDate && (
            <p className="text-sm text-muted-foreground">
              {t("days", { count: planDayCount(plan.startDate, plan.endDate) })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
