# Backend

Supabase — Postgres, auth and row level security — plus the service layer the
Next.js routes call.

**The app runs without any of this.** With no Supabase keys it falls back to the
in-memory fixtures, so the deployed demo never breaks while the backend is being
set up. Everything below turns that from a prototype into a real account.

---

## What is real

| Capability | How |
|---|---|
| Sign up / sign in | Supabase Auth, Google and Microsoft OAuth |
| Google Calendar | Calendar scopes requested **at sign-in**, so connecting needs no second consent. Events pulled live and cached |
| Per-user data | Every table owner-scoped with row level security |
| Onboarding | Each step persisted to `profiles` |
| Meetings, transcripts, summaries, action items, highlights, playlists | Full schema, RLS on all of it |
| Zoom / Teams | Schema and status UI ready; OAuth needs a provider app (see below) |
| Recording capture, ASR | Not built, and not planned — see the root README |

---

## Setup

### 1. Create the project

New project at [supabase.com](https://supabase.com). From **Project Settings → API**
copy the URL, the `anon` key and the `service_role` key into `.env.local`:

```bash
cp .env.example .env.local
```

The service-role key bypasses RLS. It is server-only and must never reach the
browser — `.env.local` is gitignored.

### 2. Run the migration

Supabase dashboard → **SQL Editor** → paste and run:

```
backend/supabase/migrations/0001_init.sql
```

This creates the tables, the RLS policies, and a trigger that writes a `profiles`
row whenever someone signs up, so the app never has to handle a missing profile.

### 3. Enable Google sign-in

**Authentication → Providers → Google.**

In the [Google Cloud console](https://console.cloud.google.com):

1. Create an OAuth 2.0 Client ID (Web application).
2. Authorised redirect URI:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Enable the **Google Calendar API** for the project.
4. Add the scopes `calendar.readonly` and `calendar.events.readonly` on the
   consent screen.

Paste the client ID and secret into Supabase. Under **URL Configuration**, set the
site URL and add `http://localhost:3000/auth/callback` plus your deployed
`/auth/callback` to the redirect allow-list.

> Calendar scopes are requested during sign-in, so a user who signs in with
> Google has already granted calendar access. `POST /api/calendar/sync` then
> pulls their next twelve events. Without those scopes the sync returns
> `no-google-token` and the UI falls back to seeded events.

### 4. Seed a user

Sign in through the app once, then run `backend/supabase/seed.sql` in the SQL
editor. It defines `seed_demo_data()`; call it as the signed-in user:

```sql
select public.seed_demo_data();
```

Safe to re-run — it clears that user's meetings first.

### 5. Microsoft (optional)

**Authentication → Providers → Azure**, with an app registration in Entra ID.
Teams recording access needs Graph permissions and admin consent, which is why
the Teams card currently shows status only.

### 6. Zoom (optional)

A Zoom OAuth app gives real recording access but needs Zoom's review before it
works for accounts other than your own. Set `ZOOM_CLIENT_ID` and
`ZOOM_CLIENT_SECRET` to enable it; without them the Zoom card links out to
Zoom's own sign-up, which is honest rather than a dead button.

---

## Layout

```
backend/
  supabase/
    migrations/0001_init.sql   schema, RLS, new-user trigger
    seed.sql                   seed_demo_data() for a signed-in user
  src/
    env.ts                     env access + isSupabaseConfigured()
    supabase/client.ts         browser client (null when unconfigured)
    supabase/server.ts         request-scoped server client + getUser()
    supabase/admin.ts          service-role client, server only
    google/calendar.ts         Calendar API + platform detection
    services/onboarding.ts     profile writes per onboarding step
    services/integrations.ts   provider status, calendar sync and cache
```

Routes that consume it:

| Route | Purpose |
|---|---|
| `GET /auth/callback` | Exchanges the OAuth code for a session |
| `POST /auth/signout` | Ends the session |
| `POST /api/calendar/sync` | Pulls and caches upcoming events |
| `middleware.ts` | Refreshes the session on every request |

---

## Design notes

**Null clients rather than throwing.** `createClient()` returns `null` when
unconfigured so each caller can fall back to fixtures. A backend half-configured
in the middle of a demo degrades instead of erroring.

**The provider token is not stored.** Google returns a fresh one on each
sign-in and it lives on the Supabase session. Copying it into our table would
create a second thing to keep in sync and a second thing to leak.

**RLS on every table, no exceptions.** Child rows check ownership through their
parent meeting, so the anon key is safe in the browser: policies decide what is
visible, not the client.
