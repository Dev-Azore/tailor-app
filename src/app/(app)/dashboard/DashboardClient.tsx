'use client';

import Link from 'next/link';
import { Users, Layers, Ruler, Clock, Plus, AlertCircle } from 'lucide-react';
import { AdBanner } from '@/components/ads/AdBanner';
import type { DashboardStats } from './actions';

interface DashboardClientProps {
  stats: DashboardStats | null;
  statsError?: string;
}

function formatLastActivity(dateStr: string | null): string {
  if (!dateStr) return 'No activity yet';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function DashboardClient({ stats, statsError }: DashboardClientProps) {
  const statCards = [
    {
      label: 'Clients',
      value: stats ? stats.client_count.toString() : '—',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      href: '/clients',
    },
    {
      label: 'Templates',
      value: stats ? stats.template_count.toString() : '—',
      icon: Layers,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      href: '/templates',
    },
    {
      label: 'Measurements',
      value: stats ? stats.measurement_count.toString() : '—',
      icon: Ruler,
      color: 'text-lime-400',
      bg: 'bg-lime-400/10',
      href: null,
    },
    {
      label: 'Last Activity',
      value: stats ? formatLastActivity(stats.last_activity) : '—',
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      href: null,
      small: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stats error state */}
      {statsError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Could not load stats. Pull to refresh.</span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const card = (
            <div
              key={stat.label}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                  {stat.label}
                </span>
                <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
              </div>
              <span
                className={`font-bold text-slate-100 ${stat.small ? 'text-base leading-snug' : 'text-2xl'}`}
              >
                {stat.value}
              </span>
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

      {/* Quick actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
          Quick Actions
        </p>
        <div className="space-y-2">
          <Link
            href="/measurements/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-lime-400/10 border border-lime-400/20 text-lime-400 text-sm font-semibold hover:bg-lime-400/20 transition"
          >
            <Plus className="w-4 h-4" />
            Record a Measurement
          </Link>
          <Link
            href="/clients/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add a Client
          </Link>
          <Link
            href="/templates/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
          >
            <Plus className="w-4 h-4" />
            Create a Template
          </Link>
        </div>
      </div>

      {/* Ad placement (FR-6.1 / FR-6.2) */}
      <AdBanner />
    </div>
  );
}
