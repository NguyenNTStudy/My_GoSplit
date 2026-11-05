"use server";

import { redirect } from "next/navigation";

import type { FieldError, NewPlanInput } from "@/domain/new-plan";
import { validateNewPlan } from "@/domain/new-plan";
import { createPlan } from "@/server/plans";
import { requireUser } from "@/server/session";

/**
 * Creates the plan and opens it (R61, R93). Checks again everything the form checked; on
 * success it redirects, so it only ever returns problems.
 */
export async function createPlanAction(
  input: NewPlanInput,
): Promise<
  { errors: Partial<Record<keyof NewPlanInput, FieldError>> } | { failed: true }
> {
  const user = await requireUser("/plans/new");
  const result = validateNewPlan(input);
  if (!result.ok) return { errors: result.errors };

  let created: { planId: string; shareKey: string };
  try {
    created = await createPlan(user, result.plan);
  } catch (error) {
    console.error("Creating a plan failed", error);
    return { failed: true };
  }
  // A basic plan has no schedule; it opens on Costs (R94).
  const tab = result.plan.kind === "basic" ? "/costs" : "";
  redirect(`/p/${created.planId}/${created.shareKey}${tab}`);
}
