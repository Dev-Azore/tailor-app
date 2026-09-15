-- ============================================================================
-- Migration: tailor_dashboard_stats RPC
-- Adds a security-definer RPC that returns aggregate counts for the
-- authenticated tailor's own dashboard (clients, active templates,
-- measurements, last activity). Uses security definer so the counts
-- are accurate without tailor_id filters leaking to the client.
-- ============================================================================

-- RPC: tailor_dashboard_stats — per-tailor summary for the dashboard (FR-1)
create or replace function public.tailor_dashboard_stats()
returns table (
  client_count        bigint,
  template_count      bigint,
  measurement_count   bigint,
  last_activity       timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    (select count(*)   from public.clients      c where c.tailor_id = auth.uid()),
    (select count(*)   from public.templates    t where t.tailor_id = auth.uid() and t.deleted_at is null),
    (select count(*)   from public.measurements m where m.tailor_id = auth.uid()),
    (select max(m.created_at) from public.measurements m where m.tailor_id = auth.uid())
  where auth.uid() is not null;
$$;

-- Revoke broad access; only authenticated users may call this RPC
revoke execute on function public.tailor_dashboard_stats() from public;
grant  execute on function public.tailor_dashboard_stats() to authenticated;

comment on function public.tailor_dashboard_stats() is
  'Returns aggregate statistics for the currently authenticated tailor. '
  'Callable with the anon key once the user has a valid session. '
  'Returns an empty result set for unauthenticated callers.';
