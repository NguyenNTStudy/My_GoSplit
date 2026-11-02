"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import {
  DEFAULT_THEME,
  THEMES,
  type ThemeCode,
  themeArtPath,
} from "@/domain/themes";
import { formatMoney } from "@/i18n/format";

import { ThemeScope } from "./theme-scope";

/**
 * Theme choice with a live preview, for creating or editing a plan (R29). The choice is a
 * plain radio field, so it submits with the surrounding form.
 */
export function ThemePicker({
  name = "theme",
  defaultValue = DEFAULT_THEME,
  previewTitle,
}: {
  name?: string;
  defaultValue?: ThemeCode;
  /** The plan's name, shown in the preview. */
  previewTitle: string;
}) {
  const t = useTranslations("themes");
  const locale = useLocale();
  const [selected, setSelected] = useState<ThemeCode>(defaultValue);

  return (
    <div className="grid gap-5 md:grid-cols-[1fr_280px]">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">{t("legend")}</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((theme) => (
            <label
              key={theme.code}
              className="cursor-pointer rounded-xl border-2 border-border bg-card p-2 has-checked:border-brand has-focus-visible:ring-2 has-focus-visible:ring-ring"
            >
              <input
                type="radio"
                name={name}
                value={theme.code}
                checked={selected === theme.code}
                onChange={() => setSelected(theme.code)}
                className="sr-only"
              />
              <Image
                src={themeArtPath(theme.code)}
                alt=""
                width={390}
                height={300}
                unoptimized
                className="h-20 w-full rounded-lg object-cover"
              />
              <span className="mt-2 block text-sm font-medium">
                {t(`names.${theme.code}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <ThemeScope
        theme={selected}
        aria-label={t("preview")}
        role="img"
        className="overflow-hidden rounded-2xl border"
      >
        <div className="relative h-28 bg-hero">
          <Image
            src={themeArtPath(selected)}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
          <p className="absolute bottom-3 left-3 rounded-xl bg-scrim px-3 py-1.5 font-heading font-bold">
            {previewTitle}
          </p>
        </div>
        <div className="space-y-2 p-3">
          <div className="rounded-xl bg-brand px-3 py-2 text-brand-foreground">
            <p className="text-xs">{t("previewTotal")}</p>
            <p className="font-heading text-xl font-bold">
              {formatMoney("398.5", "USD", locale)}
            </p>
          </div>
          <div className="rounded-xl border bg-card px-3 py-2 text-sm">
            <p className="font-semibold">{t("previewItem")}</p>
            <p className="text-muted-foreground">{t("previewItemDetail")}</p>
          </div>
        </div>
      </ThemeScope>
    </div>
  );
}
