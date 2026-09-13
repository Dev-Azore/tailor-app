import { redirect } from 'next/navigation';

// Root "/" redirects to /dashboard (authenticated) or /login via middleware.
export default function RootPage() {
  redirect('/dashboard');
}
