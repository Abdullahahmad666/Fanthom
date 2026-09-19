# Deploying to Vercel

The app runs with **no configuration at all** — every route falls back to the
in-memory fixtures, so a deploy with an empty environment still works end to
end. Everything below is about switching real Google sign-in and calendar on
top of that.

---

## 1. Deploy

1. Push to GitHub.
2. Vercel → **Add New… → Project** → import the repo.
3. Leave every build setting alone. `vercel.json` sets the framework and the
   security headers; Vercel detects the rest from `package.json`.
4. **Deploy.**

It will build and serve on fixtures. Note the URL it gives you — call it
`https://<app>.vercel.app` below.

---

## 2. Environment variables

Vercel → Project → **Settings → Environment Variables**. Add these to
**Production** (and Preview, if you want the same behaviour there):

| Name | Value | Needed for |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://<app>.vercel.app` | Correct OG image URLs and OAuth redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Sign-in, calendar |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` key | Sign-in, calendar |
| `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` | `true` | Real Google round trip |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` | Seed script only |
| `ZOOM_CLIENT_ID` / `ZOOM_CLIENT_SECRET` | Zoom app credentials | Real Zoom connect (optional) |

> `NEXT_PUBLIC_*` values are **baked into the client bundle at build time**.
> After changing any of them you must **redeploy** — Vercel → Deployments → ⋯ →
> Redeploy, with "Use existing build cache" **off**. Editing the variable alone
> changes nothing that is already built.

### Leaving Google off

Set `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=false`, or leave the Supabase values blank.
The sign-in buttons then walk straight into onboarding and the calendar step
shows its seeded list. This is the right setting for a reviewer, because
Google blocks unverified apps for anyone who is not an added test user — they
would hit a Google error page that no code of ours can recover from.

---

## 3. Supabase

1. **SQL Editor** → run `backend/supabase/migrations/0001_init.sql`.
   Optionally run `backend/supabase/seed.sql` too.
2. **Authentication → Providers → Google** → enable, paste the Google client
   ID and secret from step 4.
3. **Authentication → URL Configuration**:
   - Site URL: `https://<app>.vercel.app`
   - Redirect URLs: add both
     `https://<app>.vercel.app/**` and `http://localhost:3000/**`

---

## 4. Google Cloud

In the project that owns the OAuth client:

1. **APIs & Services → Library → Google Calendar API → Enable.**
   This is a separate switch from creating the OAuth client, and missing it is
   the most common cause of the calendar step failing.
2. **APIs & Services → Credentials → your OAuth 2.0 Client → Authorized
   redirect URIs**, add:
   `https://<project-ref>.supabase.co/auth/v1/callback`
   (the Supabase callback, not the Vercel URL — Supabase brokers the exchange).
3. **OAuth consent screen → Data access**, add the scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `.../auth/calendar.readonly`
   - `.../auth/calendar.events.readonly`
4. **OAuth consent screen → Audience → Test users**, add every Google account
   that needs to sign in. While the app is unverified, nobody else can.

---

## 5. Checks after deploying

- `/` , `/pricing`, `/calls`, `/calls/q3-launch-readiness`, `/settings` all load.
- View source on `/` — `og:image` should point at your Vercel URL, not
  `localhost:3000`. If it says localhost, `NEXT_PUBLIC_SITE_URL` was not set at
  **build** time.
- With Google on: `/signup` → Continue with Google → consent → questionnaire.
- Onboarding → Connect Google Calendar lists real events.

### If the calendar step fails

The step reports Google's own reason rather than a generic error. The four it
distinguishes:

| Message | Fix |
|---|---|
| "The Google Calendar API is not enabled…" | Step 4.1 |
| "This sign-in did not grant calendar access…" | Step 4.3, then Reconnect Google |
| "Google's access token has expired…" | Reconnect Google |
| "…carries no Google token" | Sign in again |

Supabase drops the Google token when it refreshes a session, and Google's
lasts about an hour — so sign in fresh just before demonstrating the calendar.
