---
name: supabase
description: Supabase expert covering PostgreSQL RLS, PostgREST REST API, Edge Functions (Deno), Auth, and Supabase CLI. Specialized for the Amigo Secreto ou Inimigo project patterns.
risk: safe
source: self
date_added: "2026-06-25"
---

# Supabase Expert

Deep knowledge of Supabase for this project: PostgreSQL schema, RLS policies, PostgREST REST API consumption via Angular `HttpClient`, Edge Functions in Deno, and Supabase CLI migrations.

---

## 1. Project-Specific Architecture

```
apps/web  ──HTTP──►  Supabase REST (PostgREST)   ──►  PostgreSQL (RLS enforced)
                  ──HTTP──►  Supabase Edge Functions  ──►  PostgreSQL (service_role, no RLS)
                  ──HTTP──►  Supabase Auth API
```

- `apps/web` uses `HttpClient` directly — NO `@supabase/supabase-js` SDK
- All client requests use `anon key` (subject to RLS)
- Edge Functions use `service_role` key (bypass RLS)

---

## 2. Security Model

### The Critical Rule

**`drawn_participant_id` is NEVER accessible from the client.** The `participants_public` view excludes this column. Only the `get_my_draw` PostgreSQL RPC returns it, scoped to the requesting token.

### Access Matrix

| Operation | Who | How | RLS? |
|-----------|-----|-----|------|
| SELECT participants | `anon` | `participants_public` view | Yes — excludes `drawn_participant_id` |
| INSERT participant | `anon` | `participants` table | Yes — open policy |
| DELETE participant | `authenticated` + `owner_id` | `participants` table | Yes — owner + pre-draw only |
| UPDATE `drawn_participant_id` | `service_role` only | Edge Function | Bypassed |
| SELECT groups | `anon` | `groups` table | Yes — open read |
| UPDATE group | `authenticated` + `owner_id` | `groups` table | Yes — owner only |
| Perform draw | `anon` (via Edge Function) | `POST /functions/v1/perform-draw` | N/A |
| Reveal draw | `anon` | `POST /rest/v1/rpc/get_my_draw` | Bypassed via SECURITY DEFINER |

---

## 3. PostgREST REST API (used by `apps/web`)

### Filter Syntax (as query params)

```
?column=eq.value       → WHERE column = 'value'
?column=neq.value      → WHERE column != 'value'
?column=is.null        → WHERE column IS NULL
?column=not.is.null    → WHERE column IS NOT NULL
?column=in.(a,b,c)     → WHERE column IN ('a','b','c')
?select=col1,col2      → SELECT col1, col2
?order=created_at.asc  → ORDER BY created_at ASC
?limit=10              → LIMIT 10
```

### Headers required by `apps/web`

```
apikey: <SUPABASE_ANON_KEY>
Authorization: Bearer <SUPABASE_ANON_KEY>   (or JWT when authenticated)
Content-Type: application/json
Prefer: return=representation                (for INSERT/UPDATE to return the row)
```

### Calling RPCs

```
POST /rest/v1/rpc/get_my_draw
Body: { "p_personal_token": "token-value" }
```

### Single row vs array

- `GET /rest/v1/groups?admin_token=eq.xxx` returns an array — use `?limit=1` and take `[0]`
- Add header `Accept: application/vnd.pgrst.object+json` to get a single object (throws 406 if 0 or > 1 rows)

---

## 4. Edge Functions (Deno)

### File Structure

```
apps/api/supabase/functions/
└── perform-draw/
    └── index.ts      ← Entry point, must use Deno.serve()
```

### Mandatory Boilerplate

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  // ... handler logic
});
```

### Service Role Client

```typescript
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);
// This client bypasses ALL RLS policies
```

### Error Response Pattern

```typescript
return new Response(
  JSON.stringify({ error: 'Descriptive message' }),
  { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
);
```

### Invoking from Angular

```typescript
// DrawService calls the edge function
this.http.post<DrawResponse>(
  `${supabaseUrl}/functions/v1/perform-draw`,
  { admin_token: token },
)
// The authInterceptor automatically injects the apikey header
```

---

## 5. PostgreSQL Patterns Used in This Project

### SECURITY DEFINER Functions

```sql
CREATE OR REPLACE FUNCTION public.get_my_draw(p_personal_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER          -- Runs as function owner, bypassing RLS
SET search_path = public  -- Prevents search_path injection
AS $$
BEGIN
  -- Can access participants.drawn_participant_id even though anon cannot
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_draw(text) TO anon, authenticated;
```

### Idempotent Migration Pattern

```sql
-- Columns
ALTER TABLE public.groups
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open';

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_groups_admin_token
  ON public.groups(admin_token);

-- Functions
CREATE OR REPLACE FUNCTION public.set_updated_at() ...

-- Policies (drop first for idempotency)
DROP POLICY IF EXISTS "policy_name" ON public.table;
CREATE POLICY "policy_name" ON public.table ...
```

### RLS Policy Patterns

```sql
-- Open insert (anyone can create)
CREATE POLICY "groups_public_insert" ON public.groups
  FOR INSERT WITH CHECK (true);

-- Owner-only update
CREATE POLICY "groups_owner_update" ON public.groups
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = owner_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = owner_id);

-- Conditional delete (owner + pre-draw check)
CREATE POLICY "participants_owner_delete" ON public.participants
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.groups g
      WHERE g.id = group_id
        AND g.owner_id = auth.uid()
        AND g.drawn_at IS NULL
    )
  );
```

---

## 6. Supabase CLI Commands

```bash
# Start local stack (requires Docker)
supabase start

# Apply migrations to local db
supabase db reset       # Drops and recreates, runs all migrations + seed.sql
supabase db push        # Applies pending migrations to cloud

# Diff current schema vs migrations
supabase db diff

# Edge Functions
supabase functions serve perform-draw   # Serve locally
supabase functions deploy perform-draw  # Deploy to cloud

# Link to cloud project (run once)
supabase link --project-ref YOUR_PROJECT_REF
```

---

## 7. Common Pitfalls

| Pitfall | Correct Approach |
|---------|-----------------|
| Using `@supabase/supabase-js` in Angular | Use `HttpClient` directly against REST API |
| Querying `participants` table from frontend | Always use `participants_public` view |
| Setting `drawn_participant_id` from frontend | Only the Edge Function sets this |
| Using `process.env` in Edge Functions | Use `Deno.env.get()` |
| Returning arrays from RPC expecting a single object | Use `json_build_object()`, not `SETOF` |
| Not handling CORS in Edge Functions | Always handle `OPTIONS` preflight |
| Migration that isn't idempotent | Use `IF NOT EXISTS`, `CREATE OR REPLACE` |
| Forgetting `GRANT EXECUTE` on SECURITY DEFINER functions | Always grant to `anon, authenticated` |
| Using `require()` in Edge Functions | Deno uses ESM only — `import` from URLs |
