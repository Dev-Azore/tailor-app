'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Ruler, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', Icon: Users },
  { href: '/templates', label: 'Templates', Icon: Ruler },
  { href: '/measurements/new', label: 'Measure', Icon: ClipboardList },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 safe-area-pb">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href.replace('/new', ''));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-3 min-w-[56px] transition-colors ${
                isActive ? 'text-lime-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              aria-label={label}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium leading-none">{label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-lime-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
