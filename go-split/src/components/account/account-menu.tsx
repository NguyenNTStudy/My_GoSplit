"use client";

import { Menu } from "@base-ui/react/menu";
import { useTranslations } from "next-intl";

import { authClient } from "@/lib/auth-client";

/** The round initial at the top right; opens the account actions. */
export function AccountMenu({ name }: { name: string }) {
  const t = useTranslations("nav");
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? "";

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={t("account")}
        className="flex size-10 items-center justify-center rounded-full bg-brand font-semibold text-brand-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {initial}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={8}>
          <Menu.Popup className="min-w-44 rounded-xl border bg-popover p-1 text-popover-foreground shadow-md">
            <p className="truncate px-3 py-2 text-sm font-semibold">{name}</p>
            <Menu.Item
              className="cursor-pointer rounded-lg px-3 py-2 text-sm data-highlighted:bg-muted"
              onClick={async () => {
                await authClient.signOut();
                // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full load on purpose: the router may hold pages rendered for the other session state
                window.location.assign("/");
              }}
            >
              {t("logout")}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
