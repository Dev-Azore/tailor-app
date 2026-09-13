import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';

// Tailor-facing routes use Client Components (CSR) per spec §3.6.
// This layout is a Server Component that provides auth context to children,
// then children themselves are 'use client' components.

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('name, plan, status')
    .eq('id', user.id)
    .single();

  if (!profile || profile.status === 'suspended') {
    redirect('/suspended');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <AppHeader name={profile.name} plan={profile.plan} />
      <main className="flex-1 pb-24 max-w-2xl w-full mx-auto px-4 pt-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
