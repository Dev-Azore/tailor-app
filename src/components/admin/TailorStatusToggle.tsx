'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ban, CheckCircle2, Loader2, AlertTriangle, X } from 'lucide-react';
import { updateTailorStatusAction } from '@/app/admin/actions';

interface TailorStatusToggleProps {
  tailorId: string;
  tailorName: string;
  currentStatus: 'active' | 'suspended';
}

export function TailorStatusToggle({
  tailorId,
  tailorName,
  currentStatus,
}: TailorStatusToggleProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSuspended = currentStatus === 'suspended';
  const targetAction = isSuspended ? 'reactivate' : 'suspend';

  const handleConfirm = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await updateTailorStatusAction({
        target_id: tailorId,
        action: targetAction,
      });

      if (res.error) {
        setErrorMessage(res.error);
        setIsLoading(false);
      } else {
        setIsOpen(false);
        setIsLoading(false);
        router.refresh();
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setErrorMessage(null);
          setIsOpen(true);
        }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          isSuspended
            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30'
        }`}
      >
        {isSuspended ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Reactivate</span>
          </>
        ) : (
          <>
            <Ban className="w-3.5 h-3.5" />
            <span>Suspend</span>
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSuspended
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {isSuspended ? 'Reactivate Tailor Account' : 'Suspend Tailor Account'}
                  </h3>
                  <p className="text-xs text-slate-400">{tailorName}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isSuspended
                ? `Are you sure you want to reactivate ${tailorName}'s account? The tailor will immediately regain full access to their dashboard, clients, and measurements.`
                : `Are you sure you want to suspend ${tailorName}'s account? The tailor will be immediately blocked from accessing their dashboard and redirected to the suspended notice page. Their data is fully preserved.`}
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-200">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={handleConfirm}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 ${
                  isSuspended
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    : 'bg-red-500 hover:bg-red-400 text-slate-950'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm {isSuspended ? 'Reactivation' : 'Suspension'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
