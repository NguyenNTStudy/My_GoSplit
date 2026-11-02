import type { MetadataRoute } from "next";

// No sitemap: plans and other shared pages are never listed (R46). Those pages are not
// blocked here either, because crawlers have to load them to read their noindex header.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] } };
}
