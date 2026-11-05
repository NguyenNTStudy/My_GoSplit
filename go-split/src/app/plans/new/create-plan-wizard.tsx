"use client";

import {
  ChevronLeft,
  Receipt,
  Route,
  ShieldCheck,
  TriangleAlert,
  X,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { BottomActionBar } from "@/components/layout/bottom-action-bar";
import { CurrencyPicker } from "@/components/plan/currency-picker";
import { ThemePicker } from "@/components/theme/theme-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { FieldError, NewPlanInput, PlanKind } from "@/domain/new-plan";
import { validateNewPlan } from "@/domain/new-plan";
import { isValidPasscode, isWeakPasscode } from "@/domain/passcode";
import {
  addDays,
  MAX_PLAN_DAYS,
  planDayCount,
  validatePlanDateRange,
} from "@/domain/plan-dates";
import {
  BASIC_DESCRIPTION_MAX_LENGTH,
  PLAN_NAME_MAX_LENGTH,
  countChars,
} from "@/domain/text-rules";
import type { ThemeCode } from "@/domain/themes";
import { isThemeCode } from "@/domain/themes";
import { cn } from "@/lib/utils";

import { createPlanAction } from "./actions";

type Step = "type" | "info" | "theme" | "passcode";
type Errors = Partial<Record<keyof NewPlanInput, FieldError>>;

const STEPS: Record<PlanKind, Step[]> = {
  basic: ["info", "passcode"],
  detailed: ["info", "theme", "passcode"],
};
const INFO_FIELDS: (keyof NewPlanInput)[] = [
  "name",
  "currency",
  "description",
  "participantNames",
  "location",
  "startDate",
  "endDate",
  "notes",
];
const FORM_ID = "create-plan";

export function CreatePlanWizard({
  initialKind,
  defaultCurrency,
  recentCurrencies,
  ownerName,
}: {
  initialKind: PlanKind;
  defaultCurrency: string;
  recentCurrencies: string[];
  ownerName: string;
}) {
  const t = useTranslations("createPlan");
  const nav = useTranslations("nav");
  const tv = useTranslations("validation");

  const [kind, setKind] = useState<PlanKind>(initialKind);
  const [step, setStep] = useState<Step>("type");
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState(defaultCurrency);
  const [description, setDescription] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [newPerson, setNewPerson] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [theme, setTheme] = useState<ThemeCode>("gao-am");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  const steps = STEPS[kind];
  const stepIndex = steps.indexOf(step);
  const isLast = step === "passcode";

  const input = (): NewPlanInput => ({
    kind,
    name,
    currency,
    passcode,
    ...(kind === "basic"
      ? { description, participantNames: people }
      : { location, startDate, endDate, notes, theme }),
  });

  const errorText = (field: keyof NewPlanInput) => {
    const error = errors[field];
    // Codes come from src/domain and all exist under `validation` (checked by i18n.test.ts).
    return error
      ? tv(`${error.area}.${error.code}` as never, error.values as never)
      : null;
  };

  function addPerson() {
    const value = newPerson.trim();
    if (value) setPeople((list) => [...list, value]);
    setNewPerson("");
  }

  function goBack() {
    setErrors({});
    setStep(stepIndex <= 0 ? "type" : steps[stepIndex - 1]);
  }

  function goNext(form: HTMLFormElement) {
    if (step === "type") return setStep("info");
    if (step === "info") {
      // The passcode comes later; check everything else now.
      const result = validateNewPlan({ ...input(), passcode: "000000" });
      if (!result.ok) {
        setErrors(result.errors);
        return;
      }
    }
    if (step === "theme") {
      const picked = new FormData(form).get("theme");
      if (isThemeCode(picked)) setTheme(picked);
    }
    setErrors({});
    setStep(steps[stepIndex + 1]);
  }

  function create() {
    if (!isValidPasscode(passcode)) {
      setErrors({ passcode: { area: "passcode", code: "invalid" } });
      return;
    }
    setFailed(false);
    startTransition(async () => {
      const result = await createPlanAction(input());
      if ("errors" in result) {
        setErrors(result.errors);
        if (INFO_FIELDS.some((field) => result.errors[field])) setStep("info");
      } else {
        setFailed(true);
      }
    });
  }

  const subtitle =
    step === "type"
      ? t("chooseType")
      : [
          kind === "basic" ? t("basicName") : null,
          t("progress", {
            step: stepIndex + 1,
            total: steps.length,
            name: t(
              step === "info"
                ? "stepInfo"
                : step === "theme"
                  ? "stepTheme"
                  : "stepPasscode",
            ),
          }),
        ]
          .filter(Boolean)
          .join(" · ");

  const nameLeft = PLAN_NAME_MAX_LENGTH - countChars(name.trim());
  const dayCount =
    startDate && endDate && !validatePlanDateRange(startDate, endDate)
      ? planDayCount(startDate, endDate)
      : null;
  const primaryLabel = isLast ? t("create") : t("continue");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        {step === "type" ? (
          <Link
            href="/"
            aria-label={nav("close")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-card"
          >
            <X aria-hidden className="size-5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={goBack}
            aria-label={nav("back")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full border bg-card"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </button>
        )}
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {step !== "type" && (
        <div aria-hidden className="flex gap-1.5">
          {steps.map((s, i) => (
            <span
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full",
                i <= stepIndex ? "bg-brand" : "bg-border",
              )}
            />
          ))}
        </div>
      )}

      <form
        id={FORM_ID}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (isLast) create();
          else goNext(event.currentTarget);
        }}
        className="flex flex-col gap-5"
      >
        {step === "type" && (
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 font-heading text-xl font-bold">
              {t("typeQuestion")}
            </legend>
            <RadioGroup
              value={kind}
              onValueChange={(value) => setKind(value as PlanKind)}
              className="gap-3"
            >
              {(["basic", "detailed"] as const).map((option) => {
                const Icon = option === "basic" ? Receipt : Route;
                const tags =
                  option === "basic"
                    ? [t("tagCosts"), t("tagSummary")]
                    : [
                        t("tagSchedule"),
                        t("tagFood"),
                        t("tagCosts"),
                        t("tagSummary"),
                      ];
                return (
                  <label
                    key={option}
                    className="flex cursor-pointer flex-col gap-3 rounded-2xl border-2 bg-card p-4 has-[[data-checked]]:border-brand"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-brand">
                        <Icon aria-hidden className="size-5" />
                      </span>
                      <span className="flex-1 font-heading text-lg font-bold">
                        {t(option === "basic" ? "basicName" : "detailedName")}
                      </span>
                      <RadioGroupItem value={option} />
                    </span>
                    <span className="text-sm">
                      {t(
                        option === "basic"
                          ? "basicDescription"
                          : "detailedDescription",
                      )}
                    </span>
                    <span className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </label>
                );
              })}
            </RadioGroup>
            <p className="text-sm text-muted-foreground">{t("typeNote")}</p>
          </fieldset>
        )}

        {step === "info" && (
          <>
            <Field id="name" label={t("name")} error={errorText("name")}>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                autoComplete="off"
              />
              {nameLeft <= 10 && (
                <p
                  className={cn(
                    "text-xs",
                    nameLeft < 0 ? "text-destructive" : "text-muted-foreground",
                  )}
                >
                  {t("charsLeft", { count: Math.max(nameLeft, 0) })}
                </p>
              )}
            </Field>

            {kind === "detailed" && (
              <>
                <Field
                  id="location"
                  label={t("location")}
                  error={errorText("location")}
                >
                  <Input
                    id="location"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    aria-invalid={Boolean(errors.location)}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="startDate" label={t("startDate")}>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(event) => {
                        const value = event.target.value;
                        setStartDate(value);
                        if (value && (!endDate || endDate < value))
                          setEndDate(value);
                      }}
                    />
                  </Field>
                  <Field id="endDate" label={t("endDate")}>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      max={
                        startDate
                          ? addDays(startDate, MAX_PLAN_DAYS - 1)
                          : undefined
                      }
                      onChange={(event) => setEndDate(event.target.value)}
                      aria-invalid={Boolean(errors.endDate)}
                      aria-describedby="endDate-error"
                    />
                  </Field>
                </div>
                <p
                  id="endDate-error"
                  className={cn(
                    "-mt-3 text-xs",
                    errors.endDate
                      ? "text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {errorText("endDate") ??
                    t("dayCount", { count: dayCount ?? 0 })}
                </p>
              </>
            )}

            <Field
              id="currency"
              label={t("currency")}
              error={errorText("currency")}
            >
              <CurrencyPicker
                id="currency"
                value={currency}
                onChange={setCurrency}
                recentCodes={recentCurrencies}
              />
            </Field>

            {kind === "basic" && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">
                  {t("participants", { count: people.length + 1 })}
                </legend>
                <ul className="flex flex-wrap gap-2">
                  <li className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">
                    {ownerName}{" "}
                    <span className="text-muted-foreground">{t("you")}</span>
                  </li>
                  {people.map((person, i) => (
                    <li
                      key={`${person}-${i}`}
                      className="flex items-center gap-1 rounded-full border bg-card py-1 pr-1 pl-3 text-sm"
                    >
                      {person}
                      <button
                        type="button"
                        aria-label={t("removeName", { name: person })}
                        onClick={() =>
                          setPeople((list) => list.filter((_, j) => j !== i))
                        }
                        className="rounded-full p-1 hover:bg-muted"
                      >
                        <X aria-hidden className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    value={newPerson}
                    onChange={(event) => setNewPerson(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addPerson();
                      }
                    }}
                    placeholder={t("addName")}
                    aria-label={t("addName")}
                  />
                  <Button type="button" variant="outline" onClick={addPerson}>
                    {t("add")}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {errorText("participantNames") ?? t("addLater")}
                </p>
              </fieldset>
            )}

            {kind === "basic" ? (
              <Field
                id="description"
                label={t("description")}
                hint={t("optional")}
                error={errorText("description")}
              >
                <Textarea
                  id="description"
                  value={description}
                  maxLength={BASIC_DESCRIPTION_MAX_LENGTH + 20}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  aria-invalid={Boolean(errors.description)}
                />
                <p className="text-right text-xs text-muted-foreground">
                  {countChars(description.trim())}/
                  {BASIC_DESCRIPTION_MAX_LENGTH}
                </p>
              </Field>
            ) : (
              <Field
                id="notes"
                label={t("notes")}
                hint={t("optional")}
                error={errorText("notes")}
              >
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={t("notesPlaceholder")}
                />
              </Field>
            )}
          </>
        )}

        {step === "theme" && (
          <ThemePicker defaultValue={theme} previewTitle={name.trim()} />
        )}

        {step === "passcode" && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold">
                {t("passcodeTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("passcodeIntro")}
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="passcode">{t("passcodeLabel")}</Label>
                <button
                  type="button"
                  onClick={() => setShowPasscode((v) => !v)}
                  className="text-sm font-medium text-brand"
                >
                  {showPasscode ? t("hide") : t("show")}
                </button>
              </div>
              <Input
                id="passcode"
                type={showPasscode ? "text" : "password"}
                inputMode="numeric"
                autoComplete="off"
                maxLength={6}
                value={passcode}
                onChange={(event) =>
                  setPasscode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                aria-invalid={Boolean(errors.passcode)}
                aria-describedby="passcode-note"
                className="h-14 max-w-64 text-center font-heading text-2xl tracking-[0.5em]"
              />
              <div id="passcode-note" aria-live="polite">
                {errors.passcode ? (
                  <p className="text-sm text-destructive">
                    {errorText("passcode")}
                  </p>
                ) : (
                  isValidPasscode(passcode) &&
                  isWeakPasscode(passcode) && (
                    <p className="flex items-center gap-2 rounded-xl bg-warning p-3 text-sm text-warning-foreground">
                      <TriangleAlert aria-hidden className="size-4 shrink-0" />
                      {tv("passcode.weak")}
                    </p>
                  )
                )}
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-secondary p-4">
              <ShieldCheck
                aria-hidden
                className="mt-0.5 size-5 shrink-0 text-money-ok-foreground"
              />
              <div>
                <p className="font-semibold">{t("ownerTitle")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("ownerNote")}
                </p>
              </div>
            </div>
            {failed && (
              <p role="alert" className="text-sm text-destructive">
                {t("failed")}
              </p>
            )}
          </div>
        )}

        <div className="hidden justify-end gap-2 md:flex">
          {step !== "type" && (
            <Button type="button" variant="outline" size="lg" onClick={goBack}>
              {t("back")}
            </Button>
          )}
          <Button type="submit" size="lg" disabled={pending}>
            {primaryLabel}
          </Button>
        </div>
      </form>

      <BottomActionBar>
        <Button
          type="submit"
          form={FORM_ID}
          size="lg"
          disabled={pending}
          className="h-14 text-base"
        >
          {primaryLabel}
        </Button>
      </BottomActionBar>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {hint && (
          <span className="font-normal text-muted-foreground">{hint}</span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
