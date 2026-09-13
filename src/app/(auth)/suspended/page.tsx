import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export const metadata = {
  title: 'Account Suspended | TailorApp',
};

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Account Suspended</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Your account has been suspended. Please contact support if you believe this is a mistake.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
