# AGENTS.md

> Agent rules and operating conventions for the Tailor Measurement Management System.
> This file is the authoritative reference for any AI coding agent (Antigravity, Cursor, Copilot, etc.) working in this repository. It overrides generic defaults. When in doubt, follow this file.

---

## 1. Project Identity

**Project:** Tailor Measurement Management System
**Type:** Web-based, installable PWA for independent tailors to record and manage client measurements.
**Stage:** Active development (pre-launch MVP).
**Owner:** King_Azore

### What this project is

A multi-tenant SaaS where each tailor is an independent tenant with full data isolation. The platform is monetized via advertising on a future ad-free premium tier.

### What this project is **not**

- Not an offline-first app. Data operations require network connectivity.
- Not a computer-vision / automated measurement capture tool.
- Not a shop-management system. No shared-shop, staff, or organization layer.
- Not a native mobile app. It is a PWA, installable to home screen.

---

## 2. Authoritative Documents

Before making architectural or design decisions, consult these (in order of precedence):

1. **`docs/URS_SRS_SRD_System_Design.md`** — the full specification. This is the source of truth. If a decision conflicts with this document, the document wins unless explicitly amended.
2. **`supabase/migrations/`** — the applied database schema. The latest migration reflects current state.
3. **`supabase/tests/rls_checks.sql`** — the RLS verification suite. Any policy change must keep these passing.
4. **`README.md`** — setup and high-level orientation.
5. **This file (`AGENTS.md`)** — agent-specific rules for how to operate within the project.

If the specification and the code disagree, **stop and flag it**. Do not silently "fix" one to match the other.

---

## 3. Non-Negotiable Principles

These rules are hard constraints. Do not violate them, even if it would make a task simpler.

### 3.1 Secrets never reach the client

- `SUPABASE_SERVICE_ROLE_KEY` and any other sensitive credential **must never** be:
  - Prefixed with `NEXT_PUBLIC_`
  - Imported into a Client Component
  - Logged to console, error messages, or telemetry
  - Committed to the repository
  - Exposed in any API response
- Server-side only: Server Components, Server Actions, Route Handlers, middleware.
- The client holds only: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 3.2 The server never trusts the client

Every Server Action and Route Handler that accepts input must:

1. Authenticate the caller (`supabase.auth.getUser()`).
2. Validate input against a Zod schema.
3. Only then perform the database mutation.

No exceptions. No "it's just an internal form" shortcuts.

### 3.3 Measurements are immutable

Once a measurement is saved:

- **No** `UPDATE` policy exists for tailors.
- **No** `DELETE` policy exists for tailors.
- Corrections are recorded as **new** measurements.

Do not add UI paths, Server Actions, or API routes that attempt to modify a saved measurement. If a user-facing feature seems to require this, raise it as a spec question — don't implement a workaround.

### 3.4 Historical accuracy via snapshotting

When recording a measurement:

- Copy the template's current field definitions into `fields_snapshot`.
- **Never** render a historical measurement by joining to the live template.
- The `template_id` reference is for grouping/filtering only.

### 3.5 Data isolation is enforced at the database layer

- RLS is enabled on every public table.
- Tailor-scoped queries rely on `tailor_id = auth.uid()`.
- Application-layer checks are **supplementary**, never the sole protection.
- Do not write queries that rely on the client to filter rows by ownership.

### 3.6 Migrations are append-only

- **Never** edit an applied migration.
- Schema changes require a **new** migration file with a new timestamp prefix.
- Migrations contain **DDL**, not DML (see §5.3).
- Save every migration to `supabase/migrations/` before applying it.

---

## 4. Technology Constraints

Locked-in choices. Do not substitute without explicit approval.

| Layer | Locked choice |
|---|---|
| Frontend framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Backend / DB / Auth | Supabase (Postgres + Auth + RLS) |
| Validation | Zod |
| Forms | React Hook Form + `@hookform/resolvers` |
| Icons | Lucide React |
| PWA | `@serwist/next` (app-shell precache only) |
| Ads | Google AdSense |
| Hosting | Vercel (frontend), Supabase (backend) |

### Notes on Tailwind v4

- Configuration lives in `globals.css` via `@import "tailwindcss"` and `@theme`.
- There is **no** `tailwind.config.ts`.
- Tutorials referencing `tailwind.config.js` are for v3 — do not follow them blindly.

### Notes on Next.js App Router

- **Tailor-facing routes** (`src/app/(app)/**`) use **Client Components** so the PWA app shell can be precached.
- **Admin routes** (`src/app/admin/**`) use **Server Components** (SSR).
- **Auth routes** (`src/app/(auth)/**`) are a mix; middleware handles session refresh.

---

## 5. Coding Standards

### 5.1 TypeScript

- Strict mode is required.
- No `any`. Use `unknown` and narrow it.
- No `// @ts-ignore` or `// @ts-expect-error` without an inline comment explaining why.
- Infer types from Zod schemas with `z.infer<typeof schema>` rather than duplicating.

### 5.2 Server Actions

Every mutation is a Server Action. Pattern:

```ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { someSchema } from '@/lib/validation/...';

export async function doSomething(formData: FormData) {
  // 1. Authenticate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // 2. Validate
  const parsed = someSchema.safeParse({
    /* extract from formData */
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // 3. Mutate
  const { error } = await supabase.from('...').insert({
    tailor_id: user.id,
    ...parsed.data,
  });
  if (error) return { error: error.message };

  return { success: true };
}
```

**Rules:**
- Order is fixed: **auth → validate → mutate**.
- Never skip step 1 or 2.
- Return structured results (`{ success }` / `{ error }` / `{ errors }`), never throw for expected failures.
- Never return raw database error messages to the client in production — map them to user-safe strings.

### 5.3 Database Operations

- **DDL** (schema) → migration files only.
- **DML** (rows) → application code, or ad-hoc SQL Editor queries for debugging.
- Never put DML in a migration except for clearly-marked one-time backfills.
- Never hard-delete `users` rows. Use `status = 'suspended'`.

### 5.4 File Organization

```
src/
├── app/
│   ├── (auth)/            # login, register
│   ├── (app)/             # tailor-facing routes (Client Components)
│   ├── admin/             # admin routes (Server Components)
│   └── api/               # Route Handlers (rare; prefer Server Actions)
├── components/            # shared UI
├── lib/
│   ├── supabase/          # client.ts, server.ts, middleware.ts
│   ├── validation/        # Zod schemas
│   └── utils/             # pure helpers
└── middleware.ts
```

- One component per file, filename matches the default export (PascalCase for components, kebab-case for utilities).
- Co-locate feature-specific components, schemas, and actions under the feature's route folder when practical.

### 5.5 Styling

- Tailwind utility classes inline. No CSS modules, no styled-components.
- Extract shared patterns into components in `src/components/`, not into `@apply` blocks.
- Mobile-first. Assume a mid-range Android phone on a slow connection is the primary target.

---

## 6. Agent Operating Rules

### 6.1 Before starting work

1. Read this file (`AGENTS.md`) fully.
2. Read the relevant sections of `docs/URS_SRS_SRD_System_Design.md`.
3. Check `supabase/migrations/` for the current schema.
4. If the task touches security, RLS, or auth, re-read §3 of this file.

### 6.2 Making changes

- **Small, focused diffs.** One logical change per commit.
- **Never** reformat unrelated code, rename unrelated files, or "tidy up" as a side effect.
- **Never** introduce a new dependency without stating it explicitly and explaining why. Prefer existing dependencies.
- **Never** modify `.env.local`, secrets, or anything in `.env*` (except `.env.local.example`, which is a template).
- **Never** commit `node_modules`, build output, or generated files.
- **Always** update `README.md` or `docs/` when a change affects setup, architecture, or user-facing behavior.

### 6.3 Database changes

- Schema changes → new migration file. Never edit an applied migration.
- If the change affects RLS, update `supabase/tests/rls_checks.sql` to cover it.
- Before applying any migration, state what it does, why it's needed, and whether it's reversible. Destructive operations require explicit user confirmation.

### 6.4 Security-sensitive changes

Any change involving authentication, RLS policies, secret handling, or input validation:

- **Stop and confirm with the user** before applying.
- Explain the security implication in plain language.
- If the change weakens a control (even temporarily), say so explicitly.

### 6.5 When uncertain

- **Ask.** Do not guess at intent. A clarifying question costs seconds; a wrong guess can cost hours.
- If a requirement seems to conflict with the spec, flag the conflict rather than silently choosing one side.
- If a task would require violating §3 (Non-Negotiable Principles), stop and report.

### 6.6 Testing

- No test framework is currently set up. Until one is, use the **RLS verification suite** (`supabase/tests/rls_checks.sql`) as the security regression check.
- After any change to policies or tables, re-run the suite.
- Manual smoke-test the affected flow before declaring a task complete.

---

## 7. Task-Specific Guidance

### 7.1 Adding a new feature

1. Confirm it's in scope per `docs/`.
2. Identify the data model changes (if any) → new migration.
3. Define the Zod schema(s) in `src/lib/validation/`.
4. Write the Server Action(s) following §5.2.
5. Build the UI (Client or Server Component, per §4).
6. Update `supabase/tests/rls_checks.sql` if policies changed.
7. Update `README.md` roadmap if the feature was listed.

### 7.2 Adding a new table

1. New migration file with `create table`.
2. Enable RLS: `alter table ... enable row level security`.
3. Add policies for `tailor` (scoped by `tailor_id`) and `admin` (via `is_admin()`).
4. Add indexes on `tailor_id` (and other query-critical columns).
5. Add the table to `supabase/tests/rls_checks.sql`.
6. Add a `comment on table ...` explaining its purpose.

### 7.3 Adding a new field to an existing table

1. New migration: `alter table ... add column ...`.
2. If the column is NOT NULL, either:
   - Provide a default, or
   - Backfill in a separate step, then set NOT NULL.
3. Update the Zod schema(s) that validate this table's inputs.
4. Update `README.md` §Database Schema if the field is user-visible.

### 7.4 Handling a bug

1. Reproduce it. State the exact steps.
2. Identify the layer: schema, RLS, Server Action, UI.
3. Fix at the **lowest** layer that resolves it. (RLS bugs are fixed in RLS, not worked around in the UI.)
4. Add a regression check if the bug was security-relevant.
5. Do not bundle unrelated fixes into the same commit.

---

## 8. What Not to Do

A non-exhaustive list of common mistakes to avoid:

- ❌ Using the `service_role` key anywhere client-side.
- ❌ Trusting client-side validation as the only validation.
- ❌ Adding an `UPDATE` or `DELETE` policy for tailors on `measurements`.
- ❌ Rendering a measurement by joining to its live template.
- ❌ Editing an already-applied migration.
- ❌ Putting DML (INSERT/UPDATE/DELETE) in a migration without marking it as a one-time backfill.
- ❌ Hard-deleting `users` rows.
- ❌ Committing `.env.local` or any secret.
- ❌ Adding a dependency "just to try it."
- ❌ Rewriting large chunks of code when a small fix would do.
- ❌ Assuming offline support exists. It does not.
- ❌ Assuming the client can enforce data isolation. It cannot; only RLS can.

---

## 9. Communication

- **Be concise.** Explain what changed and why, in one or two sentences. Don't narrate every step.
- **Flag risks.** If a change could break something, say so before making it.
- **Ask before assuming.** Especially for schema changes, security, and dependencies.
- **Report blockers.** If you're stuck, say what you tried and what failed.
- **No filler.** Skip "Great question!" and similar phrases. Get to the point.

---

## 10. Version

**AGENTS.md version:** 1.0
**Last updated:** 2026-09-13
**Applies to:** all agents and automated tooling operating on this repository

If this file conflicts with any other document, the more restrictive interpretation applies until the conflict is resolved by the project owner.