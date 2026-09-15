'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Scissors,
  Check,
  Sparkles,
  ShieldCheck,
  RefreshCw,
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
    title: 'Royal Kaftan (Male)',
    category: 'Northern Menswear',
    description: 'Standard measurement for Kaftans, custom shirt length, chest, sleeves, and trousers (Sokoto).',
    defaultClient: 'Faisal Abubakar',
    fields: [
      { name: 'Tsawon Riga (Shirt Length)', defaultVal: '38.0', placeholder: '38.0' },
      { name: 'Fadin Kafada (Shoulder)', defaultVal: '18.5', placeholder: '18.5' },
      { name: 'Kirji (Chest)', defaultVal: '41.0', placeholder: '41.0' },
      { name: 'Tsawon Hannu (Sleeve Length)', defaultVal: '25.0', placeholder: '25.0' },
      { name: 'Kewaye Wando (Trouser Waist)', defaultVal: '34.0', placeholder: '34.0' },
      { name: 'Tsawon Wando (Trouser Length)', defaultVal: '41.5', placeholder: '41.5' },
      { name: 'Cinye (Thigh Width)', defaultVal: '26.0', placeholder: '26.0' },
      { name: 'Kafar Wando (Ankle Width)', defaultVal: '14.5', placeholder: '14.5' },
    ],
  },
  babban_riga: {
    title: 'Babban Riga 3-Piece Set',
    category: 'Traditional Menswear',
    description: 'Complete 3-piece traditional wear: Outer Babban Riga robe, Inner Buba shirt, and Sokoto trousers.',
    defaultClient: 'Umar Rufa\'i',
    fields: [
      { name: 'Tsawon Babban Riga (Robe Length)', defaultVal: '58.0', placeholder: '58.0' },
      { name: 'Fadin Hannu (Wing Span)', defaultVal: '65.0', placeholder: '65.0' },
      { name: 'Kirjin Buba (Inner Shirt Chest)', defaultVal: '44.0', placeholder: '44.0' },
      { name: 'Tsawon Buba (Inner Shirt Length)', defaultVal: '38.0', placeholder: '38.0' },
      { name: 'Tsawon Wando (Trouser Length)', defaultVal: '42.0', placeholder: '42.0' },
      { name: 'Wuyan Riga (Neck Circumference)', defaultVal: '16.5', placeholder: '16.5' },
    ],
  },
  senator: {
    title: 'Executive Senator Wear (Male)',
    category: 'Men\'s Suit & Wear',
    description: '2-piece executive fitted suit with clean neckline and matching trousers.',
    defaultClient: 'Usman Farouk',
    fields: [
      { name: 'Top Length (Tsawon Riga)', defaultVal: '36.5', placeholder: '36.5' },
      { name: 'Shoulder Width (Kafada)', defaultVal: '18.0', placeholder: '18.0' },
      { name: 'Chest (Kirji)', defaultVal: '40.5', placeholder: '40.5' },
      { name: 'Sleeve Length (Hannu)', defaultVal: '10.5', placeholder: '10.5' },
      { name: 'Trouser Waist (Kugun Wando)', defaultVal: '33.0', placeholder: '33.0' },
      { name: 'Trouser Length (Tsawon Wando)', defaultVal: '40.0', placeholder: '40.0' },
    ],
  },
  female_gown: {
    title: 'Female Gown / Abaya / Skirt (Female)',
    category: 'Womenswear & Gowns',
    description: 'Fittings for Abayas, fitted gowns, corset seams, and 6-piece skirts.',
    defaultClient: 'Hajiya Fatima Bello',
    fields: [
      { name: 'Bust Circumference (Kirji)', defaultVal: '37.0', placeholder: '37.0' },
      { name: 'Underbust (Karkashin Kirji)', defaultVal: '30.5', placeholder: '30.5' },
      { name: 'Waist (Kunkuru)', defaultVal: '29.0', placeholder: '29.0' },
      { name: 'Full Hip (Kugu)', defaultVal: '42.0', placeholder: '42.0' },
      { name: 'Abaya Length (Tsawon Riga)', defaultVal: '59.0', placeholder: '59.0' },
      { name: 'Skirt Length (Tsawon Siket)', defaultVal: '43.0', placeholder: '43.0' },
      { name: 'Sleeve Length (Hannu)', defaultVal: '24.0', placeholder: '24.0' },
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
    <section id="demo" className="py-20 sm:py-24 relative overflow-hidden bg-[#040e1e] border-y border-[#0B2545]">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-[#0B2545]/40 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-4 sm:right-10 -translate-y-1/2 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#2e7d32]/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#071A34] border border-[#2e7d32]/40 text-[#81c784] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Studio (Kaftan, Babban Riga & Gowns)
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Try Taking a Measurement Now
          </h2>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg">
            See how easy it is to enter and save customer measurements for traditional male and female clothes.
          </p>
        </div>

        {/* Preset Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {(
            [
              { key: 'kaftan_male', label: 'Royal Kaftan' },
              { key: 'babban_riga', label: 'Babban Riga 3-Piece' },
              { key: 'senator', label: 'Senator Wear' },
              { key: 'female_gown', label: 'Female Gown / Abaya' },
            ] as const
          ).map((item) => {
            const isActive = activePreset === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handlePresetChange(item.key)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#2e7d32] text-white shadow-lg shadow-[#2e7d32]/30 scale-105'
                    : 'bg-[#071A34] text-slate-300 hover:text-white hover:bg-[#0B2545] border border-[#0B2545]'
                }`}
              >
                <Scissors className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#81c784]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Workspace Box */}
        <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-[#071A34] border border-[#2e7d32]/40 shadow-2xl p-5 sm:p-8 relative overflow-hidden">
          {/* Header of the test ticket */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0B2545]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#0B2545] text-[#81c784] text-[11px] font-bold uppercase tracking-wider">
                  {current.category}
                </span>
                <span className="text-xs text-slate-400">Sample Template</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{current.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{current.description}</p>
            </div>

            {/* Unit toggle */}
            <div className="flex items-center self-start sm:self-center gap-1.5 p-1 bg-[#040e1e] rounded-xl border border-[#0B2545]">
              <button
                onClick={() => setUnit('in')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  unit === 'in'
                    ? 'bg-[#2e7d32] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  unit === 'cm'
                    ? 'bg-[#2e7d32] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Customer name input row */}
          <div className="py-5 border-b border-[#0B2545] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Customer Name / Phone:
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full sm:max-w-md bg-[#040e1e] border border-[#0B2545] focus:border-[#2e7d32] rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none transition"
                placeholder="Enter customer name..."
              />
            </div>
            <div className="text-left sm:text-right text-xs text-slate-400 space-y-0.5">
              <div>Date: <span className="text-slate-200 font-semibold">{new Date().toLocaleDateString('en-GB')}</span></div>
              <div className="text-[#81c784] font-medium flex items-center gap-1 sm:justify-end">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Private & Secured</span>
              </div>
            </div>
          </div>

          {/* Live Inputs Grid */}
          <div className="py-6">
            <div className="text-xs font-bold uppercase tracking-wider text-[#81c784] mb-4 flex items-center gap-2">
              <span>Measurement Fields</span>
              <span className="text-slate-400 font-normal">({current.fields.length} points)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
              {current.fields.map((field, idx) => (
                <div
                  key={idx}
                  className="bg-[#040e1e] border border-[#0B2545] focus-within:border-[#2e7d32] rounded-2xl p-3.5 transition-all"
                >
                  <label className="block text-xs font-semibold text-slate-300 mb-1 truncate" title={field.name}>
                    {field.name}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={fieldValues[field.name] ?? ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full bg-transparent text-lg font-black text-white font-mono focus:outline-none placeholder-slate-600"
                      placeholder={field.placeholder}
                    />
                    <span className="text-xs text-[#81c784] font-bold font-mono">
                      {unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[#0B2545] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#2e7d32]" />
              <span>Permanent record saved with zero chance of loss.</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                onClick={handleSimulateSave}
                disabled={isSaved}
                className={`w-full sm:w-auto gap-2 text-sm font-bold transition-all ${
                  isSaved
                    ? 'bg-[#2e7d32] text-white'
                    : 'bg-[#2e7d32] hover:bg-[#1b5e20] text-white shadow-lg shadow-[#2e7d32]/25'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Saved to Client History!</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Test Save Measurement</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Success Alert */}
          {isSaved && (
            <div className="mt-4 p-4 rounded-xl bg-[#2e7d32]/20 border border-[#2e7d32] flex items-center justify-between gap-3 text-xs text-white animate-fade-in-up">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#81c784]" />
                <span>
                  <strong>Success:</strong> Saved ticket for <strong>{clientName}</strong> under {current.title}. In the real app, this is permanently saved to your cloud account!
                </span>
              </div>
              <Link href="/register" className="text-[#81c784] underline font-bold hover:text-white whitespace-nowrap">
                Create Free Account &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
