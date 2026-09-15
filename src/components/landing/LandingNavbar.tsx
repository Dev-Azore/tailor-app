'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Scissors } from 'lucide-react';

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav className="flex items-center justify-between h-16 px-4 sm:px-6 rounded-2xl bg-[#071A34]/90 backdrop-blur-xl border border-[#2e7d32]/35 shadow-2xl shadow-[#040e1e]/90">
          {/* Brand Logo & Name (No Krystal Logo) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0B2545] border border-[#2e7d32]/50 flex items-center justify-center shadow-lg shadow-[#2e7d32]/15 group-hover:scale-105 transition-transform text-[#81c784]">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                TailorApp
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#81c784] font-medium -mt-0.5 sm:-mt-1">
                Measurement Book for Tailors
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-200">
            <a href="#features" className="hover:text-[#81c784] transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-[#81c784] transition-colors flex items-center gap-1.5">
              <span>Studio Demo</span>
              <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />
            </a>
            <a href="#pricing" className="hover:text-[#81c784] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#81c784] transition-colors">
              FAQ
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2.5 sm:px-3 text-slate-200 hover:text-white hover:bg-[#0B2545]">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="text-xs sm:text-sm px-3 sm:px-4 gap-1.5 bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-bold shadow-lg shadow-[#2e7d32]/25">
                <span>Start Free</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
