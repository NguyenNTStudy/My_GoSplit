// Response headers for every page (task 9), applied in next.config.ts. Later entries win
// when two set the same header, so the per-page rules come after the defaults.

/**
 * Pages search engines must not index (R46): plans, food guides, itineraries, user pages and
 * recruit posts, plus account and admin screens. Robots.txt must not block them, or crawlers
 * never see this header.
 */
export const NOINDEX_SOURCES = [
  "/p/:path*",
  "/guides/:path*",
  "/itineraries/:path*",
  "/u/:path*",
  "/recruit/:postId",
  "/invite/:path*",
  "/plans/:path*",
  "/admin/:path*",
  "/welcome",
  "/forgot-password",
  "/reset-password",
  "/dev/:path*",
];

export function securityHeaders() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
        },
      ],
    },
    ...NOINDEX_SOURCES.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    })),
    {
      // The plan address holds its share key: never send it to other sites (R50).
      source: "/p/:path*",
      headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
    },
  ];
}
