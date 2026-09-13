'use client';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Clients', value: '—' },
          { label: 'Templates', value: '—' },
          { label: 'Measurements', value: '—' },
          { label: 'Last Activity', value: '—' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-1"
          >
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</span>
            <span className="text-2xl font-bold text-slate-100">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Quick Actions</p>
        <div className="space-y-2">
          <a
            href="/measurements/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium hover:from-amber-500/20 hover:to-orange-500/20 transition"
          >
            + Record a Measurement
          </a>
          <a
            href="/clients/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
          >
            + Add a Client
          </a>
          <a
            href="/templates/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
          >
            + Create a Template
          </a>
        </div>
      </div>
    </div>
  );
}
