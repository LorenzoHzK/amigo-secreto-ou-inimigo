---
trigger: glob
globs: apps/api/**/*
---

# 02 - SUPABASE & API STRICT RULES

Activation Mode: Glob
Glob Pattern: apps/api/**/*

When working inside `apps/api/`, you are in Deno/Supabase territory. The rules below are non-negotiable.

## 1. DENO RUNTIME (Edge Functions)

- Edge Functions run on **Deno**, NOT Node.js. These are FORBIDDEN: `require()`, `process.env`, `__dirname`, CommonJS patterns.
- Import from ESM URLs: `import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'`
- NEVER use `npm:` specifiers unless Deno supports them for the specific package.
- Entry point is always `Deno.serve(async (req) => { ... })` — not `export default handler`.

## 2. ENVIRONMENT VARIABLES (Edge Functions)

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are **automatically injected** by the Supabase runtime. Never hardcode them. Never `.env` them inside the function.
- Access via `Deno.env.get('SUPABASE_URL')`.
- The `anon key` is NEVER used in Edge Functions — always use `service_role` to bypass RLS.

## 3. SQL MIGRATIONS

- All SQL files go in `apps/api/supabase/migrations/` with the naming convention `NNN_description.sql` (e.g. `001_add_indexes.sql`).
- Migrations are applied in lexicographic order — number them sequentially.
- Always write migrations as **idempotent** using `IF NOT EXISTS`, `CREATE OR REPLACE`, `DROP ... IF EXISTS`.
- Never use `DROP TABLE` or `TRUNCATE` in a migration — only additive or `ALTER TABLE ADD COLUMN IF NOT EXISTS`.

## 4. ROW LEVEL SECURITY (RLS)

- `service_role` key bypasses ALL RLS policies by Supabase design — Edge Functions always use this.
- `anon` key is subject to all RLS policies — this is what `apps/web` uses.
- When writing a policy, test it with both roles.
- The `participants` table has SELECT revoked for `anon`/`authenticated` — they must use `participants_public` view.
- Never create a SELECT policy on `participants` that exposes `drawn_participant_id`.

## 5. SECURITY DEFINER FUNCTIONS

- Use `SECURITY DEFINER` only on PostgreSQL functions that need to bypass RLS to return scoped data (e.g. `get_my_draw` returns only the caller's own pair).
- Always include `SET search_path = public` to prevent search_path injection attacks.
- Always `GRANT EXECUTE ON FUNCTION ... TO anon, authenticated` explicitly.

## 6. CORS IN EDGE FUNCTIONS

- All Edge Functions MUST handle `OPTIONS` preflight requests and return CORS headers.
- Use the following standard headers:
  ```typescript
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  ```
- Return `new Response(null, { headers: corsHeaders })` for OPTIONS requests.

## 7. SEED DATA

- `apps/api/supabase/seed.sql` is only for local development — use deterministic UUIDs (all-zeros with increments) to make test data predictable.
- Never commit real user data to seed.sql.
