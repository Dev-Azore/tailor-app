'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Ruler, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', Icon: Users },
  { href: '/measurements/new', label: 'Measure', Icon: ClipboardList },
  { href: '/templates', label: 'Templates', Icon: Ruler },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#071A34]/95 backdrop-blur-md border-t border-[#0B2545] safe-area-pb">
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
              className={`relative flex flex-col items-center gap-1 px-3 py-3 min-w-[56px] transition-all ${
                isActive ? 'text-[#81c784] font-bold' : 'text-slate-400 hover:text-white'
              }`}
              aria-label={label}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-[#81c784]' : ''}`} />
              <span className="text-[10px] leading-none">{label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#2e7d32] rounded-full shadow-sm shadow-[#2e7d32]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
