import type { ComponentProps } from "react";

import { resolveTheme } from "@/domain/themes";
import { cn } from "@/lib/utils";

/**
 * Applies a plan's theme to everything inside (R29): the token block in globals.css, plus
 * `.dark` for dark themes so shadcn's dark: variants follow. Outside a plan, Gạo ấm applies.
 */
export function ThemeScope({
  theme,
  className,
  ...props
}: ComponentProps<"div"> & { theme: string | null | undefined }) {
  const resolved = resolveTheme(theme);
  return (
    <div
      data-theme={resolved.code}
      className={cn(
        resolved.dark && "dark",
        "bg-background text-foreground",
        className,
      )}
      {...props}
    />
  );
}
