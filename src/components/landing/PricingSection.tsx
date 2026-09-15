'use client';

import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-[#040e1e] border-t border-[#0B2545]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071A34] border border-[#84F200]/30 text-[#84F200] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start Free. Upgrade As You Scale.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Every core tailoring feature is 100% free with non-intrusive banner sponsorships. Premium ad-free subscription is on the roadmap.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Tier Card */}
          <div className="rounded-3xl p-8 bg-[#071A34] border-2 border-[#84F200] shadow-2xl shadow-[#84F200]/10 flex flex-col justify-between relative">
            {/* Badge */}
            <div className="absolute -top-3.5 left-8 px-3.5 py-1 rounded-full bg-[#84F200] text-[#071A34] text-xs font-black uppercase tracking-wider shadow">
              Most Popular • Free Forever
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white">Starter Tailor</h3>
                <p className="text-sm text-slate-300 mt-1">
                  Full access for independent tailors and bespoke fashion artisans.
                </p>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white font-mono">$0</span>
                <span className="text-slate-400 text-sm font-medium">/ month (Free Forever)</span>
              </div>

              {/* Feature List */}
              <ul className="space-y-3.5 text-sm text-slate-200">
                {[
                  'Unlimited Clients & Profiles',
                  'Unlimited Custom Garment Templates',
                  'Immutable Measurement Snapshots',
                  'Client Search & Fitting History',
                  'Installable Mobile PWA App Shell',
                  'Non-intrusive Ad-supported tier',
                  'Secure Cloud Backup with Supabase',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#84F200]/20 text-[#84F200] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-[#0B2545]">
              <Link href="/register" className="w-full block">
                <Button size="lg" className="w-full bg-[#84F200] hover:bg-[#76E000] text-[#071A34] font-black shadow-xl shadow-[#84F200]/25">
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Premium Tier (Coming Soon) */}
          <div className="rounded-3xl p-8 bg-[#071A34]/40 border border-[#0B2545] flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white">Master Studio</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    For high-volume ateliers and commercial fashion houses.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#040e1e] text-[#84F200] text-[11px] font-black uppercase tracking-wider border border-[#84F200]/30">
                  Coming Soon
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-slate-400 font-mono">$9</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>

              {/* Feature List */}
              <ul className="space-y-3.5 text-sm text-slate-400">
                {[
                  'Everything in Starter Tailor',
                  '100% Ad-Free Experience',
                  'Client SMS & WhatsApp Measurement Sharing',
                  'Export Measurements to PDF / Printable Slips',
                  'Priority Atelier Customer Support',
                  'Custom Shop Branding & Logo on Receipts',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#040e1e] text-slate-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-[#0B2545]">
              <Button size="lg" disabled className="w-full text-slate-500 bg-[#040e1e] border border-[#0B2545]">
                Available in Sprint 6
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
