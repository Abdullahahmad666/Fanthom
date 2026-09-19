/**
 * The origin the app is being served from.
 *
 * `process.env.X ?? fallback` is not enough here. A variable that exists but
 * is empty -- which is exactly what a Vercel project variable created with a
 * blank value looks like -- passes straight through `??` and reaches
 * `new URL("")`, which throws ERR_INVALID_URL and fails the build during page
 * data collection. Empty has to be treated as absent.
 *
 * Vercel's own deployment URLs are used before falling back to localhost, so
 * a deploy with nothing configured still produces absolute OG URLs rather
 * than pointing scrapers at a developer's machine.
 */

const clean = (v: string | undefined) => {
  const s = v?.trim();
  return s ? s : undefined;
};

const withScheme = (host: string | undefined) =>
  host ? (/^https?:\/\//.test(host) ? host : `https://${host}`) : undefined;

export function resolveSiteUrl(): string {
  const candidate =
    clean(process.env.NEXT_PUBLIC_SITE_URL) ??
    withScheme(clean(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)) ??
    withScheme(clean(process.env.VERCEL_PROJECT_PRODUCTION_URL)) ??
    withScheme(clean(process.env.VERCEL_URL)) ??
    "http://localhost:3000";

  /* Never let a malformed value break the build; a wrong-but-valid origin
     costs a bad OG preview, a throw costs the whole deploy. */
  try {
    return new URL(candidate).toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE_URL = resolveSiteUrl();
