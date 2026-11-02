import { cn } from "@/lib/utils";

/**
 * The main action of a phone screen, fixed above the home indicator: full width like "Tạo kế
 * hoạch" (G01) or on the right like "Thêm hoạt động" (G04). Desktop shows the action in the
 * page, so the bar is phone only. A spacer keeps the end of the page from hiding behind it.
 */
export function BottomActionBar({
  children,
  align = "stretch",
}: {
  children: React.ReactNode;
  align?: "stretch" | "end";
}) {
  return (
    <>
      <div aria-hidden className="h-24 md:hidden" />
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-20 flex pt-3 px-page pb-safe *:pointer-events-auto md:hidden",
          align === "end" ? "justify-end" : "*:flex-1",
        )}
      >
        {children}
      </div>
    </>
  );
}
