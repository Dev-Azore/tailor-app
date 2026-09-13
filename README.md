# Tailor Measurement Management System

A web-based, installable Progressive Web App that lets independent tailors record, manage, and retrieve their clients' body measurements digitally — replacing paper-based or memory-based tracking.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Security Model](#security-model)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Free Tier Considerations](#free-tier-considerations)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [License](#license)

---

## Overview

Tailors in many markets manage client measurements on paper, in notebooks, or from memory. This leads to lost records, inconsistent measurements, and difficulty tracking changes over time. This application provides a simple, installable, mobile-first tool that:

- Lets each tailor define their own measurement templates (Shirt, Trouser, Agbada, etc.)
- Stores client profiles and measurement history per tailor
- Works as an installable PWA on any modern browser — no app store required
- Keeps each tailor's data completely isolated from every other tailor
- Preserves historical measurements immutably, even when templates change

The platform is monetized via advertising on the free tier, with a premium ad-free tier reserved for a future release.

---

## Features

### For Tailors
- **Custom measurement templates** — Define exactly what you measure (e.g. Shirt: chest, shoulder, sleeve length) with field names and units.
- **Template editing without data loss** — Modify or delete templates at any time; past measurements remain intact via snapshotting.
- **Client management** — Register clients once, take repeated measurements over time.
- **Immutable measurement history** — Every measurement is timestamped and stored as a historical record that cannot be altered.
- **One-handed, in-fitting-room UX** — Fast measurement entry designed for quick use during active sessions.
- **Installable PWA** — Add to home screen; launches in standalone mode like a native app.

### For Admins
- **Tailor oversight** — View all registered tailors with usage statistics (clients, templates, measurements, last activity).
- **Account management** — Suspend or reactivate tailor accounts.
- **Audit log** — Every status change is recorded with actor, target, action, and timestamps.

### Platform
- **Row-level security** — Data isolation enforced at the database layer, not just in application code.
- **Server-side validation** — All input validated with Zod before any database mutation.
- **Secret isolation** — Service-role keys and privileged operations never touch the client.
- **Ad-supported free tier** — Ads on non-critical screens; excluded from the measurement-entry flow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| PWA | `@serwist/next` (installability + app-shell precache) |
| Backend | Supabase (Postgres + Auth + Row-Level Security) |
| Auth | Supabase Auth |
| Validation | Zod |
| Forms | React Hook Form + `@hookform/resolvers` |
| Icons | Lucide React |
| Ads | Google AdSense |
| Hosting | Vercel (frontend + SSR), Supabase (backend) |
| Keep-alive | GitHub Actions / Vercel Cron |

---

## Architecture

The system is a **client-owned, flat multi-tenant PWA**. Each tailor is their own independent tenant; there is no shared-shop or staff-management layer.

**Hybrid rendering in Next.js:**

- **Admin routes** use Server Components (SSR via `@supabase/ssr`) — fast server-rendered pages.
- **Tailor-facing routes** use Client Components (CSR) — render from the precached PWA app shell.

**Security principle:** All secrets, authentication operations, and privileged mutations are handled exclusively server-side. The client holds only the public anon key and a session scoped by Row-Level Security. Every Server Action and Route Handler validates input with Zod before touching the database.

```
┌──────────────────────────────────────────────┐
│            Client (PWA, Next.js)              │
│  App Router — hybrid rendering                │
│  Tailwind CSS                                 │
│  Service Worker (app-shell precache only)     │
│  Web App Manifest                             │
│  ⚠ No secrets, no privileged auth here        │
└────────────────────┬─────────────────────────┘
                     │ HTTPS
        ┌────────────┴────────────┐
        │                         │
┌───────▼─────────┐     ┌─────────▼──────────┐
│ Vercel (SSR /   │     │ Supabase            │
│ Route Handlers) │────▶│ Postgres + Auth +   │
│ @supabase/ssr   │     │ Row-Level Security  │
│ Zod validation  │     │                     │
│ Secrets live    │     │                     │
│ here only       │     │                     │
└─────────────────┘     └─────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **npm** (or pnpm / yarn)
- A **Supabase** account and project — [supabase.com](https://supabase.com)
- **Git**

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd tailor-app
npm install
```

### Environment Variables

Create a `.env.local` file at the project root (this file is gitignored and must never be committed):

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find these values:** Supabase Dashboard → Project Settings → API.

**Security notes:**
- `NEXT_PUBLIC_*` variables are embedded in the client bundle. Only the URL and anon key belong here.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row-Level Security. It must **never** be prefixed with `NEXT_PUBLIC_`, exposed to client code, or committed to the repository.
- A template file `.env.local.example` is committed for reference; the real `.env.local` is not.

### Database Setup

Migrations live in `supabase/migrations/`. The initial schema is at:

```
supabase/migrations/20260912120000_initial_schema.sql
```

**To apply the initial schema:**

1. Open your Supabase project → SQL Editor.
2. Paste the contents of the migration file.
3. Run it.

**Subsequent schema changes:** Every change is a new migration file with a new timestamp prefix. Never edit an already-applied migration. See [Development Workflow](#development-workflow) for details.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Other scripts:**

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
tailor-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, register routes
│   │   ├── (app)/              # Tailor-facing routes (CSR)
│   │   ├── admin/              # Admin routes (SSR)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser Supabase client
│   │   │   ├── server.ts       # Server Supabase client
│   │   │   └── middleware.ts   # Session refresh helper
│   │   └── validation/         # Zod schemas
│   ├── components/             # Shared UI components
│   └── middleware.ts           # Next.js middleware entry
├── supabase/
│   └── migrations/             # SQL migrations (never edit applied ones)
├── public/                     # Static assets, PWA icons, manifest
├── .env.local                  # Secrets (gitignored)
├── .env.local.example          # Template (committed)
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

The public schema consists of seven tables:

| Table | Purpose |
|---|---|
| `users` | Application profile row, one-to-one with `auth.users`. Never stores credentials. |
| `clients` | Tailor-owned client records. |
| `templates` | Tailor-owned measurement templates (soft-deletable). |
| `template_fields` | Ordered custom fields belonging to a template. |
| `measurements` | Insert-only, immutable measurement records with JSONB snapshots. |
| `admin_audit_log` | Records of admin actions (suspend / reactivate). |
| `keep_alive` | Target for the Free Tier keep-alive job. |

### Key design decisions

- **Immutable measurements.** Once saved, a measurement cannot be updated or deleted by a tailor. This is enforced at the RLS layer (no UPDATE/DELETE policies exist for tailors on `measurements`). Corrections are made by recording a new measurement.
- **Field snapshotting.** Each measurement stores a JSONB snapshot of the template's field definitions at the time of recording. Editing or deleting a template later has no effect on past records.
- **Soft-delete for templates.** Templates use a `deleted_at` column so historical references remain intact.
- **Deferred uniqueness on field order.** `template_fields` uses a `deferrable initially deferred` unique constraint on `(template_id, order_index)` so reordering fields within a transaction doesn't trip the constraint mid-update.

---

## Security Model

Security is enforced in layers:

### 1. Database — Row-Level Security (RLS)
Every table has RLS enabled. A tailor can only access rows where `tailor_id = auth.uid()`. Admins bypass tenant scoping via a separate policy path (`is_admin()`). Measurement rows are insert-only for tailors — no update or delete policies exist.

### 2. Authentication — Supabase Auth
Sessions are managed by Supabase Auth. Server-side session refresh happens in Next.js middleware via `@supabase/ssr`. Credentials never touch application tables.

### 3. Server-side validation — Zod
Every Server Action and Route Handler validates input against a Zod schema before any database mutation. The server never trusts client-side input.

### 4. Secret isolation
The `service_role` key lives only in server-side environment variables, is never prefixed with `NEXT_PUBLIC_`, and is used only in trusted server contexts (admin provisioning, migrations). See [NFR-9 in the design doc](docs/).

### 5. Least privilege
Client code holds only the anon key. Its effective privileges are bounded entirely by RLS policies.

### Reporting a vulnerability

If you find a security issue, please report it privately to the maintainer rather than opening a public issue.

---

## Development Workflow

### Migrations

Schema changes are managed as **ordered, append-only migration files**:

```
supabase/migrations/
  20260912120000_initial_schema.sql
  20260915xxxxxx_add_something.sql
  20260920xxxxxx_change_something.sql
```

**Rules:**
1. Each migration runs **once**. Never re-run an applied migration.
2. **Never edit an applied migration.** If a change is needed, write a new one.
3. Migrations contain **DDL only** (structure). Data backfills are a special case and should be clearly marked.
4. Save every migration in `supabase/migrations/` before applying it.
5. Apply migrations in a **single transaction** when possible.

**To add a new migration:**
1. Create a new file: `supabase/migrations/<timestamp>_<description>.sql`
2. Write the delta only — not the full schema.
3. Apply it via the Supabase SQL Editor.

### RLS verification

After any change to policies or tables, re-run the RLS checks in `supabase/tests/rls_checks.sql` to confirm isolation, admin access, and measurement immutability still hold.

### Code conventions

- **TypeScript** everywhere; strict mode enabled.
- **Server Actions** for all mutations; validated with Zod.
- **Client Components** only for interactivity and the PWA-facing UI.
- **No secrets** in client code, ever.
- **Commit messages** in the format `type(scope): description` (e.g. `feat(templates): add reorder action`).

---

## Deployment

### Frontend (Vercel)

1. Connect the repository to Vercel.
2. Set environment variables in the Vercel project dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy. Vercel builds and hosts the Next.js app, including Server Components and Route Handlers.

### Database (Supabase)

The database runs on Supabase. Apply migrations to production by running them through the Supabase Dashboard SQL Editor against the production project — or, once the Supabase CLI is adopted, via `supabase db push` in CI.

### Post-deploy checklist

- [ ] Verify environment variables are set in Vercel (all three).
- [ ] Confirm `.env.local` was never committed (`git log --all -- .env.local` should be empty).
- [ ] Run the RLS verification suite against production with a test user.
- [ ] Confirm the keep-alive job is scheduled (see below).
- [ ] Smoke-test signup, login, and one measurement record.

---

## Free Tier Considerations

The project runs on Supabase's **Free Plan**, which pauses projects after **7 days of no database activity**. To prevent this, a scheduled job pings a database RPC daily.

### Keep-alive setup

The database exposes an RPC:

```sql
public.ping_keep_alive()   -- truncates and inserts a single row in keep_alive
```

This is callable with the **anon key** and is the only write path to the `keep_alive` table (RLS blocks direct table access). It performs a real write against Postgres, which resets the inactivity timer.

**Schedule via GitHub Actions** (recommended):

Create `.github/workflows/keep-alive.yml` with a daily scheduled job that POSTs to:

```
https://<project>.supabase.co/rest/v1/rpc/ping_keep_alive
```

using the anon key in the `apikey` header. Store the key as a GitHub Actions secret.

**Alternative:** Vercel Cron hitting a server-side route handler that calls the same RPC.

**Once organic traffic reliably exceeds one request per day, the job can be disabled.**

---

## Roadmap

- [x] Initial schema and RLS policies
- [ ] Supabase client plumbing (`client.ts`, `server.ts`, `middleware.ts`)
- [ ] Auth flow (register, login, session refresh)
- [ ] Zod schema layer
- [ ] Template CRUD
- [ ] Client CRUD
- [ ] Measurement recording flow with snapshotting
- [ ] Client measurement history view
- [ ] Admin panel (tailor list, stats, suspend/reactivate)
- [ ] AdSense integration with plan gating
- [ ] PWA installability (manifest, service worker, icons)
- [ ] Connectivity / error-state handling
- [ ] Version-check + update prompt
- [ ] Keep-alive job
- [ ] Premium ad-free tier

---

## Documentation

- **URS / SRS / System Design:** `docs/` (full specification, architecture, decisions log)
- **Database migrations:** `supabase/migrations/`
- **RLS verification tests:** `supabase/tests/rls_checks.sql`
- **Environment template:** `.env.local.example`

---

## License

_To be determined._

---

**Version:** 1.0
**Last updated:** 2026-09-13
**Status:** Active development
</｜｜DSML｜｜ parameter>
</｜｜DSML｜｜ invoke>
</｜｜DSML｜｜ calls>