'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { KrystalLogo } from '@/components/brand/KrystalLogo';

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="flex items-center justify-between h-16 px-6 rounded-2xl bg-[#071A34]/85 backdrop-blur-xl border border-lime-400/30 shadow-2xl shadow-[#040e1e]/90">
          {/* Logo Brand with Krystal Solutions Dual-Color Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0B2545] border border-lime-400/40 flex items-center justify-center shadow-lg shadow-lime-400/10 group-hover:scale-105 transition-transform p-1">
              <KrystalLogo className="w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                TailorApp
                <span className="text-[10px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-lime-400 text-[#071A34]">
                  Krystal
                </span>
              </span>
              <span className="text-[11px] text-lime-400/90 font-medium -mt-1">
                Bespoke Measurement Suite
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200">
            <a href="#features" className="hover:text-lime-400 transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-lime-400 transition-colors flex items-center gap-1.5">
              <span>Studio Demo</span>
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
            </a>
            <a href="#pricing" className="hover:text-lime-400 transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-lime-400 transition-colors">
              FAQ
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-200 hover:text-white hover:bg-[#0B2545]">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="glow" size="sm" className="gap-1.5 bg-lime-400 hover:bg-lime-300 text-[#071A34] font-black shadow-lg shadow-lime-400/25">
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
