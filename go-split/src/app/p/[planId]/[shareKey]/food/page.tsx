import { redirect } from "next/navigation";

import { loadSharedPlan } from "@/server/plans";

import { PlanSectionSoon } from "../plan-section";

// Rendered per request for the visitor's session, so navigations here may wait.
export const instant = false;

// "Ăn gì" (task 16); a basic plan has no such tab and goes to Costs (R94).
export default async function PlanFoodPage({
  params,
}: PageProps<"/p/[planId]/[shareKey]/food">) {
  const { planId, shareKey } = await params;
  const plan = await loadSharedPlan(planId, shareKey);
  if (plan?.kind === "basic") redirect(`/p/${planId}/${shareKey}/costs`);
  return <PlanSectionSoon />;
}
