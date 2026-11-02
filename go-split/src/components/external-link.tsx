/**
 * A link that leaves the app, such as a map or directions to a restaurant. It opens in a new tab
 * and never tells the other site which page it came from, so plan links stay private (R50).
 */
export function ExternalLink({
  children,
  ...props
}: Omit<React.ComponentProps<"a">, "target" | "rel" | "referrerPolicy">) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer noopener"
      referrerPolicy="no-referrer"
    >
      {children}
    </a>
  );
}
