'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type UserPlan = 'free' | 'premium';

export function useUserPlan(): { plan: UserPlan; isLoading: boolean } {
  const [plan, setPlan] = useState<UserPlan>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function fetchPlan() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isMounted) {
          if (isMounted) setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('users')
          .select('plan')
          .eq('id', user.id)
          .single();

        if (profile?.plan && isMounted) {
          setPlan(profile.plan as UserPlan);
        }
      } catch (err) {
        console.error('Error checking user plan:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchPlan();

    return () => {
      isMounted = false;
    };
  }, []);

  return { plan, isLoading };
}
