-- ============================================================================
-- Tailor Measurement Management System — Initial Schema Migration
-- Version: 1.2 (revised per architecture review)
-- Assumes deployment on Supabase (default `authenticated`/`anon` grants and
-- `auth` schema already provisioned by the platform). If applying this to a
-- self-hosted Postgres instance, add explicit GRANT statements for those roles.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- Table: users (public profile, mirrors auth.users)
-- Note: users rows are never hard-deleted by application logic. Accounts are
-- deactivated via `status = 'suspended'`, not row deletion — this also avoids
-- the cascade/restrict conflict described below on `clients`/`measurements`.
-- ----------------------------------------------------------------------------
create table public.users (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null,
  role        text not null default 'tailor' check (role in ('tailor', 'admin')),
  plan        text not null default 'free' check (plan in ('free', 'premium')),
  status      text not null default 'active' check (status in ('active', 'suspended')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.users is 'Application profile row, one-to-one with auth.users. Never stores credentials.';

-- ----------------------------------------------------------------------------
-- Table: clients
-- ----------------------------------------------------------------------------
create table public.clients (
  id          uuid primary key default gen_random_uuid(),
  tailor_id   uuid not null references public.users (id) on delete cascade,
  name        text not null,
  phone       text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index clients_tailor_id_idx on public.clients (tailor_id);

-- ----------------------------------------------------------------------------
-- Table: templates
-- ----------------------------------------------------------------------------
create table public.templates (
  id          uuid primary key default gen_random_uuid(),
  tailor_id   uuid not null references public.users (id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz -- soft-delete; null = active
);

create index templates_tailor_id_idx on public.templates (tailor_id);
create index templates_active_idx on public.templates (tailor_id) where deleted_at is null;

-- ----------------------------------------------------------------------------
-- Table: template_fields
-- order_index uniqueness is deferred so a reorder (e.g. swapping two indices
-- within one statement/transaction) doesn't trip the constraint mid-update.
-- ----------------------------------------------------------------------------
create table public.template_fields (
  id            uuid primary key default gen_random_uuid(),
  template_id   uuid not null references public.templates (id) on delete cascade,
  field_name    text not null,
  unit          text,
  order_index   int not null default 0,
  unique (template_id, order_index) deferrable initially deferred
);

create index template_fields_template_id_idx on public.template_fields (template_id);

-- ----------------------------------------------------------------------------
-- Table: measurements (insert-only for tailors — see RLS below)
-- fields_snapshot is shape-checked (must be a JSON array); full field-level
-- validation still happens in the Server Action via Zod before insert.
-- ----------------------------------------------------------------------------
create table public.measurements (
  id                       uuid primary key default gen_random_uuid(),
  client_id                uuid not null references public.clients (id) on delete restrict,
  tailor_id                uuid not null references public.users (id) on delete cascade,
  template_id              uuid references public.templates (id) on delete set null,
  template_name_snapshot   text not null,
  fields_snapshot          jsonb not null check (jsonb_typeof(fields_snapshot) = 'array'),
  taken_at                 timestamptz not null default now(),
  created_at               timestamptz not null default now()
);

-- Composite index covers the primary access pattern (a client's history,
-- newest first) and supersedes a plain client_id index.
create index measurements_client_taken_at_idx on public.measurements (client_id, taken_at desc);
create index measurements_tailor_id_idx on public.measurements (tailor_id);
create index measurements_template_id_idx on public.measurements (template_id);

-- ----------------------------------------------------------------------------
-- Table: admin_audit_log
-- Captures previous/new status alongside the action so history can be
-- reconstructed without cross-referencing users.updated_at.
-- ----------------------------------------------------------------------------
create table public.admin_audit_log (
  id                uuid primary key default gen_random_uuid(),
  actor_id          uuid not null references public.users (id) on delete cascade,
  target_id         uuid not null references public.users (id) on delete cascade,
  action            text not null check (action in ('suspend', 'reactivate')),
  previous_status   text,
  new_status        text,
  created_at        timestamptz not null default now()
);

create index admin_audit_log_target_id_idx on public.admin_audit_log (target_id);

-- ----------------------------------------------------------------------------
-- Table: keep_alive (Free Tier keep-alive job target — see NFR-8 / §3.10)
-- No RLS insert policy is granted here; all writes go through the
-- ping_keep_alive() RPC defined below, which truncates-then-inserts so the
-- table never grows unbounded and is not a world-writable abuse vector.
-- ----------------------------------------------------------------------------
create table public.keep_alive (
  id          uuid primary key default gen_random_uuid(),
  pinged_at   timestamptz not null default now()
);

-- ============================================================================
-- Triggers: updated_at maintenance
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

create trigger templates_set_updated_at
  before update on public.templates
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Trigger: auto-create a public.users profile row on signup
--
-- Runs as security definer (function owner — `postgres` on Supabase, which
-- owns public.users and therefore bypasses RLS). This is why the insert
-- succeeds despite RLS being enabled on the table with no INSERT policy for
-- `authenticated`/`anon`. A matching self-heal INSERT policy is added below
-- in case this trigger ever fails to fire.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.users (id, name, role, plan, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'tailor',
    'free',
    'active'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Promoting a user to 'admin' must be done via the service_role key
-- (Supabase Dashboard SQL editor or a server-side admin script), since the
-- 'admins can update account status' RLS policy below only covers `status`,
-- not `role`, and self-service role changes are intentionally not permitted.

-- ============================================================================
-- Row-Level Security
-- ============================================================================

alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.templates enable row level security;
alter table public.template_fields enable row level security;
alter table public.measurements enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.keep_alive enable row level security;

-- Helper: is the current user an admin?
-- Execute is revoked from public and granted only to authenticated, since
-- this function runs as security definer and shouldn't be callable by
-- arbitrary DB roles outside the app's normal auth context.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Revoked from both public and authenticated: is_admin() is only ever called
-- from inside other security definer functions (admin_tailor_stats) or from
-- RLS policy checks, both of which evaluate as the function/table owner, not
-- the calling role. No client-side code path needs to call this directly.
revoke execute on function public.is_admin() from public, authenticated;

-- ----------------------------------------------------------------------------
-- users policies
-- ----------------------------------------------------------------------------
create policy "users can read own profile"
  on public.users for select
  using (id = auth.uid());

-- Self-heal fallback: if handle_new_user() ever fails to fire, the app can
-- create its own profile row on first authenticated request.
create policy "users can insert own profile"
  on public.users for insert
  with check (id = auth.uid());

create policy "admins can read all profiles"
  on public.users for select
  using (public.is_admin());

create policy "admins can update account status"
  on public.users for update
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- clients policies (tailor-owned; full CRUD scoped to self)
-- ----------------------------------------------------------------------------
create policy "tailors manage own clients"
  on public.clients for all
  using (tailor_id = auth.uid())
  with check (tailor_id = auth.uid());

-- ----------------------------------------------------------------------------
-- templates policies (tailor-owned; full CRUD scoped to self)
-- ----------------------------------------------------------------------------
create policy "tailors manage own templates"
  on public.templates for all
  using (tailor_id = auth.uid())
  with check (tailor_id = auth.uid());

-- ----------------------------------------------------------------------------
-- template_fields policies (scoped via parent template ownership)
-- template_id is explicitly qualified to public.template_fields.template_id
-- to avoid relying on Postgres's default column resolution inside the
-- correlated subquery.
-- ----------------------------------------------------------------------------
create policy "tailors manage own template fields"
  on public.template_fields for all
  using (
    exists (
      select 1 from public.templates t
      where t.id = public.template_fields.template_id
        and t.tailor_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.templates t
      where t.id = public.template_fields.template_id
        and t.tailor_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- measurements policies (insert-only for tailors — no update/delete grants)
-- ----------------------------------------------------------------------------
create policy "tailors can view own measurements"
  on public.measurements for select
  using (tailor_id = auth.uid());

create policy "tailors can insert own measurements"
  on public.measurements for insert
  with check (tailor_id = auth.uid());

-- Intentionally no UPDATE or DELETE policy for role 'tailor' — enforces
-- FR-4.5 / NFR-4 / DR-4 (measurement immutability) at the DB layer.

create policy "admins can view all measurements"
  on public.measurements for select
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- admin_audit_log policies
-- ----------------------------------------------------------------------------
create policy "admins can read audit log"
  on public.admin_audit_log for select
  using (public.is_admin());

create policy "admins can write audit log"
  on public.admin_audit_log for insert
  with check (public.is_admin() and actor_id = auth.uid());

-- ----------------------------------------------------------------------------
-- keep_alive: no table-level policies granted. All access goes through the
-- ping_keep_alive() RPC below.
-- ----------------------------------------------------------------------------

-- ============================================================================
-- RPC: admin_tailor_stats — per-tailor summary for the admin panel (FR-5.2)
-- ============================================================================
create or replace function public.admin_tailor_stats()
returns table (
  tailor_id           uuid,
  name                text,
  status              text,
  plan                text,
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
    u.id,
    u.name,
    u.status,
    u.plan,
    (select count(*) from public.clients c where c.tailor_id = u.id),
    (select count(*) from public.templates t where t.tailor_id = u.id and t.deleted_at is null),
    (select count(*) from public.measurements m where m.tailor_id = u.id),
    (select max(m.created_at) from public.measurements m where m.tailor_id = u.id)
  from public.users u
  where u.role = 'tailor'
    and public.is_admin();
$$;

revoke execute on function public.admin_tailor_stats() from public;
grant execute on function public.admin_tailor_stats() to authenticated;

-- ============================================================================
-- RPC: ping_keep_alive — Free Tier keep-alive job target (NFR-8 / §3.10)
--
-- Truncates then inserts a single row so the table never grows unbounded.
-- security definer lets the anon key execute it while bypassing RLS; no
-- table-level insert policy is granted on keep_alive itself, so this RPC is
-- the only write path — closing off the "anyone can insert" abuse vector.
-- ============================================================================
create or replace function public.ping_keep_alive()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from public.keep_alive;
  insert into public.keep_alive default values;
end;
$$;

revoke execute on function public.ping_keep_alive() from public;
grant execute on function public.ping_keep_alive() to anon;

-- ============================================================================
-- End of migration
-- ============================================================================