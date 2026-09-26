import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Crawl rules.
 *
 * The marketing pages are meant to be found, so they are indexable. Anything
 * behind sign-in is not: those URLs are per-account, a crawler can only ever
 * see the login redirect, and having them in an index invites people to land
 * on a page that immediately bounces them. The API is disallowed for the same
 * reason plus a simpler one -- it returns JSON, which has no business in
 * search results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/calls", "/calls/", "/settings", "/playlists", "/import", "/onboarding/", "/deals", "/alerts", "/team"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
