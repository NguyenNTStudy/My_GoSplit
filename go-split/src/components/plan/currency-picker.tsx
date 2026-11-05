"use client";

import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { CurrencyInfo } from "@/domain/currency";
import {
  currencyPickerSections,
  findCurrency,
  searchCurrencies,
} from "@/domain/currency";

/**
 * The plan's currency: symbol, code and name, changed through a searchable list (R1, R70, R71).
 * Nothing found leaves the current choice as it is.
 */
export function CurrencyPicker({
  id,
  value,
  onChange,
  recentCodes,
}: {
  id: string;
  value: string;
  onChange: (code: string) => void;
  recentCodes: readonly string[];
}) {
  const t = useTranslations("currencyPicker");
  const nav = useTranslations("nav");
  const lang = useLocale() === "vi" ? "vi" : "en";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const current = findCurrency(value);

  const sections = useMemo(() => {
    if (query.trim()) {
      return [{ key: "results", title: null, items: searchCurrencies(query) }];
    }
    const { recent, popular, all } = currencyPickerSections(recentCodes);
    return [
      { key: "recent", title: t("recent"), items: recent },
      { key: "popular", title: t("popular"), items: popular },
      { key: "all", title: t("all"), items: all },
    ].filter((section) => section.items.length > 0);
  }, [query, recentCodes, t]);

  const label = (c: CurrencyInfo) => `${c.code} · ${c.name[lang]}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DialogTrigger
        id={id}
        className="flex h-12 w-full items-center gap-3 rounded-xl border border-input bg-card px-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold"
        >
          {current?.narrowSymbol}
        </span>
        <span className="flex-1 truncate font-medium">
          {current ? label(current) : value}
        </span>
        <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
      </DialogTrigger>
      <DialogContent
        initialFocus={searchRef}
        showCloseButton={false}
        className="flex max-h-[85dvh] flex-col gap-3 p-4"
      >
        <div className="flex items-center justify-between gap-2">
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogClose className="rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-muted">
            {nav("close")}
          </DialogClose>
        </div>
        <Input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search")}
          aria-label={t("search")}
        />
        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {sections.every((section) => section.items.length === 0) && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </p>
          )}
          {sections.map((section) => (
            <section key={section.key} className="mb-3">
              {section.title && (
                <h3 className="mb-1 text-xs font-semibold text-muted-foreground">
                  {section.title}
                </h3>
              )}
              <ul>
                {section.items.map((c) => (
                  <li key={`${section.key}-${c.code}`}>
                    <button
                      type="button"
                      aria-pressed={c.code === value}
                      onClick={() => {
                        onChange(c.code);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-muted aria-pressed:bg-accent"
                    >
                      <span
                        aria-hidden
                        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold"
                      >
                        {c.narrowSymbol}
                      </span>
                      <span className="truncate">{label(c)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
