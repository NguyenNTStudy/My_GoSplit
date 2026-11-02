import { cn } from "@/lib/utils";

/** Centred content column with the page gutters; 1152 px wide at most, as in the web wireframes. */
export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-page", className)}
      {...props}
    />
  );
}
