'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Scissors,
  Check,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

type GarmentPreset = 'kaftan_male' | 'babban_riga' | 'senator' | 'female_gown';

interface PresetData {
  title: string;
  category: string;
  description: string;
  defaultClient: string;
  fields: { name: string; defaultVal: string; placeholder: string }[];
}

const NIGERIAN_PRESETS: Record<GarmentPreset, PresetData> = {
  kaftan_male: {
    title: 'Kano Royal Kaftan (Male)',
    category: 'Traditional Northern Menswear',
    description: 'Precision measurement blueprint for high-collar Kaftans, custom shirt length, hand sleeve, and sokoto trousers.',
    defaultClient: 'Mallam Ibrahim Shehu (Kano)',
    fields: [
      { name: 'Tsawon Riga (Shirt Length)', defaultVal: '38.0', placeholder: '38.0' },
      { name: 'Fadin Kafada (Shoulder)', defaultVal: '18.5', placeholder: '18.5' },
      { name: 'Kirji (Chest)', defaultVal: '41.0', placeholder: '41.0' },
      { name: 'Tsawon Hannu (Sleeve Length)', defaultVal: '25.0', placeholder: '25.0' },
      { name: 'Kewaye Wando (Trouser Waist)', defaultVal: '34.0', placeholder: '34.0' },
      { name: 'Tsawon Wando (Trouser Outseam)', defaultVal: '41.5', placeholder: '41.5' },
      { name: 'Cinye (Thigh Width)', defaultVal: '26.0', placeholder: '26.0' },
      { name: 'Kafar Wando (Ankle Width)', defaultVal: '14.5', placeholder: '14.5' },
    ],
  },
  babban_riga: {
    title: 'Babban Riga & Buba Set',
    category: 'Ceremonial Northern Attire',
    description: 'Full 3-piece traditional attire: Outer Babban Riga robe, Inner Buba shirt, and Sokoto.',
    defaultClient: 'Alhaji Bashir Dangote (Nasarawa, Kano)',
    fields: [
      { name: 'Tsawon Babban Riga (Robe Length)', defaultVal: '58.0', placeholder: '58.0' },
      { name: 'Fadin Hannu (Wing Span Wrist-to-Wrist)', defaultVal: '65.0', placeholder: '65.0' },
      { name: 'Kirjin Buba (Inner Shirt Chest)', defaultVal: '44.0', placeholder: '44.0' },
      { name: 'Tsawon Buba (Inner Shirt Length)', defaultVal: '38.0', placeholder: '38.0' },
      { name: 'Tsawon Wando (Trouser Length)', defaultVal: '42.0', placeholder: '42.0' },
      { name: 'Wuyan Riga (Neck Circumference)', defaultVal: '16.5', placeholder: '16.5' },
    ],
  },
  senator: {
    title: 'Executive Senator Wear (Male)',
    category: 'Contemporary Nigerian Menswear',
    description: 'Sleek executive 2-piece fitted suit cut with structured neckline and matching slim-fit trousers.',
    defaultClient: 'Usman Farouk (Fagge, Kano)',
    fields: [
      { name: 'Top Length', defaultVal: '36.5', placeholder: '36.5' },
      { name: 'Shoulder Width', defaultVal: '18.0', placeholder: '18.0' },
      { name: 'Chest Circumference', defaultVal: '40.5', placeholder: '40.5' },
      { name: 'Short Sleeve / Long Sleeve', defaultVal: '10.5', placeholder: '10.5' },
      { name: 'Trouser Waist', defaultVal: '33.0', placeholder: '33.0' },
      { name: 'Trouser Length', defaultVal: '40.0', placeholder: '40.0' },
    ],
  },
  female_gown: {
    title: 'Northern Female Gown / Abaya / Skirt (Female)',
    category: 'Northern Womenswear & Couture',
    description: 'Precision contours for Northern female Abayas, fitted gowns, corset seams, and 6-piece skirt cuts.',
    defaultClient: 'Hajiya Fatima Bello (Tarauni, Kano)',
    fields: [
      { name: 'Bust Circumference', defaultVal: '37.0', placeholder: '37.0' },
      { name: 'Underbust', defaultVal: '30.5', placeholder: '30.5' },
      { name: 'Kunkuru / Waist', defaultVal: '29.0', placeholder: '29.0' },
      { name: 'Kugu / Full Hip', defaultVal: '42.0', placeholder: '42.0' },
      { name: 'Tsawon Riga / Abaya Length', defaultVal: '59.0', placeholder: '59.0' },
      { name: 'Tsawon Siket (Skirt Length)', defaultVal: '43.0', placeholder: '43.0' },
      { name: 'Hannu (Sleeve Length)', defaultVal: '24.0', placeholder: '24.0' },
    ],
  },
};

export function InteractiveDemo() {
  const [activePreset, setActivePreset] = useState<GarmentPreset>('kaftan_male');
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [clientName, setClientName] = useState(NIGERIAN_PRESETS.kaftan_male.defaultClient);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    NIGERIAN_PRESETS.kaftan_male.fields.forEach((f) => {
      initial[f.name] = f.defaultVal;
    });
    return initial;
  });
  const [isSaved, setIsSaved] = useState(false);

  const handlePresetChange = (preset: GarmentPreset) => {
    setActivePreset(preset);
    setClientName(NIGERIAN_PRESETS[preset].defaultClient);
    const initial: Record<string, string> = {};
    NIGERIAN_PRESETS[preset].fields.forEach((f) => {
      initial[f.name] = f.defaultVal;
    });
    setFieldValues(initial);
    setIsSaved(false);
  };

  const handleFieldChange = (name: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [name]: val }));
    setIsSaved(false);
  };

  const handleSimulateSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 4000);
  };

  const current = NIGERIAN_PRESETS[activePreset];

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-[#040e1e] border-y border-[#0B2545]">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#0B2545]/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] bg-[#84F200]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071A34] border border-[#84F200]/30 text-[#84F200] text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Studio Test (Kano State & Nigerian Cuts)
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Try Taking a Nigerian Measurement Now
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Test how effortlessly you can take male and female measurements for Kaftan, Babban Riga, Senator, and Gowns with millimeter precision.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {(
            [
              { key: 'kaftan_male', label: 'Kano Kaftan (Male)' },
              { key: 'babban_riga', label: 'Babban Riga 3-Piece' },
              { key: 'senator', label: 'Senator Wear (Male)' },
              { key: 'female_gown', label: 'Gown / Abaya (Female)' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => handlePresetChange(item.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-200 cursor-pointer ${
                activePreset === item.key
                  ? 'bg-[#84F200] text-[#071A34] shadow-lg shadow-[#84F200]/25 scale-105'
                  : 'bg-[#071A34] border border-[#0B2545] text-slate-300 hover:text-white hover:border-[#84F200]/40'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Interactive Studio Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left: Input Form Studio */}
          <div className="lg:col-span-7 bg-[#071A34] p-6 sm:p-8 rounded-3xl border-2 border-[#84F200]/30 shadow-2xl shadow-[#040e1e] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#0B2545]">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#84F200]">
                  {current.category}
                </span>
                <h3 className="text-xl font-black text-white">{current.title}</h3>
              </div>

              {/* Unit Switcher */}
              <div className="flex items-center gap-1 bg-[#040e1e] border border-[#0B2545] p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                    unit === 'in' ? 'bg-[#84F200] text-[#071A34] shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                    unit === 'cm' ? 'bg-[#84F200] text-[#071A34] shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Centimeters
                </button>
              </div>
            </div>

            {/* Client name input field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                Client Name & Location
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#040e1e] border border-[#0B2545] rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#84F200] transition"
              />
            </div>

            {/* Fields Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                Measurement Fields ({current.fields.length})
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.fields.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#040e1e] border border-[#0B2545] rounded-xl flex items-center justify-between gap-3 focus-within:border-[#84F200]/60 transition"
                  >
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {f.name}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <input
                        type="text"
                        value={fieldValues[f.name] ?? ''}
                        onChange={(e) => handleFieldChange(f.name, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-16 px-2 py-1 bg-[#071A34] border border-[#0B2545] rounded-md text-sm font-mono font-black text-[#84F200] text-right focus:outline-none focus:border-[#84F200]"
                      />
                      <span className="text-xs text-slate-400 font-bold">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Button
                size="lg"
                onClick={handleSimulateSave}
                className="w-full sm:flex-1 gap-2 bg-[#84F200] hover:bg-[#76E000] text-[#071A34] font-black shadow-xl shadow-[#84F200]/25 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <Check className="w-5 h-5 text-[#071A34]" />
                    <span>Snapshot Saved to Cloud!</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4 text-[#071A34]" />
                    <span>Save Immutable Snapshot</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Live Simulated Output Snapshot Card */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#071A34] p-6 rounded-3xl border border-[#84F200]/30 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#0B2545]">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#84F200] animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                    Kano Studio Ticket
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#84F200] bg-[#84F200]/10 px-2 py-0.5 rounded border border-[#84F200]/30">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div className="py-4 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Client Record</span>
                <h4 className="text-lg font-black text-white">{clientName || 'Untitled Client'}</h4>
                <p className="text-xs text-[#84F200] font-semibold">{current.title}</p>
              </div>

              {/* Snapshot data view */}
              <div className="bg-[#040e1e] rounded-2xl p-4 border border-[#0B2545] max-h-[220px] overflow-y-auto space-y-2">
                {current.fields.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#071A34] last:border-0">
                    <span className="text-slate-300 truncate">{f.name}</span>
                    <span className="font-mono font-bold text-[#84F200] flex-shrink-0">
                      {fieldValues[f.name] || '-'} {unit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-[#0B2545]">
                <div className="flex items-center gap-1 text-[#84F200] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Snapshot is Permanent & Immutable</span>
                </div>
                <span className="text-slate-400">Kano Hub</span>
              </div>
            </div>

            {/* Quick CTA card */}
            <div className="p-5 rounded-2xl bg-[#0B2545] border border-[#84F200]/20 text-sm text-slate-300 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">Ready to digitize your tailoring?</p>
                <p className="text-xs text-slate-300">Join leading tailors in Kano & Nigeria.</p>
              </div>
              <Link href="/register">
                <Button size="sm" className="bg-[#84F200] text-[#071A34] font-black hover:bg-[#76E000] flex-shrink-0">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
