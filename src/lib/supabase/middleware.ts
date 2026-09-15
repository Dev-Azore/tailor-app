import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Route classification
  const isAuthRoute =
    path.startsWith('/login') ||
    path.startsWith('/register') ||
    path.startsWith('/admin-login'); // admin entry point is a public auth page
  const isPublicRoute = isAuthRoute || path.startsWith('/suspended');
  const isAppRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/clients') ||
    path.startsWith('/templates') ||
    path.startsWith('/measurements');
  // /admin-login is excluded from the admin guard — it must remain publicly reachable
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin-login');

  // Unauthenticated users: redirect to appropriate login page
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = isAdminRoute ? '/admin-login' : '/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    // Authenticated users visiting any auth/login page: redirect away
    if (isAuthRoute) {
      const { data: profile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', user.id)
        .single();

      // Admins → admin console; tailors → dashboard
      const destination = profile?.role === 'admin' ? '/admin' : '/dashboard';
      const url = request.nextUrl.clone();
      url.pathname = destination;
      return NextResponse.redirect(url);
    }

    if (isAppRoute || isAdminRoute) {
      // 1 query per request for role and status
      const { data: profile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', user.id)
        .single();

      if (profile?.status === 'suspended' && !path.startsWith('/suspended')) {
        const url = request.nextUrl.clone();
        url.pathname = '/suspended';
        return NextResponse.redirect(url);
      }

      if (isAdminRoute && profile?.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
