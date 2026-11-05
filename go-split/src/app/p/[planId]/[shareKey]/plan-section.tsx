import { getTranslations } from "next-intl/server";

/** Placeholder for the sections built in tasks 14–18. */
export async function PlanSectionSoon() {
  const t = await getTranslations("plan");
  return <p className="text-muted-foreground">{t("soon")}</p>;
}
