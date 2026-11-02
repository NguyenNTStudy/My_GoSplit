import type { CurrencyRules } from "./currency-rules";
import { Dec, type DecimalInput } from "./decimal";
import type { MealSlot } from "./food-match";
import {
  addDays,
  dateOfPlanDay,
  dayNumberInPlan,
  isDateInPlan,
  isLocalDate,
  MAX_PLAN_DAYS,
  planDayCount,
  type LocalDate,
} from "./plan-dates";
import { roundUpToStep } from "./rounding";
import { normalizeSearchText } from "./search-text";
import { validateItineraryTitle, type TextError } from "./text-rules";

// Shared itineraries are standalone copies of a finalized detailed plan: real dates become
// day numbers, and nothing about people or money except one estimated cost per person
// (R63–R66). Copying works the other way, from day numbers back to dates (R68, R79).

type SummaryStatus = "open" | "locked" | "final";
type PlanKind = "basic" | "detailed";

export type PlanActivity = {
  name: string;
  date: LocalDate | null;
  time: string | null;
  location: string | null;
  mapLink: string | null;
  notes: string | null;
};

export type PlanStay = {
  name: string;
  area: string;
  country: string;
  address: string | null;
  mapLink: string | null;
  checkInDate: LocalDate;
  checkOutDate: LocalDate;
};

export type PlanFood = {
  dishName: string;
  placeName: string | null;
  directions: string | null;
  mealSlots: MealSlot[];
  notes: string | null;
  order: number;
};

export type ItineraryActivityDraft = Omit<PlanActivity, "date"> & {
  day: number;
};
export type ItineraryStayDraft = Omit<
  PlanStay,
  "checkInDate" | "checkOutDate"
> & {
  areaSearch: string;
  checkInDay: number;
  checkOutDay: number;
};
export type ItineraryFoodDraft = PlanFood;

export type ItineraryDraft = {
  title: string;
  destination: string;
  destinationSearch: string;
  description: string | null;
  language: string;
  theme: string;
  dayCount: number;
  groupSize: number;
  /** Decimal string, or null when there are no expenses or the author left it out (R65). */
  estimatedCostPerPerson: string | null;
  currency: string;
  activities: ItineraryActivityDraft[];
  stays: ItineraryStayDraft[];
  foods: ItineraryFoodDraft[];
};

export type CreateItineraryError = "not_detailed" | "summary_not_final";

/** Orders activities like the schedule: by day, then time, untimed last, then input order (R60). */
function compareActivities(
  a: { day: number; time: string | null },
  b: { day: number; time: string | null },
): number {
  if (a.day !== b.day) return a.day - b.day;
  if (a.time === b.time) return 0;
  if (a.time === null) return 1;
  if (b.time === null) return -1;
  return a.time < b.time ? -1 : 1;
}

/**
 * Builds the itinerary draft the owner previews before publishing (R63–R66).
 * - Activities without a date or outside the plan's dates ("Ngày chưa xác định") are left out
 *   and counted in `droppedActivityCount`, so the preview can say so (R64, R81).
 * - Group size is the number of participants in the summary; the estimated cost per person is
 *   the total of all expenses divided by it, rounded up like R19 (R65).
 */
export function createItineraryDraft(input: {
  plan: {
    kind: PlanKind;
    summaryStatus: SummaryStatus;
    name: string;
    location: string | null;
    startDate: LocalDate;
    endDate: LocalDate;
    theme: string;
    currency: CurrencyRules;
  };
  participantCount: number;
  expenseAmounts: readonly DecimalInput[];
  activities: readonly PlanActivity[];
  stays: readonly PlanStay[];
  foods: readonly PlanFood[];
  language: string;
  includeEstimatedCost?: boolean;
}):
  | { ok: true; draft: ItineraryDraft; droppedActivityCount: number }
  | { ok: false; error: CreateItineraryError } {
  const { plan } = input;
  if (plan.kind !== "detailed") return { ok: false, error: "not_detailed" };
  if (plan.summaryStatus !== "final")
    return { ok: false, error: "summary_not_final" };

  const inPlan = input.activities.filter(
    (activity) => activity.date !== null && isDateInPlan(plan, activity.date),
  );
  const activities = inPlan
    .map(({ date, ...rest }) => ({
      ...rest,
      day: dayNumberInPlan(plan.startDate, date as LocalDate),
    }))
    .sort(compareActivities);

  const stays = input.stays
    .filter(
      (stay) =>
        isDateInPlan(plan, stay.checkInDate) &&
        isDateInPlan(plan, stay.checkOutDate),
    )
    .sort((a, b) =>
      a.checkInDate < b.checkInDate
        ? -1
        : a.checkInDate > b.checkInDate
          ? 1
          : 0,
    )
    .map(({ checkInDate, checkOutDate, ...rest }) => ({
      ...rest,
      areaSearch: normalizeSearchText(rest.area),
      checkInDay: dayNumberInPlan(plan.startDate, checkInDate),
      checkOutDay: dayNumberInPlan(plan.startDate, checkOutDate),
    }));

  const foods = [...input.foods]
    .sort((a, b) => a.order - b.order)
    .map((food, index) => ({ ...food, order: index }));

  const total = input.expenseAmounts.reduce<Dec>(
    (sum, amount) => sum.plus(amount),
    new Dec(0),
  );
  const groupSize = input.participantCount;
  const estimatedCostPerPerson =
    input.includeEstimatedCost !== false && total.gt(0) && groupSize > 0
      ? roundUpToStep(
          total.div(groupSize),
          plan.currency.roundingStep,
        ).toFixed()
      : null;

  const destination = plan.location ?? "";
  return {
    ok: true,
    droppedActivityCount: input.activities.length - inPlan.length,
    draft: {
      title: plan.name,
      destination,
      destinationSearch: normalizeSearchText(destination),
      description: null,
      language: input.language,
      theme: plan.theme,
      dayCount: planDayCount(plan.startDate, plan.endDate),
      groupSize,
      estimatedCostPerPerson,
      currency: plan.currency.code,
      activities,
      stays,
      foods,
    },
  };
}

export type ItineraryDraftError = TextError | "no_activities";

/** Checks before publishing: a valid title (R73) and at least one activity (R66). */
export function validateItineraryDraft(
  draft: Pick<ItineraryDraft, "title" | "activities">,
): ItineraryDraftError[] {
  const errors: ItineraryDraftError[] = [];
  const title = validateItineraryTitle(draft.title);
  if (!title.ok) errors.push(title.error);
  if (draft.activities.length === 0) errors.push("no_activities");
  return errors;
}

type ItineraryForCopy = {
  title: string;
  destination: string;
  theme: string;
  currency: string;
  dayCount: number;
  activities: readonly ItineraryActivityDraft[];
  stays: readonly Omit<ItineraryStayDraft, "areaSearch">[];
  foods: readonly ItineraryFoodDraft[];
};

/**
 * Copies a whole itinerary into a new detailed plan starting on `startDate` (R68): the end date
 * follows the itinerary's day count, activities and stays land on the matching dates with
 * times kept, and the food list comes along. People, costs and contributions are not copied.
 */
export function copyItineraryToNewPlan(
  itinerary: ItineraryForCopy,
  startDate: LocalDate,
):
  | {
      ok: true;
      plan: {
        kind: "detailed";
        name: string;
        location: string;
        startDate: LocalDate;
        endDate: LocalDate;
        theme: string;
        currency: string;
      };
      activities: PlanActivity[];
      stays: (PlanStay & { areaSearch: string })[];
      foods: PlanFood[];
    }
  | { ok: false; error: "invalid_date" | "too_long" } {
  if (!isLocalDate(startDate)) return { ok: false, error: "invalid_date" };
  if (itinerary.dayCount < 1 || itinerary.dayCount > MAX_PLAN_DAYS)
    return { ok: false, error: "too_long" };

  return {
    ok: true,
    plan: {
      kind: "detailed",
      name: itinerary.title,
      location: itinerary.destination,
      startDate,
      endDate: addDays(startDate, itinerary.dayCount - 1),
      theme: itinerary.theme,
      currency: itinerary.currency,
    },
    activities: itinerary.activities.map(({ day, ...rest }) => ({
      ...rest,
      date: dateOfPlanDay(startDate, day),
    })),
    stays: itinerary.stays.map(({ checkInDay, checkOutDay, ...rest }) => ({
      ...rest,
      areaSearch: normalizeSearchText(rest.area),
      checkInDate: dateOfPlanDay(startDate, checkInDay),
      checkOutDate: dateOfPlanDay(startDate, checkOutDay),
    })),
    foods: [...itinerary.foods]
      .sort((a, b) => a.order - b.order)
      .map((food, index) => ({ ...food, order: index })),
  };
}

/**
 * The plan date that receives an itinerary's Day `day` when copying into an existing plan,
 * or `null` ("Ngày chưa xác định") when the plan is shorter (R79, R81). Shown next to each
 * day in the pick list.
 */
export function planDateForItineraryDay(
  plan: { startDate: LocalDate; endDate: LocalDate },
  day: number,
): LocalDate | null {
  return day >= 1 && day <= planDayCount(plan.startDate, plan.endDate)
    ? dateOfPlanDay(plan.startDate, day)
    : null;
}

/**
 * Copies the selected itinerary activities into an existing plan (R79): Day N goes to the plan's
 * day N with its time (or no time); days beyond the plan go to "Ngày chưa xác định". No stays.
 * Only while the summary is open (R59); food can still be added when locked (see food-match).
 */
export function copyItineraryActivitiesToPlan(
  plan: {
    kind: PlanKind;
    summaryStatus: SummaryStatus;
    startDate: LocalDate;
    endDate: LocalDate;
  },
  selected: readonly ItineraryActivityDraft[],
):
  | { ok: true; activities: PlanActivity[] }
  | {
      ok: false;
      error: "not_detailed" | "summary_not_open" | "nothing_selected";
    } {
  if (plan.kind !== "detailed") return { ok: false, error: "not_detailed" };
  if (plan.summaryStatus !== "open")
    return { ok: false, error: "summary_not_open" };
  if (selected.length === 0) return { ok: false, error: "nothing_selected" };
  return {
    ok: true,
    activities: selected.map(({ day, ...rest }) => ({
      ...rest,
      date: planDateForItineraryDay(plan, day),
    })),
  };
}
