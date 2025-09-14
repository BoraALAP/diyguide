-- Convert guides.session_id to uuid and add RLS for authenticated inserts

-- Ensure pgcrypto extension for gen_random_uuid (usually enabled by Supabase)
create extension if not exists pgcrypto;

-- Add column if missing (some envs may not have prior migration)
alter table public.guides
  add column if not exists session_id text;

-- Convert to uuid with safe cast; fallback to generated uuid when text invalid/null
alter table public.guides
  alter column session_id type uuid using (
    case
      when session_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        then session_id::uuid
      else gen_random_uuid()
    end
  );

-- Set a default for new rows
alter table public.guides
  alter column session_id set default gen_random_uuid();

-- Index for quick lookup by session
create index if not exists guides_session_id_idx on public.guides (session_id);

-- RLS: allow authenticated users to insert rows they own
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'guides' and policyname = 'insert authenticated'
  ) then
    create policy "insert authenticated" on public.guides
      for insert to authenticated
      with check (created_by = auth.uid()::text);
  end if;
end $$;
