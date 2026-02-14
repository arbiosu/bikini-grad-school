import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require admin access
const ADMIN_ROUTES = ['/admin'];
const ADMIN_LOGIN = '/admin/login';

// Routes that require any authenticated user
const AUTH_ROUTES = ['/my-account'];
const USER_LOGIN = '/login';

// Routes that authenticated users shouldn't access (redirect to account)
const GUEST_ONLY_ROUTES = ['/login', '/claim-account'];

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isGuestOnlyRoute(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.some((route) => pathname.startsWith(route));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and getClaims()
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const appMetadata = claims?.app_metadata;
  const isAuthenticated = !!claims;
  const isAdmin = appMetadata?.user_role === 'admin';
  const pathname = request.nextUrl.pathname;

  //console.log(appMetadata, isAuthenticated, isAdmin, pathname);

  // --- Admin routes ---
  if (isAdminRoute(pathname)) {
    // Always allow admin login page
    if (pathname === ADMIN_LOGIN) {
      if (isAuthenticated && isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // Not logged in — redirect to admin login
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = ADMIN_LOGIN;
      return NextResponse.redirect(url);
    }

    // Logged in but not admin — redirect to homepage
    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }
  // --- Authenticated subscriber routes ---
  if (isAuthRoute(pathname)) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = USER_LOGIN;
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // --- Guest-only routes (login, claim-account) ---
  if (isGuestOnlyRoute(pathname)) {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/my-account';
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // --- Public routes (pricing, homepage, etc.) ---
  return supabaseResponse;
}
