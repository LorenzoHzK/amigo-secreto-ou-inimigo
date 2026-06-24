# Supabase Setup

Use these values in `apps/web/src/environments/environment.ts`.

- `supabaseUrl`: your Supabase project URL
- `supabaseAnonKey`: your public anon key

Suggested tables:

```sql
create table if not exists public.groups (
  id uuid primary key,
  name text not null,
  admin_token text not null unique,
  invite_token text not null unique,
  price_limit numeric null,
  drawn_at timestamptz null,
  created_at timestamptz not null default now(),
  owner_id uuid null references auth.users(id)
);

create table if not exists public.participants (
  id uuid primary key,
  group_id uuid not null references public.groups(id) on delete cascade,
  name text not null,
  personal_token text not null unique,
  drawn_participant_id uuid null references public.participants(id),
  created_at timestamptz not null default now(),
  owner_id uuid null references auth.users(id)
);
```

Suggested policies:

- Authenticated users can create, update, and read their own `groups`
- Authenticated users can read and manage `participants` for groups they own
- Invite and reveal routes can remain public if you want token-based access
- If you keep public join flows, use tokens as the access control mechanism and consider adding stricter policies later
