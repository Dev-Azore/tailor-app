'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export interface TailorProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  status: string;
  created_at: string;
  stats: {
    client_count: number;
    template_count: number;
    measurement_count: number;
    last_activity: string | null;
  };
}

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
});

export async function getTailorProfile(): Promise<{ data: TailorProfileData | null; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: 'Unauthorized' };
  }

  // Fetch user profile row
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, name, role, plan, status, created_at')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { data: null, error: profileError?.message || 'Profile not found' };
  }

  // Fetch aggregate stats
  const { data: statsData } = await supabase.rpc('tailor_dashboard_stats');
  const statsRow = Array.isArray(statsData) ? statsData[0] : statsData;

  const stats = {
    client_count: Number(statsRow?.client_count ?? 0),
    template_count: Number(statsRow?.template_count ?? 0),
    measurement_count: Number(statsRow?.measurement_count ?? 0),
    last_activity: statsRow?.last_activity ?? null,
  };

  return {
    data: {
      id: profile.id,
      name: profile.name,
      email: user.email ?? 'No email provided',
      role: profile.role,
      plan: profile.plan,
      status: profile.status,
      created_at: profile.created_at,
      stats,
    },
  };
}

export async function updateTailorName(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  const rawName = formData.get('name');
  const parsed = updateProfileSchema.safeParse({ name: rawName });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from('users')
    .update({ name: parsed.data.name, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/profile');
  revalidatePath('/dashboard');
  return { success: true };
}
