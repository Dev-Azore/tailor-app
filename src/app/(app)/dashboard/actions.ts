'use server';

import { createClient } from '@/lib/supabase/server';

export interface DashboardStats {
  client_count: number;
  template_count: number;
  measurement_count: number;
  last_activity: string | null;
}

export interface DashboardStatsResponse {
  data: DashboardStats | null;
  error?: string;
}

/**
 * Returns aggregate statistics for the authenticated tailor's dashboard.
 * Delegates to the tailor_dashboard_stats() security-definer RPC so that
 * counts are computed server-side without exposing cross-tenant data.
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Unauthorized' };
  }

  const { data, error } = await supabase.rpc('tailor_dashboard_stats');

  if (error) {
    console.error('[Supabase tailor_dashboard_stats RPC error]:', error);
    return { data: null, error: `Failed to load dashboard statistics: ${error.message}` };
  }

  // The RPC returns a single row (or zero rows for unauthenticated callers).
  const row = Array.isArray(data) ? data[0] : data;

  if (!row) {
    return {
      data: {
        client_count: 0,
        template_count: 0,
        measurement_count: 0,
        last_activity: null,
      },
    };
  }

  return {
    data: {
      client_count: Number(row.client_count ?? 0),
      template_count: Number(row.template_count ?? 0),
      measurement_count: Number(row.measurement_count ?? 0),
      last_activity: row.last_activity ?? null,
    },
  };
}
