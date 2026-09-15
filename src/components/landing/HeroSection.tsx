'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Scissors,
  Ruler,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  Plus,
  Sparkles,
  Phone,
  Calendar,
  Check,
} from 'lucide-react';

interface MockClient {
  id: string;
  name: string;
  phone: string;
  garment: string;
  status: 'Ready' | 'In Progress' | 'Fitting';
  date: string;
  measurements: { label: string; value: string }[];
}

const MOCK_CLIENTS: MockClient[] = [
  {
    id: '1',
    name: 'Faisal Abubakar',
    phone: '0803 123 4567',
    garment: 'Royal Kaftan Set',
    status: 'Ready',
    date: '15 Sep 2026',
    measurements: [
      { label: 'Tsawon Riga', value: '38.5"' },
      { label: 'Kafada', value: '18.5"' },
      { label: 'Kirji', value: '41.0"' },
      { label: 'Hannu', value: '25.0"' },
      { label: 'Wando', value: '41.5"' },
      { label: 'Kafa', value: '14.5"' },
    ],
  },
  {
    id: '2',
    name: 'Umar Rufa\'i',
    phone: '0802 987 6543',
    garment: 'Babban Riga 3-Piece',
    status: 'In Progress',
    date: '14 Sep 2026',
    measurements: [
      { label: 'Tsawon Robe', value: '58.0"' },
      { label: 'Hannu Span', value: '66.0"' },
      { label: 'Kirjin Buba', value: '44.5"' },
      { label: 'Wuyan Riga', value: '16.5"' },
      { label: 'Tsawon Wando', value: '42.0"' },
      { label: 'Kafa Width', value: '15.0"' },
    ],
  },
  {
    id: '3',
    name: 'Hajiya Fatima Bello',
    phone: '0809 555 1234',
    garment: 'Abaya & 6-Piece Skirt',
    status: 'Fitting',
    date: '12 Sep 2026',
    measurements: [
      { label: 'Kirji (Bust)', value: '37.0"' },
      { label: 'Karkashin Kirji', value: '30.5"' },
      { label: 'Kunkuru (Waist)', value: '29.0"' },
      { label: 'Kugu (Hip)', value: '42.0"' },
      { label: 'Tsawon Riga', value: '59.0"' },
      { label: 'Tsawon Siket', value: '43.0"' },
    ],
  },
];

export function HeroSection() {
  const [selectedClientId, setSelectedClientId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const filteredClients = MOCK_CLIENTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.garment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const activeClient =
    MOCK_CLIENTS.find((c) => c.id === selectedClientId) || MOCK_CLIENTS[0];

  const handleCopyTicket = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden bg-[#040e1e]">
      {/* Background Lighting & Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#071A34_1px,transparent_1px),linear-gradient(to_bottom,#071A34_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Radial Spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[550px] bg-gradient-to-b from-[#2e7d32]/20 via-[#0B2545]/40 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Hero Header */}
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071A34] border border-[#2e7d32]/40 shadow-lg shadow-[#2e7d32]/10 hover:border-[#2e7d32]/70 transition cursor-default">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2e7d32] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2e7d32]" />
            </span>
            <span className="text-xs font-bold text-slate-200">
              The Digital Measurement Book for Nigerian Tailors
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Record Client Measurements.{' '}
            <span className="bg-gradient-to-r from-[#81c784] via-[#2e7d32] to-[#a5d6a7] bg-clip-text text-transparent">
              Never Lose a Size Again.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Replace torn notebooks with a fast, private mobile app designed for Kaftan, Babban Riga, Senator, and Gowns. Works on any phone.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 h-14 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-base font-bold rounded-2xl shadow-2xl shadow-[#2e7d32]/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-8 h-14 bg-[#071A34]/80 hover:bg-[#0B2545] text-white border-[#2e7d32]/40 hover:border-[#2e7d32]/70 rounded-2xl font-bold flex items-center justify-center gap-2.5"
              >
                <Ruler className="w-4 h-4 text-[#81c784]" />
                <span>Test Interactive Studio</span>
              </Button>
            </a>
          </div>

          {/* Micro Value Line */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              100% Free for Independent Tailors
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2e7d32]" />
              Instant Search on Mobile
            </span>
          </div>
        </div>

        {/* Interactive Live App Interface Simulation */}
        <div className="mt-14 sm:mt-18 max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-[#071A34]/95 border border-[#2e7d32]/40 shadow-2xl shadow-[#040e1e] overflow-hidden backdrop-blur-xl">
            {/* App Top Toolbar */}
            <div className="px-5 py-3.5 bg-[#0B2545]/70 border-b border-[#0B2545] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-[#2e7d32]" />
                <span className="ml-2 text-xs font-bold text-slate-300 hidden sm:inline">
                  TailorApp Studio • Active Client Directory
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#040e1e] border border-[#2e7d32]/35 text-[#81c784] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Live Interactive App Preview
                </span>
              </div>
            </div>

            {/* Split View */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#0B2545]">
              {/* Left Column: Client List with Search */}
              <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Your Saved Clients ({filteredClients.length})
                    </span>
                    <span className="text-[11px] text-[#81c784] font-semibold">
                      Click to inspect
                    </span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-3.5">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or phone..."
                      className="w-full bg-[#040e1e] border border-[#0B2545] focus:border-[#2e7d32] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>

                  {/* Client Cards Stack */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {filteredClients.map((client) => {
                      const isSelected = client.id === activeClient.id;
                      return (
                        <button
                          key={client.id}
                          onClick={() => setSelectedClientId(client.id)}
                          className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer ${isSelected
                            ? 'bg-[#0B2545] border border-[#2e7d32]/60 shadow-md'
                            : 'bg-[#040e1e]/60 border border-transparent hover:bg-[#0B2545]/50'
                            }`}
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{client.name}</span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {client.garment}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${client.status === 'Ready'
                              ? 'bg-[#2e7d32]/25 text-[#81c784]'
                              : client.status === 'In Progress'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-blue-500/20 text-blue-300'
                              }`}
                          >
                            {client.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Left Bottom Quick Add Action */}
                <div className="pt-3 border-t border-[#0B2545] flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
                    <span>Protected Cloud Storage</span>
                  </span>
                  <Link href="/register" className="text-[#81c784] hover:underline font-bold flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    <span>Add New</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Selected Client's Fitting Ticket Details */}
              <div className="md:col-span-7 p-5 sm:p-6 bg-[#040e1e]/40 flex flex-col justify-between space-y-5">
                <div>
                  {/* Selected Client Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#0B2545]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[#0B2545] border border-[#2e7d32]/40 flex items-center justify-center text-[#81c784] font-black text-base">
                        {activeClient.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">
                          {activeClient.name}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#2e7d32]" />
                            {activeClient.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {activeClient.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold bg-[#2e7d32]/20 text-[#81c784] border border-[#2e7d32]/35">
                      {activeClient.garment}
                    </span>
                  </div>

                  {/* Measurements Grid */}
                  <div className="py-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                      <span>Saved Measurement Blueprint</span>
                      <span className="text-[#81c784] font-mono text-xs font-normal">
                        Unit: Inches
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {activeClient.measurements.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#071A34] border border-[#0B2545] hover:border-[#2e7d32]/50 transition"
                        >
                          <div className="text-[11px] text-slate-400 font-medium truncate">
                            {m.label}
                          </div>
                          <div className="text-lg font-black text-[#81c784] font-mono mt-0.5">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ticket Action Footer */}
                <div className="pt-3 border-t border-[#0B2545] flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-[#2e7d32]" />
                    <span>Fitting Ticket #TK-{activeClient.id}092</span>
                  </div>

                  <button
                    onClick={handleCopyTicket}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#071A34] border border-[#2e7d32]/35 text-xs text-slate-200 hover:text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#2e7d32]" />
                        <span className="text-[#81c784]">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Ruler className="w-3.5 h-3.5 text-[#81c784]" />
                        <span>Copy Fitting Data</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
