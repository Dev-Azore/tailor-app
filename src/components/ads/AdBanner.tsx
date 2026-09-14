'use client';

import { useEffect, useRef, useState } from 'react';
import { useUserPlan } from '@/lib/hooks/useUserPlan';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdBanner({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
}: AdBannerProps) {
  const { plan, isLoading } = useUserPlan();
  const [hasError, setHasError] = useState(false);
  const adRef = useRef<HTMLModElement | null>(null);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const targetSlotId = slotId || process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  useEffect(() => {
    // If premium, no client ID, or already encountered error, do not push
    if (plan === 'premium' || !clientId || !targetSlotId || hasError) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.warn('AdSense failed to push ad unit, collapsing container:', err);
      setHasError(true);
    }
  }, [plan, clientId, targetSlotId, hasError]);

  // FR-6.2: Gated by user plan — premium users never see ads
  if (plan === 'premium' || isLoading) {
    return null;
  }

  // FR-6.4: Graceful collapse on error or if no ads configured
  if (hasError) {
    return null;
  }

  // If no AdSense credentials configured (e.g. pre-launch/dev), render subtle collapsible container
  if (!clientId || !targetSlotId) {
    return (
      <div
        className={`my-4 p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl text-center text-slate-500 text-[11px] ${className}`}
      >
        <span className="font-medium tracking-wider uppercase text-[10px] text-slate-600 block mb-1">
          Advertisement Placeholder
        </span>
        <span className="text-slate-500">
          Support TailorApp with Free Plan sponsorship
        </span>
      </div>
    );
  }

  return (
    <div
      className={`my-4 overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950 p-2 text-center transition-all duration-300 ${className}`}
    >
      <span className="block text-[9px] uppercase tracking-wider text-slate-500 mb-1">
        Advertisement
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={targetSlotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
