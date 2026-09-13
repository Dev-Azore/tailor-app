'use client';

import { logout } from '@/app/(auth)/actions';
import { LogOut } from 'lucide-react';

interface AppHeaderProps {
  name: string;
  plan: string;
}

export function AppHeader({ name, plan }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800/60">
      <div className="flex items-center justify-between px-4 h-14 max-w-2xl mx-auto">
        {/* Logo + Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow shadow-orange-500/25 flex-shrink-0">
            <span className="text-sm font-black text-white">T</span>
          </div>
          <span className="text-sm font-semibold text-slate-100 truncate max-w-[140px]">{name}</span>
          {plan === 'premium' && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              PRO
            </span>
          )}
        </div>

        {/* Sign out */}
        <form action={logout}>
          <button
            id="app-signout-btn"
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
