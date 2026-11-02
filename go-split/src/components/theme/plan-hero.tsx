import Image from "next/image";
import type { ReactNode } from "react";

import { resolveTheme, themeArtPath } from "@/domain/themes";

/** The plan's own photo (R30); `focus` is the point to keep in view, 0–1 on each axis. */
export type CoverImage = { src: string; focus?: { x: number; y: number } };

/**
 * Top of a plan: the theme illustration, or the plan's own photo (R29, R30). The theme's
 * hero color shows while the image loads or if it fails, and the title sits on a scrim
 * panel so text keeps its contrast over any picture (WCAG AA).
 */
export function PlanHero({
  theme,
  cover,
  title,
  subtitle,
  actions,
}: {
  theme: string | null | undefined;
  cover?: CoverImage | null;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  const position = cover?.focus
    ? `${cover.focus.x * 100}% ${cover.focus.y * 100}%`
    : "center";
  return (
    <header className="relative h-[300px] overflow-hidden bg-hero md:h-[220px]">
      <Image
        src={cover?.src ?? themeArtPath(resolveTheme(theme).code)}
        alt=""
        fill
        sizes="100vw"
        preload
        // Theme art is a small SVG: nothing to optimize.
        unoptimized={!cover}
        className="object-cover"
        style={{ objectPosition: position }}
      />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between pt-3.5 px-page pb-10 md:pb-5">
        <div className="flex justify-between gap-2">{actions}</div>
        <div className="self-start rounded-2xl bg-scrim px-4 py-3">
          <h1 className="font-heading text-2xl leading-tight font-bold">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
