import Link from 'next/link';
import { ShieldX, Mail, ArrowLeft } from 'lucide-react';
import { logout } from '@/app/(auth)/actions';

export const metadata = {
  title: 'Account Suspended | TailorApp',
  description: 'Your TailorApp account has been suspended.',
};

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-red-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6 text-center">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-2xl shadow-red-900/20">
              <ShieldX className="w-12 h-12 text-red-400" />
            </div>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-3xl border border-red-500/20 animate-ping opacity-30" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Account Suspended
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            Your TailorApp account has been suspended by an administrator. You cannot access
            the platform until your account is reactivated.
          </p>
        </div>

        {/* What to do card */}
        <div className="bg-slate-900/60 backdrop-blur border border-slate-700/50 rounded-2xl p-5 text-left space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            What to do next
          </p>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                1
              </span>
              Review any email you received explaining the suspension reason.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                2
              </span>
              Contact support if you believe this is a mistake or need clarification.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                3
              </span>
              Once reactivated by an admin, sign in again to regain access.
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="mailto:support@tailorapp.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>

          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
