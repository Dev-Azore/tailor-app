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
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');
  const isPublicRoute = isAuthRoute || path.startsWith('/suspended');
  const isAppRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/clients') ||
    path.startsWith('/templates') ||
    path.startsWith('/measurements');
  const isAdminRoute = path.startsWith('/admin');

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user) {
    if (isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (isAppRoute || isAdminRoute) {
      // 1 query per request for role and status, per prompt §4.3
      const { data: profile } = await supabase
        .from('users')
        .select('role, status')
        .eq('id', user.id)
        .single();

      if (profile?.status === 'suspended' && !request.nextUrl.pathname.startsWith('/suspended')) {
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
