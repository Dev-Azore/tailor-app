# Tailor Measurement Management System
## User Requirements Specification (URS), Software Requirements Specification (SRS/SRD), and System Design & Architecture

**Version:** 1.2
**Status:** Draft
**Prepared for:** King_Azore
**Last updated:** 2026-09-12

---

## Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | — | — | Initial draft |
| 1.1 | 2026-09-12 | — | Removed offline support; clarified PWA as installability-only; migrated frontend from React+Vite to Next.js (App Router); locked Auth = Supabase Auth; locked Backend = Supabase; added NFR-8 (Free Tier keep-alive); enforced measurement immutability at DB level; corrected `template_id` FK behavior; removed `password_hash` from public schema; added admin audit log; added connectivity/error-state handling. |
| 1.2 | 2026-09-12 | — | Added server-side secrets/validation architectural principle to §3.1; added §3.12 (Server-Side Validation Pattern with Zod); renumbered subsequent sections. |

---

## 1. User Requirements Specification (URS)

### 1.1 Purpose
This document defines the requirements for a web-based, installable (PWA) platform that allows independent tailors to record, manage, and retrieve their clients' body measurements digitally, replacing paper-based or memory-based measurement tracking.

### 1.2 Scope
The system will allow:
- Individual tailors to register, define their own custom measurement templates (e.g. Shirt, Trouser, Agbada), manage their own client list, and record/retrieve measurements per client.
- A system administrator to oversee all registered tailors, monitor platform usage, and manage accounts.
- The platform to be monetized via advertising, with a future ad-free premium tier.

The system will **not**, in this version, perform automated/computer-vision-based measurement capture — all measurement values are entered manually by the tailor.

The system will **not**, in this version, support offline data entry or offline data access. An active internet connection is required for all data operations.

### 1.3 Intended Users
| User Class | Description |
|---|---|
| **Tailor** | A registered independent user who manages their own clients and measurement records. Cannot see other tailors' data. |
| **Admin** | The platform owner/operator. Oversees all tailor accounts, views system-wide statistics, and manages account status. |

### 1.4 User Needs
1. As a tailor, I want to define what I measure (e.g. Shirt: chest, shoulder, sleeve) so my templates match how I actually work.
2. As a tailor, I want to update or delete my measurement templates as my needs change, without breaking past records.
3. As a tailor, I want to register a client once and take repeated measurements over time, so I can track changes and re-use past data.
4. As a tailor, I want to view a client's measurement history at a glance.
5. As a tailor, I want the app to be installable on my phone's home screen so it feels like a native app and launches quickly.
6. As an admin, I want to see all tailors on the platform and manage (suspend/activate) their accounts.
7. As the business owner, I want the app to generate ad revenue while remaining free and usable for tailors.

### 1.5 Assumptions and Constraints
- Users have a basic smartphone or desktop browser; no native app store distribution in v1.
- Tailors are responsible for the accuracy of manually entered measurement values.
- Internet connectivity is required for all data operations. Target markets may have intermittent connectivity; the app shall detect offline state and inform the user clearly rather than presenting a broken or silent-failure UI.
- The platform will be deployed on Supabase's Free Tier initially. This introduces a documented inactivity constraint (see NFR-8).
- All secrets, authentication operations, and privileged mutations are executed server-side only. The client is never trusted.

---

## 2. Software Requirements Specification (SRS/SRD)

### 2.1 Functional Requirements

**FR-1: Authentication & Roles**
- FR-1.1 Users can register and log in as a Tailor via email/password or magic link.
- FR-1.2 A separate Admin role exists, provisioned by the system owner (not self-registered).
- FR-1.3 Each user's data is isolated by ownership (`tailor_id`); a tailor cannot access another tailor's clients, templates, or measurements.
- FR-1.4 Authentication shall be provided by Supabase Auth. User credentials are managed in Supabase's `auth.users` table and are not duplicated in the application schema.
- FR-1.5 Authentication operations (sign-in, sign-out, session refresh, token validation) shall be executed server-side via Server Actions and middleware. Credentials and session tokens shall never be handled by client-side code.

**FR-2: Measurement Template Management**
- FR-2.1 A tailor can create a new measurement template with a name (e.g. "Shirt").
- FR-2.2 A tailor can add, edit, reorder, and remove custom fields within a template (field name + unit).
- FR-2.3 A tailor can edit or delete an existing template.
- FR-2.4 Editing or deleting a template must **not** alter or remove previously recorded measurements taken using that template (see DR-2 and §3.7).

**FR-3: Client Management**
- FR-3.1 A tailor can register a new client (name, phone, notes).
- FR-3.2 A tailor can view, edit, and delete their client records.
- FR-3.3 Each client belongs to exactly one tailor.

**FR-4: Measurement Recording**
- FR-4.1 A tailor can select a client and one of their templates, and enter values for each field defined in that template.
- FR-4.2 Each saved measurement is timestamped and stored as a historical record.
- FR-4.3 A tailor can view a client's full measurement history, grouped by template/date.
- FR-4.4 A tailor can view the field values of any past measurement exactly as they were recorded, regardless of later template edits.
- FR-4.5 Saved measurement records are immutable. Once created, they cannot be updated or deleted by the tailor. Corrections are made by recording a new measurement.

**FR-5: Admin Panel**
- FR-5.1 Admin can view a list of all registered tailors.
- FR-5.2 Admin can view basic usage statistics per tailor: client count, template count, measurement count, and last activity date.
- FR-5.3 Admin can suspend or reactivate a tailor's account.
- FR-5.4 All admin actions that change account status shall be recorded in an admin audit log, capturing actor, target user, action, and timestamp.

**FR-6: Monetization**
- FR-6.1 The system displays advertising to users on the free plan.
- FR-6.2 The system supports a `plan` attribute per user (`free` / `premium`) to allow future ad-free premium access without restructuring the data model.
- FR-6.3 Ads must not be displayed on the measurement-entry screen (to avoid disrupting active fitting sessions).
- FR-6.4 If the ad network fails to load, the ad container shall collapse gracefully without disrupting layout or blocking user interaction.

**FR-7: Progressive Web App (Installability)**
- FR-7.1 The application shall be installable to a device home screen via the browser's install prompt, generated from a Web App Manifest.
- FR-7.2 Installed launches shall use `display: standalone` (no browser chrome).
- FR-7.3 A service worker shall precache the static app shell (JS/CSS/fonts/icons/manifest) for fast repeat launches.
- FR-7.4 The service worker shall **not** cache API responses, Supabase calls, or server-rendered HTML containing user data.
- FR-7.5 Tailor-facing application routes shall be Client Components so they render from the precached shell; admin routes may use Server Components.
- FR-7.6 When the device is offline, the application shall display a clear offline notice and disable data-entry actions rather than allowing submissions that will fail.

**FR-8: Connectivity Handling**
- FR-8.1 Failed network requests shall surface a user-visible error with a retry action.
- FR-8.2 Unsaved form input shall be preserved in memory (not persisted to disk) across retry attempts within the same session.
- FR-8.3 On boot, the application shall check connectivity. If offline, it shall show a blocking notice instead of the app UI.

**FR-9: Server-Side Validation**
- FR-9.1 Every Server Action and Route Handler that accepts input shall validate the input against a schema before executing any database mutation or privileged operation.
- FR-9.2 Validation shall be implemented using Zod, providing both runtime validation and inferred TypeScript types from a single schema definition.
- FR-9.3 The server shall reject malformed, incomplete, or unexpected input and return structured field-level errors.
- FR-9.4 Client-side validation may be used for UX feedback but is non-authoritative; the server is the sole source of truth.

### 2.2 Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-1 | **Performance** — Measurement entry form should load and be usable in under 2 seconds on a mid-range mobile device. |
| NFR-2 | **Availability** — Target 99.5% uptime for the hosted backend. |
| NFR-3 | **Security** — All tailor data must be access-controlled at the database level via Row-Level Security, not just in application logic. |
| NFR-4 | **Data integrity** — Historical measurement records must be immutable once saved. Enforced at the database level (no `UPDATE`/`DELETE` policies granted to tailors on `measurements`). |
| NFR-5 | **Usability** — Measurement entry UI must be usable one-handed / quickly, suitable for in-fitting-room use. |
| NFR-6 | **Scalability** — Data model must support growth to many thousands of tailors without structural redesign (flat ownership model, indexed by `tailor_id`). |
| NFR-7 | **Portability** — Must run in any modern mobile/desktop browser without requiring app-store installation. |
| NFR-8 | **Free Tier Constraint** — Free Plan Supabase projects are paused after 7 days without database activity. Deployment must configure GitHub Actions or Vercel Cron to ping the project REST endpoint daily (see §3.11). |
| NFR-9 | **Secret Isolation** — Service-role keys and other secrets shall reside only in server-side environment variables and shall never be exposed to the client bundle. |
| NFR-10 | **Input Validation** — No database mutation shall execute against unvalidated input. |

### 2.3 Data Requirements

- **DR-1**: Every core entity (clients, templates, measurements) must be scoped to a `tailor_id` for ownership and access control.
- **DR-2**: Measurement records must store a **snapshot** of the template's field definitions (field names, units, values) at the time of recording, rather than a live reference to the mutable template. This guarantees historical accuracy is preserved even if the source template is later edited or deleted.
- **DR-3**: Custom fields are variable per tailor and per template; the schema must accommodate this without requiring schema migrations per tailor (i.e., structured/JSONB storage for field definitions and values).
- **DR-4**: Measurement rows must be insert-only for the tailor role. No update or delete permissions are granted.

### 2.4 Key Use Cases

1. **Create Measurement Template** — Tailor → defines template name and custom fields → saves.
2. **Register Client** — Tailor → enters client name/contact → saves.
3. **Record Measurement** — Tailor → selects client → selects template → fills field values → saves as dated, immutable record.
4. **Review Client History** — Tailor → opens client profile → views list of past measurements → opens one to view details.
5. **Edit Template** — Tailor → modifies fields on an existing template → future measurements use new fields; past records unaffected.
6. **Admin Oversight** — Admin → views tailor list and stats → suspends/reactivates an account (action is audit-logged).

---

## 3. System Design and Architecture

### 3.1 Architectural Style

A **client-owned, flat multi-tenant** Progressive Web App built with Next.js, backed by Supabase (Postgres + Auth + Row-Level Security). Each tailor is their own independent tenant; there is no shared-shop or staff-management layer in this version.

The system uses **hybrid rendering** within Next.js:
- **Admin routes** use Server Components (SSR via `@supabase/ssr`) for fast server-rendered pages.
- **Tailor-facing routes** use Client Components (CSR via `@supabase/supabase-js`) so the PWA app shell can be precached by the service worker and rendered quickly on repeat launches.

**Security Principle — Server-Side Secrets & Validation:**

Every secret, secured operation, and authentication-related action shall be handled exclusively on the **server side** and must never be exposed to the client side.

- **Secrets:** `SUPABASE_SERVICE_ROLE_KEY` and any other sensitive credentials are stored only in server-side environment variables (never prefixed with `NEXT_PUBLIC_`). They are accessible only within Server Components, Server Actions, Route Handlers, and middleware.
- **Auth operations:** Sign-in, sign-out, session refresh, and token validation are performed via Server Actions and middleware using the `@supabase/ssr` server client. The browser client is used only for non-privileged reads/writes scoped by RLS.
- **Server-side validation:** The server shall never trust client-side requests without validating them. Every Server Action and Route Handler that accepts input performs schema validation before executing any database mutation or privileged operation.

Validation is implemented using **Zod**, which provides both runtime validation and static TypeScript type inference from a single schema definition.

### 3.2 High-Level Architecture

```
┌──────────────────────────────────────────────┐
│            Client (PWA, Next.js)              │
│  App Router — hybrid rendering:               │
│   • Admin routes → Server Components (SSR)    │
│   • Tailor routes → Client Components (CSR)   │
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
        ▲                         ▲
        └────────────┬────────────┘
                     │
        Client-side Supabase JS
        (tailor-facing pages, RLS-scoped,
         anon key only)

External: Google AdSense — client-side, non-measurement screens only.
```

**Trust boundary:** Everything above the dashed line is untrusted. All privileged operations, secrets, and validation live below it. The client holds only the anon key and an RLS-scoped session; it can never perform an action the server hasn't explicitly authorized and validated.

### 3.3 Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| Frontend framework | **Next.js (App Router)** | Hybrid SSR/CSR, first-class Vercel deployment, mature PWA ecosystem |
| Styling | **Tailwind CSS** | Rapid, consistent UI development |
| PWA layer | **`@serwist/next`** (or `@ducanh2912/next-pwa`) | Manifest, installability, app-shell precache — **no** runtime data caching |
| Backend | **Supabase** (Postgres, Auth, RLS) | Platform-native auth and row-level security; fastest path to MVP |
| Auth | **Supabase Auth** | Native `auth.uid()` integration with RLS; pre-built `auth.users` table; `@supabase/ssr` helpers for Next.js App Router |
| Validation | **Zod** | Single schema → runtime validation + inferred TS types; structured field errors |
| Database | **PostgreSQL with JSONB** | Flexible schema for custom fields without per-tailor migrations |
| Ads | **Google AdSense** | Standard web ad network compatible with PWAs |
| Hosting | **Vercel** (frontend + SSR), **Supabase** (backend) | Low-ops, scales automatically for MVP stage |
| Keep-alive | **GitHub Actions** or **Vercel Cron** | Prevents Free Tier project pausing (see §3.11) |

### 3.4 Data Model

```
-- Managed by Supabase Auth
auth.users
  id, email, encrypted_password, created_at, ...

-- Public application schema
users
  id            uuid PK → auth.users.id
  name          text
  role          text CHECK (role IN ('tailor', 'admin'))
  plan          text CHECK (plan IN ('free', 'premium')) DEFAULT 'free'
  status        text CHECK (status IN ('active', 'suspended')) DEFAULT 'active'
  created_at    timestamptz DEFAULT now()

clients
  id            uuid PK
  tailor_id     uuid → users.id
  name          text
  phone         text
  notes         text
  created_at    timestamptz DEFAULT now()
  updated_at    timestamptz DEFAULT now()

templates
  id            uuid PK
  tailor_id     uuid → users.id
  name          text
  created_at    timestamptz DEFAULT now()
  updated_at    timestamptz DEFAULT now()
  deleted_at    timestamptz NULL   -- soft-delete

template_fields
  id            uuid PK
  template_id   uuid → templates.id ON DELETE CASCADE
  field_name    text
  unit          text
  order_index   int
  UNIQUE (template_id, order_index)

measurements
  id                     uuid PK
  client_id              uuid → clients.id ON DELETE RESTRICT
  tailor_id              uuid → users.id
  template_id            uuid → templates.id ON DELETE SET NULL  -- nullable
  template_name_snapshot text
  fields_snapshot        jsonb   -- [{field_name, unit, value}, ...]
  taken_at               timestamptz
  created_at             timestamptz DEFAULT now()

admin_audit_log
  id            uuid PK
  actor_id      uuid → users.id
  target_id     uuid → users.id
  action        text   -- 'suspend' | 'reactivate' | ...
  created_at    timestamptz DEFAULT now()

keep_alive
  id            uuid PK DEFAULT gen_random_uuid()
  pinged_at     timestamptz DEFAULT now()
```

**Design notes:**
- `users.id` mirrors `auth.users.id` and holds only application-specific profile data. Credentials live exclusively in `auth.users` (Supabase Auth).
- `measurements.template_id` is nullable and uses `ON DELETE SET NULL`, so template hard-deletion does not break history. Combined with soft-delete on `templates` (`deleted_at`), the reference is preserved in practice.
- `measurements.fields_snapshot` is the authoritative source for rendering a historical record. `template_id` is retained only for grouping/filtering.
- `clients` deletion uses `RESTRICT` on measurements — a client with measurement history cannot be hard-deleted. Use soft-delete if client deletion is required while preserving history (see §3.7 note).

### 3.5 Access Control Model

Row-Level Security (RLS) is enabled on all public tables.

- A `tailor` role may only `SELECT`/`INSERT`/`UPDATE`/`DELETE` rows where `tailor_id = auth.uid()`.
- **`measurements` exception:** tailors are granted `SELECT` and `INSERT` only. No `UPDATE` or `DELETE` policies are created for tailors, enforcing NFR-4 / FR-4.5 at the database layer.
- The `admin` role bypasses tenant scoping via a separate policy permitting read access across all tailors and write access to `users.status` only.
- Writes to `admin_audit_log` are permitted for admins via `INSERT`.
- No cross-tailor data visibility exists at either the application layer or the database layer.

### 3.6 Rendering Strategy

| Route group | Rendering | Data access | Rationale |
|---|---|---|---|
| `/admin/**` | Server Components (SSR) | `@supabase/ssr` server client | Fast server-rendered pages; admin isn't the perf-critical path |
| `/(auth)/**` (login, register) | Mixed | `@supabase/ssr` | Middleware-driven session refresh |
| `/(app)/**` (tailor-facing: clients, templates, measurements) | Client Components (CSR) | `@supabase/supabase-js` browser client | Renders from precached shell; correct PWA behavior |
| Middleware | Edge | `@supabase/ssr` | Session cookie refresh on every request |

**Known risk:** App Router + service worker update flow can produce a stale shell talking to a newer backend after a deploy. Mitigation: expose a `/api/version` route and surface a "new version available — reload" prompt when the client's build ID differs from the server's.

### 3.7 Historical Data Immutability (Snapshotting)

When a tailor records a measurement, the system copies the current template's field definitions (names, units) into the `fields_snapshot` JSONB column on the `measurements` row, alongside the entered values. The `template_id` reference is retained only for grouping/filtering (e.g. "show me all Shirt measurements"), but rendering a past record always uses its own snapshot — never a live join to the (possibly since-edited) template.

This satisfies DR-2 and NFR-4. Immutability is enforced at three layers:
1. **Application layer** — no UI paths exist for editing or deleting a saved measurement.
2. **RLS layer** — no `UPDATE`/`DELETE` policies for tailors on `measurements`.
3. **Schema layer** — `ON DELETE SET NULL` on `template_id` ensures template deletion cannot cascade into measurement deletion.

**Note on client deletion:** because measurements reference `clients.id` with `ON DELETE RESTRICT`, a client with recorded measurements cannot be hard-deleted. Recommended UX: soft-delete clients (add `deleted_at` to `clients`, mirroring templates) if user-facing deletion is needed while preserving history.

### 3.8 PWA & Connectivity Handling

1. The service worker precaches the static app shell on first load; subsequent launches render the shell from cache for speed.
2. All data reads/writes go directly to Supabase. No local persistence layer, no IndexedDB, no background sync.
3. On boot, the app checks connectivity via `navigator.onLine` plus a lightweight health-check ping. If offline, it shows a blocking notice and disables write actions (FR-7.6, FR-8.3).
4. Failed requests during a session show inline errors with a retry action; unsaved form state is held in React state until the user navigates away (FR-8.1, FR-8.2).
5. The service worker shall not intercept Supabase API calls. All data traffic goes directly to the network.

### 3.9 Monetization Integration

- Ads are rendered client-side (AdSense units) on: dashboard/home, client list, and template list screens.
- The measurement-entry screen and any modal/dialog workflows are explicitly excluded from ad placement.
- The `plan` field on `users` gates ad rendering (`if plan === 'free'`) and reserves the mechanism for a future premium, ad-free tier.
- If AdSense fails to load (blocker, network), the ad container collapses without breaking layout (FR-6.4).

### 3.10 Free Tier Keep-Alive

Supabase Free Plan projects are paused after **7 days without database activity**. "Activity" is measured at the database layer, so pinging auth health endpoints or static URLs does not count — the ping must reach Postgres.

**Solution:** a scheduled job (GitHub Actions or Vercel Cron) runs daily and performs a lightweight write against the `keep_alive` table.

- **Endpoint:** `https://<project>.supabase.co/rest/v1/keep_alive` with the **anon key** (never `service_role`).
- **Method:** `INSERT` into `keep_alive` (a `SELECT` is not always sufficient in practice).
- **Frequency:** daily (UTC 06:00).
- **Fallback:** if the project is ever paused, it can be restored from the Supabase Dashboard within 1 year with all data intact.

**Note:** once organic user traffic reliably exceeds one request per day, the keep-alive job can be disabled.

### 3.11 Server-Side Validation Pattern

The following pattern is applied to **every** Server Action and Route Handler that accepts input.

**1. Define the schema (shared, co-located with the action):**

```ts
import { z } from 'zod';

export const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(100),
  phone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
});
```

**2. Validate at the top of the action, before any DB access:**

```ts
'use server';

import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { createClientSchema } from './schemas';

export async function createClient(formData: FormData) {
  // 1. Authenticate — never trust the client
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  // 2. Validate — reject malformed input immediately
  const parsed = createClientSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    notes: formData.get('notes'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  // 3. Mutate — only with validated data
  const { error } = await supabase.from('clients').insert({
    tailor_id: user.id,
    ...parsed.data,
  });

  if (error) return { error: error.message };
  return { success: true };
}
```

**Rationale for Zod over hand-rolled validation:**
- A single schema provides both runtime validation and inferred TypeScript types, eliminating schema/type drift.
- `safeParse` returns a structured error object (`flatten().fieldErrors`) that maps directly to form field error display.
- The same schema can be reused on the client for immediate UX feedback (optional, non-authoritative) while the server remains the sole source of truth.

**Scope of validation:**
- All Server Actions that create/update clients, templates, template fields, and measurements.
- Admin actions (suspend/reactivate) validate the target user ID and action type.
- Route Handlers validate any request body, query params, and headers they consume.

### 3.12 Suggested Build Order (MVP)

1. Next.js App Router scaffold + Tailwind CSS + Supabase project provisioning
2. Auth via Supabase Auth (`@supabase/ssr` middleware, login/register pages, `users` profile row on signup) — server-side only
3. Zod schema layer + shared validation helpers
4. Tailor app shell (Client Components) + service worker app-shell precache + Web App Manifest
5. Template builder (CRUD templates + custom fields, Server Actions + Zod)
6. Client management (CRUD, Server Actions + Zod)
7. Measurement recording flow with snapshotting + immutability enforcement (RLS policies)
8. Client history view
9. Admin panel (Server Components: tailor list, stats, suspend/reactivate, audit log)
10. AdSense integration + plan gating
11. PWA installability polish + connectivity/error-state handling
12. Version-check + update-prompt flow
13. Keep-alive job (GitHub Actions or Vercel Cron)

---

## 4. Appendix: Decisions Log

| Decision | Choice | Alternatives considered | Rationale |
|---|---|---|---|
| Offline support | **None** | IndexedDB + Background Sync | Complexity (RLS + expired JWT on queued writes, conflict resolution, multi-device) not justified at MVP stage. |
| PWA scope | **Installability only** | Full offline-capable PWA | Retains home-screen install and fast shell launch without the data-layer complexity. |
| Frontend framework | **Next.js (App Router)** | React + Vite | Hybrid SSR/CSR; first-class Vercel deployment; mature PWA tooling. |
| Auth | **Supabase Auth** | Auth.js | Native RLS integration (`auth.uid()`); zero auth maintenance; Supabase adapter for Auth.js would break RLS. |
| Backend | **Supabase** | Custom Node/NestJS API | Requirements fit the 80% BaaS case; custom backend overhead not justified at MVP stage. Postgres foundation preserves migration path. |
| Validation | **Zod** | Hand-rolled / Yup / Valibot | Single schema → runtime + inferred types; structured errors; de facto standard in Next.js ecosystem. |
| Secret handling | **Server-side only** | Client env vars | Prevents service-role key exposure; auth operations stay server-side; client holds only the anon key. |
| Measurement mutability | **Immutable** | Editable records | Preserves legal/historical accuracy; corrections made via new records. Enforced at RLS layer. |
| Template deletion | **Soft-delete** (`deleted_at`) | Hard delete | Preserves historical measurement references and grouping. |
| Hosting | **Vercel + Supabase** | Self-hosted Supabase | Low ops; managed Postgres; documented self-host migration path if needed. |

---

*End of document.*
