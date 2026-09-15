'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Sparkles, Shield } from 'lucide-react';
import { KrystalLogo } from '@/components/brand/KrystalLogo';

export function LandingFooter() {
  return (
    <footer className="bg-[#040e1e] border-t border-[#0B2545] text-slate-300 text-sm py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#0B2545]">
          {/* Brand & About */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B2545] border border-[#84F200]/40 flex items-center justify-center shadow-lg shadow-[#84F200]/10 p-1">
                <KrystalLogo className="w-8 h-8" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight">
                  TailorApp
                </span>
                <span className="text-xs text-[#84F200] font-bold -mt-1">
                  By Krystal Solutions
                </span>
              </div>
            </div>
            <p className="text-slate-300 max-w-sm text-sm leading-relaxed">
              The premier bespoke measurement management system designed exclusively for Nigerian fashion designers, couture ateliers, and master clothiers.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#84F200] font-bold">
              <Sparkles className="w-4 h-4" />
              <span>A product of Krystal Solutions</span>
            </div>
          </div>

          {/* Real Kano Contact Details */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Studio & Hub Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#84F200] flex-shrink-0 mt-0.5" />
                <span>No.1 & 2 Ayumsa Plaza, Sabo Bakin Zuwo Road, Kano State, Nigeria.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#84F200] flex-shrink-0" />
                <a href="tel:+2347061110002" className="hover:text-[#84F200] font-semibold text-white transition-colors">
                  +234 706 111 0002
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#84F200] flex-shrink-0" />
                <a href="mailto:support@tailorapp.com" className="hover:text-[#84F200] font-semibold text-white transition-colors">
                  support@tailorapp.com
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Portals */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-[#84F200] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-[#84F200] transition-colors">
                  Interactive Studio
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#84F200] transition-colors font-medium">
                  Tailor Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#84F200] transition-colors font-medium">
                  Create Free Account
                </Link>
              </li>
              <li>
                <Link href="/admin-login" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Console</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} TailorApp by Krystal Solutions. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with pride in Kano State for the global tailoring community.
          </p>
        </div>
      </div>
    </footer>
  );
}
