'use client';

import {
  History,
  Layers,
  Users,
  Smartphone,
  ShieldCheck,
  Search,
  Scissors,
} from 'lucide-react';

const FEATURES = [
  {
    icon: History,
    title: 'Immutable Snapshots',
    description:
      'Never overwrite past measurements. Every fitting is preserved in history as a permanent snapshot so you can track body changes across months or years.',
    tag: 'Core Innovation',
  },
  {
    icon: Layers,
    title: 'Custom Garment Templates',
    description:
      'Create custom field blueprints for Suits, Kaftans, Agbadas, Senator wear, Shirts, and Wedding Gowns with custom ordering and units (Inches / cm).',
    tag: 'Total Flexibility',
  },
  {
    icon: Users,
    title: 'Client Rolodex & History',
    description:
      'Keep all your client phone numbers, fit notes, body posture observations, and order histories in one lightning-fast searchable directory.',
    tag: 'Zero Paper Records',
  },
  {
    icon: Smartphone,
    title: 'Installable PWA App',
    description:
      'Add TailorApp straight to your Android or iPhone home screen. Clean, full-screen mobile app experience with zero app store downloads needed.',
    tag: 'Mobile First',
  },
  {
    icon: ShieldCheck,
    title: 'Strict Data Isolation',
    description:
      'Multi-tenant architecture powered by Supabase Row-Level Security. Your client lists and bespoke measurements remain strictly private to your shop.',
    tag: '100% Private',
  },
  {
    icon: Search,
    title: 'Instant Search & Filter',
    description:
      'Find any client by name or phone in under 100 milliseconds right when they walk into your shop or call on the phone.',
    tag: 'Speed Optimized',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#040e1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071A34] border border-[#84F200]/30 text-[#84F200] text-xs font-black uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5 text-[#84F200]" />
            Designed for Modern Sartorial Artisans
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything You Need to Run a Flawless Tailoring Studio
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Say goodbye to stained paper notebooks, lost measuring slips, and fitting mixups. TailorApp delivers digital perfection to your craft.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-7 bg-[#071A34] border border-[#0B2545] hover:border-[#84F200]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#84F200]/5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#0B2545] border border-[#84F200]/30 flex items-center justify-center text-[#84F200] group-hover:scale-110 group-hover:border-[#84F200] transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#040e1e] text-[#84F200] border border-[#84F200]/20">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#84F200] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#0B2545] flex items-center text-xs text-slate-400 group-hover:text-[#84F200] font-bold transition-colors">
                  <span>Built for workshop speed &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
