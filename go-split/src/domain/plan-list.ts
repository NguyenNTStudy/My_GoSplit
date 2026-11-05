// The account's plan list (R60, R62, R84, R96): two groups, their order, the filter and the
// "not settled" label.

import type { MemberRole } from "./permissions";

export type ListedPlan = {
  kind: "basic" | "detailed";
  role: MemberRole;
  summaryStatus: "open" | "locked" | "final";
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

export type PlanFilter = "all" | "mine" | "joined";

export function readPlanFilter(raw: string | null | undefined): PlanFilter {
  return raw === "mine" || raw === "joined" ? raw : "all";
}

/** "Chưa chốt tổng kết": the trip has ended but its summary isn't final (R62). */
export function isUnsettled(plan: ListedPlan, today: string): boolean {
  return (
    plan.summaryStatus !== "final" &&
    plan.endDate !== null &&
    plan.endDate < today
  );
}

/**
 * Upcoming (summary open or locked) first by start date, oldest first; settled plans newest
 * first. Basic plans have no dates and sort by creation date instead (R96).
 */
export function groupPlans<T extends ListedPlan>(
  plans: readonly T[],
  filter: PlanFilter,
): { upcoming: T[]; finished: T[] } {
  const shown = plans.filter((plan) =>
    filter === "mine"
      ? plan.role === "owner"
      : filter === "joined"
        ? plan.role !== "owner"
        : true,
  );
  const sortKey = (plan: T) => plan.startDate ?? plan.createdAt.slice(0, 10);
  const byDate = (a: T, b: T) =>
    sortKey(a).localeCompare(sortKey(b)) ||
    a.createdAt.localeCompare(b.createdAt);
  return {
    upcoming: shown.filter((p) => p.summaryStatus !== "final").sort(byDate),
    finished: shown
      .filter((p) => p.summaryStatus === "final")
      .sort((a, b) => byDate(b, a)),
  };
}
