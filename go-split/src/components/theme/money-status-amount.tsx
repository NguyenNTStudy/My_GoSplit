import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/**
 * A shortage in red or a surplus in green, the same colors in every theme (R77). The amount
 * shows without words, but screen readers hear "còn thiếu" or "dư" before it (R76).
 */
export function MoneyStatusAmount({
  status,
  amount,
  className,
}: {
  status: "short" | "surplus";
  /** Already formatted, e.g. with formatMoney. */
  amount: string;
  className?: string;
}) {
  const t = useTranslations("money");
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 font-heading font-bold",
        status === "short"
          ? "bg-money-short text-money-short-foreground"
          : "bg-money-ok text-money-ok-foreground",
        className,
      )}
    >
      <span className="sr-only">
        {t(status === "short" ? "shortage" : "surplus")}
      </span>
      {amount}
    </span>
  );
}
