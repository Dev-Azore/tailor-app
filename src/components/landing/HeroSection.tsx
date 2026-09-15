'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Scissors,
  Ruler,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#040e1e]">
      {/* Dual ambient lighting: Deep Navy + Electric Lime */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0B2545]/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-[#84F200]/15 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#071A34] border border-[#84F200]/40 shadow-xl shadow-[#84F200]/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#84F200] animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-[#84F200]">
                Krystal Solutions • Tailor Suite
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Never Lose a Client’s{' '}
              <span className="text-[#84F200] underline decoration-[#84F200]/40 decoration-wavy decoration-2">
                Fitting History
              </span>{' '}
              Again.
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
              The premier bespoke measurement system built for Nigerian tailors, couture ateliers, and fashion designers. Record Kaftan, Babban Riga, Senator, and Bridal fittings with zero paper loss.
            </p>

            {/* Feature quick bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 w-full max-w-xl text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#84F200] flex-shrink-0" />
                <span>Zero paper book mixups or lost sheets</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#84F200] flex-shrink-0" />
                <span>Permanent immutable fitting tickets</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#84F200] flex-shrink-0" />
                <span>Tailored for Kaftan, Babban Riga, Senator & Gowns</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#84F200] flex-shrink-0" />
                <span>Works on any Android or iPhone</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 w-full sm:w-auto">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-3 bg-[#84F200] hover:bg-[#76E000] text-[#071A34] text-base font-black shadow-2xl shadow-[#84F200]/30 hover:scale-[1.02] transition-all">
                  <span>Create Free Account</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#demo">
                <Button size="lg" className="w-full sm:w-auto gap-2 border border-[#84F200]/30 bg-[#071A34] hover:bg-[#0B2545] text-white font-bold">
                  <Ruler className="w-4 h-4 text-[#84F200]" />
                  <span>Try Live Studio Demo</span>
                </Button>
              </a>
            </div>

            {/* Trusted Tailors Bar */}
            <div className="pt-4 border-t border-[#0B2545] w-full max-w-xl">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#84F200] block mb-2">
                Trusted by Top Couture Masters in Kano:
              </span>
              <div className="flex flex-wrap gap-2 text-xs text-slate-300 font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-[#071A34] border border-[#0B2545]">Bn Isma&apos;il Clothing</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#071A34] border border-[#0B2545]">Kankara Couture & More</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#071A34] border border-[#0B2545]">Yamani Clothing</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#071A34] border border-[#0B2545]">KF Modeling & Stitches</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#071A34] border border-[#0B2545]">M.A Clothing</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Dual-Brand Card Shell */}
          <div className="lg:col-span-5 relative perspective-1000">
            <div className="relative transform-3d transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-2">
              {/* Floating Badge 1 */}
              <div className="absolute -top-6 -left-6 z-20 bg-[#071A34] p-3.5 rounded-2xl border border-[#84F200]/40 shadow-2xl animate-float hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#84F200]/20 text-[#84F200] flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Alhaji Aminu Dantata</div>
                  <div className="text-[10px] text-[#84F200] font-semibold">Kano State • 5 Fitted Outfits</div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-[#0B2545] p-3 rounded-2xl border border-white/10 shadow-2xl animate-float hidden sm:flex items-center gap-2.5" style={{ animationDelay: '2.5s' }}>
                <div className="w-9 h-9 rounded-xl bg-[#84F200]/20 text-[#84F200] flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Kano Royal Kaftan</div>
                  <div className="text-[10px] text-slate-300">8 Custom Measurements</div>
                </div>
              </div>

              {/* Central Card Shell */}
              <div className="rounded-3xl p-6 sm:p-7 relative overflow-hidden bg-[#071A34] border-2 border-[#84F200]/40 shadow-2xl shadow-[#040e1e]">
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-[#0B2545]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B2545] border border-[#84F200]/30 flex items-center justify-center text-[#84F200] font-black">
                      BR
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Kano Babban Riga Set</h4>
                      <p className="text-xs text-slate-400">Client: Hon. Garba Bello • Kano</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#84F200] text-[#071A34]">
                    Verified Ticket
                  </span>
                </div>

                {/* Measurements Grid (Kano Menswear) */}
                <div className="grid grid-cols-2 gap-3 py-5">
                  {[
                    { label: 'Riga / Gown Length', val: '58.0', unit: 'in' },
                    { label: 'Hannu / Wing Span', val: '66.0', unit: 'in' },
                    { label: 'Kirji / Inner Chest', val: '44.5', unit: 'in' },
                    { label: 'Tsawon Wando / Outseam', val: '42.0', unit: 'in' },
                    { label: 'Kugun Wando / Waist', val: '35.0', unit: 'in' },
                    { label: 'Kafa / Ankle Width', val: '15.0', unit: 'in' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#040e1e] border border-[#0B2545] rounded-xl p-3 flex flex-col justify-between hover:border-[#84F200]/40 transition"
                    >
                      <span className="text-[11px] font-medium text-slate-400 truncate">
                        {item.label}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-black text-[#84F200] font-mono">
                          {item.val}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-[#0B2545]">
                  <div className="flex items-center gap-1.5 text-slate-200">
                    <ShieldCheck className="w-4 h-4 text-[#84F200]" />
                    <span>Snapshot #KN-2026-088</span>
                  </div>
                  <span className="text-[#84F200] font-semibold">Cloud Secured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
