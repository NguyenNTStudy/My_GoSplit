import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { AccountMenu } from "@/components/account/account-menu";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/server/session";

import { SiteHeader } from "./site-header";

/**
 * The app bar with the signed-in state: language, "Tạo kế hoạch" on wider screens (phones have
 * it at the bottom of the plan list) and the account menu; a sign-in link otherwise, except on
 * the sign-in page itself.
 */
export async function AppHeader({
  className,
  signInLink = true,
}: {
  className?: string;
  signInLink?: boolean;
}) {
  const [user, t] = await Promise.all([
    getCurrentUser(),
    getTranslations("nav"),
  ]);
  return (
    <SiteHeader className={className}>
      <LocaleSwitcher />
      {user ? (
        <>
          <Link
            href="/plans/new"
            className={cn(buttonVariants(), "hidden md:inline-flex")}
          >
            {t("createPlan")}
          </Link>
          <AccountMenu name={user.name} />
        </>
      ) : (
        signInLink && (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            {t("login")}
          </Link>
        )
      )}
    </SiteHeader>
  );
}
