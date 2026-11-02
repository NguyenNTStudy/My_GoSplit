// Trip dates are trip-local calendar days stored as "YYYY-MM-DD" and never converted between
// time zones (docs/data-model/README.md "Ngày giờ"). Math runs on UTC day numbers so the
// machine's time zone can't shift a result.

export type LocalDate = string;

/** A detailed plan lasts at most 60 days, first and last day included (R2). */
export const MAX_PLAN_DAYS = 60;

const MS_PER_DAY = 86_400_000;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function toDayNumber(date: LocalDate): number {
  const match = DATE_PATTERN.exec(date);
  if (!match) throw new RangeError(`Not a YYYY-MM-DD date: ${date}`);
  const [, y, m, d] = match;
  const ms = Date.UTC(Number(y), Number(m) - 1, Number(d));
  if (new Date(ms).toISOString().slice(0, 10) !== date)
    throw new RangeError(`Not a calendar date: ${date}`);
  return ms / MS_PER_DAY;
}

function fromDayNumber(day: number): LocalDate {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

/** True for a real calendar date in "YYYY-MM-DD" form (rejects 2026-02-30). */
export function isLocalDate(value: string): boolean {
  try {
    toDayNumber(value);
    return true;
  } catch {
    return false;
  }
}

export function addDays(date: LocalDate, days: number): LocalDate {
  return fromDayNumber(toDayNumber(date) + days);
}

/** `to − from` in days. */
export function daysBetween(from: LocalDate, to: LocalDate): number {
  return toDayNumber(to) - toDayNumber(from);
}

/** Number of days in a plan, both ends included. */
export function planDayCount(startDate: LocalDate, endDate: LocalDate): number {
  return daysBetween(startDate, endDate) + 1;
}

/** Day number (Day 1 = start date) of `date`; below 1 or above the day count when outside the plan. */
export function dayNumberInPlan(startDate: LocalDate, date: LocalDate): number {
  return daysBetween(startDate, date) + 1;
}

/** The date of Day `day` of a plan. */
export function dateOfPlanDay(startDate: LocalDate, day: number): LocalDate {
  return addDays(startDate, day - 1);
}

export function isDateInPlan(
  plan: { startDate: LocalDate; endDate: LocalDate },
  date: LocalDate,
): boolean {
  return date >= plan.startDate && date <= plan.endDate;
}

export type PlanDateRangeError =
  "invalid_date" | "end_before_start" | "too_long";

/** R2: valid dates, end not before start, at most 60 days. */
export function validatePlanDateRange(
  startDate: LocalDate,
  endDate: LocalDate,
): PlanDateRangeError | null {
  if (!isLocalDate(startDate) || !isLocalDate(endDate)) return "invalid_date";
  if (endDate < startDate) return "end_before_start";
  if (planDayCount(startDate, endDate) > MAX_PLAN_DAYS) return "too_long";
  return null;
}

/**
 * R80: when the start date changes, ask whether to move activities and stays only if the plan
 * has some and its summary is still open (locked plans can't edit activities, R59).
 */
export function shouldAskToMoveItems(
  summaryStatus: "open" | "locked" | "final",
  hasActivitiesOrStays: boolean,
): boolean {
  return summaryStatus === "open" && hasActivitiesOrStays;
}

type DatedActivity = { date: LocalDate | null };
type DatedStay = { checkInDate: LocalDate; checkOutDate: LocalDate };

/**
 * Changes a plan's start date (R80). The end date moves to keep the plan's length. With
 * `moveItems`, dated activities and stays move by the same number of days; times are kept
 * and undated activities stay undated. Expenses and contributions keep their dates, so they
 * aren't inputs here. Stays outside the new range must be fixed before saving (R31, R80).
 */
export function changePlanStartDate<
  A extends DatedActivity,
  S extends DatedStay,
>(
  plan: { startDate: LocalDate; endDate: LocalDate },
  newStartDate: LocalDate,
  items: { activities: readonly A[]; stays: readonly S[]; moveItems: boolean },
):
  | {
      ok: true;
      startDate: LocalDate;
      endDate: LocalDate;
      activities: A[];
      stays: S[];
      staysOutOfRange: S[];
    }
  | { ok: false; error: PlanDateRangeError } {
  if (!isLocalDate(newStartDate)) return { ok: false, error: "invalid_date" };
  const shift = daysBetween(plan.startDate, newStartDate);
  const endDate = addDays(plan.endDate, shift);
  const rangeError = validatePlanDateRange(newStartDate, endDate);
  if (rangeError) return { ok: false, error: rangeError };

  const activities = items.activities.map((activity) =>
    items.moveItems && activity.date
      ? { ...activity, date: addDays(activity.date, shift) }
      : { ...activity },
  );
  const stays = items.stays.map((stay) =>
    items.moveItems
      ? {
          ...stay,
          checkInDate: addDays(stay.checkInDate, shift),
          checkOutDate: addDays(stay.checkOutDate, shift),
        }
      : { ...stay },
  );
  const range = { startDate: newStartDate, endDate };
  const staysOutOfRange = stays.filter(
    (stay) =>
      !isDateInPlan(range, stay.checkInDate) ||
      !isDateInPlan(range, stay.checkOutDate),
  );
  return {
    ok: true,
    startDate: newStartDate,
    endDate,
    activities,
    stays,
    staysOutOfRange,
  };
}
