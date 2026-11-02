import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

import { PageContainer } from "./page-container";

/**
 * App bar of the screens outside a plan (G01) and of plan pages on desktop (GD2); plan pages
 * on phones start with the plan's own header instead, so they pass `className="hidden md:block"`.
 * `children` are the actions on the right: language, create plan, account.
 */
export async function SiteHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const t = await getTranslations("app");
  return (
    <header className={cn("md:border-b md:bg-card", className)}>
      <PageContainer className="flex h-14 items-center justify-between gap-3 md:h-16">
        <Link href="/" className="font-heading text-2xl italic">
          {t("name")}
        </Link>
        <div className="flex items-center gap-2">{children}</div>
      </PageContainer>
    </header>
  );
}
