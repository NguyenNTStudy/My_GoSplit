import { cn } from "@/lib/utils";

/**
 * One column on phones and tablets. From `lg` the aside sits on the right at 360 px and stays
 * in view while the main column scrolls (GD2: costs with the summary beside them). On phones
 * the aside is hidden by default, because the same content has its own tab there.
 */
export function SplitLayout({
  children,
  aside,
  asideOnPhone = "hidden",
  className,
}: {
  children: React.ReactNode;
  aside: React.ReactNode;
  asideOnPhone?: "hidden" | "below";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "lg:grid lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-start lg:gap-6",
        className,
      )}
    >
      <div className="min-w-0">{children}</div>
      <aside
        className={cn(
          "lg:sticky lg:top-6",
          asideOnPhone === "hidden" ? "hidden lg:block" : "mt-6 lg:mt-0",
        )}
      >
        {aside}
      </aside>
    </div>
  );
}
