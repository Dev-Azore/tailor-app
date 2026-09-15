'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Layers,
  Ruler,
  Clock,
  Plus,
  AlertCircle,
  Scissors,
  ArrowRight,
  Sparkles,
  Search,
  ChevronRight,
  Info,
  ShieldCheck,
  Phone,
  Calendar,
  Eye,
} from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';
import type { DashboardStats, DashboardClientItem } from './actions';

interface DashboardClientProps {
  stats: DashboardStats | null;
  statsError?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || 'CL';
}

function formatLastActivity(dateStr: string | null): string {
  if (!dateStr) return 'No records yet';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardClient({ stats, statsError }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTipIndex, setActiveTipIndex] = useState<number | null>(null);

  const greeting = getTimeGreeting();
  const recentClients = stats?.recent_clients || [];

  const filteredClients = recentClients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery)) ||
    (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.last_measurement?.template_name &&
      c.last_measurement.template_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statCards = [
    {
      label: 'Clients',
      value: stats ? stats.client_count.toString() : '0',
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
      href: '/clients',
      subtext: 'Registered customers',
    },
    {
      label: 'Measurements',
      value: stats ? stats.measurement_count.toString() : '0',
      icon: Ruler,
      color: 'text-[#81c784]',
      bg: 'bg-[#2e7d32]/15',
      border: 'border-[#2e7d32]/30',
      href: null,
      subtext: 'Permanent fitting records',
    },
    {
      label: 'Templates',
      value: stats ? stats.template_count.toString() : '0',
      icon: Layers,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      href: '/templates',
      subtext: 'Garment styles',
    },
    {
      label: 'Last Fitting',
      value: stats ? formatLastActivity(stats.last_activity) : 'No records yet',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      border: 'border-amber-400/20',
      href: null,
      small: true,
      subtext: 'Recent shop activity',
    },
  ];

  const quickTips = [
    {
      title: 'Quick Fitting Lookup',
      desc: 'Type any customer name or phone in the search box above to immediately pull up their size history when they walk into your shop.',
    },
    {
      title: 'Taking Babban Riga Span',
      desc: 'Measure wrist-to-wrist across the wingspan with arms outstretched for traditional full-body drape.',
    },
    {
      title: 'Immutable Snapshots',
      desc: 'Measurements can never be overwritten by accident. Every order gets its own permanent timestamped record.',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Studio Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#81c784]">
              Active Studio Workspace
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            {greeting}, Tailor! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Search and view customer measurement records anytime.
          </p>
        </div>
      </div>

      {/* ── Sync Error state ── */}
      {statsError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <div className="flex-1">
            <span className="font-bold">Sync Issue: </span>
            <span>{statsError}</span>
          </div>
        </div>
      )}

      {/* ── SEARCH-FIRST HERO HUB ── */}
      <div className="rounded-3xl bg-gradient-to-br from-[#071A34] to-[#0B2545] border-2 border-[#2e7d32]/40 p-5 sm:p-7 shadow-2xl shadow-[#040e1e] relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#2e7d32]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2e7d32]/20 text-[#81c784] text-xs font-bold uppercase tracking-wider border border-[#2e7d32]/30">
              <Search className="w-3.5 h-3.5" />
              <span>Instant Measurement Lookup</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Find Customer Fitting Records
            </h2>
            <p className="text-xs text-slate-300 max-w-lg">
              Search by name or phone to view previous measurements, collar sizes, and fit notes immediately.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <Link
              href="/measurements/new"
              className="px-4 py-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-bold shadow-lg shadow-[#2e7d32]/25 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Fitting</span>
            </Link>
          </div>
        </div>

        {/* Embedded Live Search Input */}
        <div className="relative z-10">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type customer name (e.g. Faisal, Umar), phone, or garment..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#040e1e] border border-[#0B2545] focus:border-[#2e7d32] rounded-2xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-medium shadow-inner transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white px-2 py-1 bg-[#071A34] rounded-lg cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Customer Results Grid (Immediate View UX) */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            <span>
              {searchQuery ? `Search Results (${filteredClients.length})` : `Recent Customer Fittings (${recentClients.length})`}
            </span>
            <Link href="/clients" className="text-[#81c784] hover:underline font-bold text-[11px] lowercase">
              view all clients &rarr;
            </Link>
          </div>

          {recentClients.length === 0 ? (
            <div className="p-6 text-center bg-[#040e1e]/60 rounded-2xl border border-dashed border-[#0B2545] space-y-2">
              <Users className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">No customers registered yet.</p>
              <Link
                href="/clients/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2e7d32] text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Customer</span>
              </Link>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="p-6 text-center bg-[#040e1e]/60 rounded-2xl border border-[#0B2545] text-xs text-slate-400">
              No customers found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {filteredClients.slice(0, 8).map((client) => {
                const initials = getInitials(client.name);
                return (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="p-3 bg-[#040e1e] hover:bg-[#0B2545] border border-[#0B2545] hover:border-[#2e7d32]/50 rounded-2xl transition flex items-center justify-between group shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#071A34] border border-[#2e7d32]/40 text-[#81c784] font-black text-xs flex items-center justify-center font-mono shrink-0 group-hover:scale-105 transition">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-[#81c784] transition truncate">
                          {client.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                          {client.last_measurement ? (
                            <span className="text-[#81c784] font-medium">
                              {client.last_measurement.template_name} ({client.last_measurement.fields_count} pts)
                            </span>
                          ) : client.phone ? (
                            <span>{client.phone}</span>
                          ) : (
                            <span>Client profile</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[#81c784] font-bold text-xs shrink-0 pl-2">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">View</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Stat Cards Grid (Interactive) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const card = (
            <div
              key={stat.label}
              className={`rounded-2xl p-4 bg-[#071A34] border ${stat.border} hover:border-[#2e7d32]/60 flex flex-col justify-between gap-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg shadow-[#040e1e] cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>

              <div>
                <div
                  className={`font-black text-white ${
                    stat.small ? 'text-base sm:text-lg leading-tight' : 'text-2xl sm:text-3xl'
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {stat.subtext}
                </div>
              </div>
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={stat.label}>{card}</div>
          );
        })}
      </div>

      {/* ── Quick Actions Grid ── */}
      <div className="rounded-2xl bg-[#071A34] border border-[#0B2545] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Studio Shortcuts
          </h3>
          <span className="text-[11px] text-[#81c784] font-medium">Fast workshop tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <Link
            href="/clients"
            className="flex items-center justify-between p-3 rounded-xl bg-[#040e1e] border border-[#0B2545] hover:border-[#2e7d32]/50 hover:bg-[#0B2545]/60 text-slate-200 hover:text-white transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold">Client Directory</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </Link>

          <Link
            href="/measurements/new"
            className="flex items-center justify-between p-3 rounded-xl bg-[#040e1e] border border-[#0B2545] hover:border-[#2e7d32]/50 hover:bg-[#0B2545]/60 text-slate-200 hover:text-white transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#2e7d32]/15 text-[#81c784] flex items-center justify-center">
                <Ruler className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold">Record Measurement</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </Link>

          <Link
            href="/templates"
            className="flex items-center justify-between p-3 rounded-xl bg-[#040e1e] border border-[#0B2545] hover:border-[#2e7d32]/50 hover:bg-[#0B2545]/60 text-slate-200 hover:text-white transition group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold">Garment Templates</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
          </Link>
        </div>
      </div>

      {/* ── Interactive Pro Tailor Tips Accordion ── */}
      <div className="rounded-2xl bg-[#071A34]/80 border border-[#0B2545] p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Info className="w-3.5 h-3.5 text-[#81c784]" />
          <span>Tailor Workshop Tips</span>
        </div>

        <div className="space-y-2">
          {quickTips.map((tip, idx) => {
            const isOpen = activeTipIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#040e1e] border border-[#0B2545] overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveTipIndex(isOpen ? null : idx)}
                  className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Scissors className="w-3 h-3 text-[#81c784]" />
                    <span>{tip.title}</span>
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3 text-xs text-slate-400 leading-relaxed border-t border-[#0B2545]/60 pt-2">
                    {tip.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Non-intrusive Ad Banner (Per Spec) ── */}
      <div className="pt-2">
        <AdBanner slotId="dashboard_bottom" />
      </div>
    </div>
  );
}

export default DashboardClient;

