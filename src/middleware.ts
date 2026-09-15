import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/**
 * Next.js middleware entry point.
 * Delegates to updateSession which:
 *  1. Refreshes the Supabase session cookie on every request.
 *  2. Redirects unauthenticated users away from protected routes to /login.
 *  3. Redirects authenticated users away from auth routes to /dashboard.
 *  4. Blocks suspended tailors (status = 'suspended') to /suspended.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public image/font/svg files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
