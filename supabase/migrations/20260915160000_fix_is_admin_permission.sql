-- ============================================================================
-- Migration: grant_is_admin_to_authenticated
-- Fixes "permission denied for function is_admin" when authenticated tailors
-- query or insert-select tables (measurements, users, etc.) protected by RLS
-- policies that evaluate public.is_admin().
-- ============================================================================

grant execute on function public.is_admin() to authenticated;

comment on function public.is_admin() is
  'Evaluates whether auth.uid() has role = ''admin''. '
  'Security definer, granted to authenticated role for RLS policy evaluation.';
