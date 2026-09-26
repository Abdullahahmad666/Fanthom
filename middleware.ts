import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Session refresh, and the gate in front of the app.
 *
 * Two jobs. It keeps the Supabase session fresh so Server Components always
 * read a valid user, and it decides who is allowed past /calls.
 *
 * The gate is conditional on Supabase being configured at all. With no
 * credentials there is no such thing as being signed in, and gating would lock
 * every route in a deployment meant to run on sample data -- so that build
 * stays open. Once there is a database, signed-out means signed-out.
 *
 * It deliberately does NOT redirect a signed-in visitor away from /login and
 * /signup any more. It used to, straight to /calls, without a word -- which is
 * what made clicking "Sign in" look like it went somewhere random, because the
 * page it landed on is empty for a new account. Those two pages now recognise
 * the session themselves and say so, which is an explanation rather than a
 * jump. Redirecting is the kind of thing middleware should only do when there
 * is nothing worth saying.
 */

/** Everything that requires a session, once there is a database to have one in. */
const PRIVATE = ["/calls", "/playlists", "/settings", "/import", "/onboarding", "/deals", "/alerts", "/team"];

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  if (!user && matches(pathname, PRIVATE)) {
    /* Carry where they were going, so signing in finishes the journey they
       started rather than dumping them on a generic landing page. */
    const to = request.nextUrl.clone();
    to.pathname = "/login";
    to.search = "";
    to.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(to);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
