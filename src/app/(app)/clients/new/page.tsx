'use client';

import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { ClientForm } from '../ClientForm';

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/clients"
          className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-lime-400" />
            Register New Client
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Add client contact information and style preferences.
          </p>
        </div>
      </div>

      <ClientForm />
    </div>
  );
}
