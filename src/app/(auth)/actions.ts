'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, magicLinkSchema, registerSchema } from '@/lib/validation/auth';

// State types must be exported so pages can use them with useActionState<S, F>.
export type AuthActionState =
  | Record<string, never>
  | { errors: Record<string, string[]> }
  | { error: string };

export type MagicLinkActionState =
  | Record<string, never>
  | { errors: Record<string, string[]> }
  | { error: string }
  | { success: true; message: string };

// ---------------------------------------------------------------------------
// loginWithPassword
// ---------------------------------------------------------------------------
export async function loginWithPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const supabase = await createClient();

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    console.error('[Supabase Auth] signInWithPassword error:', error);
    return { error: `Login failed: ${error.message}` };
  }

  // Determine destination based on user role and status
  let destination = '/dashboard';
  const userId = signInData.user?.id;

  if (userId) {
    const { data: profile } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', userId)
      .single();

    if (profile?.status === 'suspended') {
      await supabase.auth.signOut();
      return { error: 'Your account is suspended. Please contact support.' };
    }

    if (profile?.role === 'admin') {
      destination = '/admin';
    }
  }

  redirect(destination);
}

// ---------------------------------------------------------------------------
// loginWithMagicLink
// ---------------------------------------------------------------------------
export async function loginWithMagicLink(
  _prevState: MagicLinkActionState,
  formData: FormData
): Promise<MagicLinkActionState> {
  const supabase = await createClient();

  const parsed = magicLinkSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
    },
  });

  if (error) {
    return { error: 'Failed to send magic link. Please try again.' };
  }

  return { success: true, message: 'Check your email for a login link.' };
}

// ---------------------------------------------------------------------------
// registerTailor
// ---------------------------------------------------------------------------
export async function registerTailor(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const supabase = await createClient();

  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
      },
    },
  });

  if (error) {
    console.error('[Supabase Auth] signUp error:', error.message);
    if (error.message.toLowerCase().includes('already registered')) {
      return { error: 'An account with that email already exists.' };
    }
    return { error: `Registration failed: ${error.message}` };
  }

  redirect('/dashboard');
}

// ---------------------------------------------------------------------------
// logout
// ---------------------------------------------------------------------------
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
