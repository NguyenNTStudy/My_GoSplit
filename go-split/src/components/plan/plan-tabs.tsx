"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/** The plan's sections; a basic plan only has Costs and Summary (R94). */
export function PlanTabs({
  base,
  kind,
}: {
  base: string;
  kind: "basic" | "detailed";
}) {
  const t = useTranslations("plan");
  const pathname = usePathname();
  const tabs =
    kind === "basic"
      ? [
          { href: `${base}/costs`, label: t("tabCosts") },
          { href: `${base}/summary`, label: t("tabSummary") },
        ]
      : [
          { href: base, label: t("tabSchedule") },
          { href: `${base}/food`, label: t("tabFood") },
          { href: `${base}/costs`, label: t("tabCosts") },
          { href: `${base}/summary`, label: t("tabSummary") },
        ];

  return (
    <nav aria-label={t("tabs")}>
      <ul className="flex gap-1 rounded-2xl bg-secondary p-1 md:inline-flex">
        {tabs.map((tab) => {
          const current = pathname === tab.href;
          return (
            <li key={tab.href} className="flex-1 md:flex-none">
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "block rounded-xl px-2 py-2 text-center text-sm font-medium whitespace-nowrap text-muted-foreground md:px-4",
                  current && "bg-card text-foreground shadow-sm",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
