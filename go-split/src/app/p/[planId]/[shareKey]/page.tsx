import { redirect } from "next/navigation";

import { loadSharedPlan } from "@/server/plans";

import { PlanSectionSoon } from "./plan-section";

// Rendered per request for the visitor's session, so navigations here may wait.
export const instant = false;

// Schedule, the first tab of a detailed plan; a basic plan has none and opens on Costs (R94).
export default async function PlanSchedulePage({
  params,
}: PageProps<"/p/[planId]/[shareKey]">) {
  const { planId, shareKey } = await params;
  const plan = await loadSharedPlan(planId, shareKey);
  if (plan?.kind === "basic") redirect(`/p/${planId}/${shareKey}/costs`);
  return <PlanSectionSoon />;
}
