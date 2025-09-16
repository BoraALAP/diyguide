-- Add first_name and last_name to public.users and create purchases table
set check_function_bodies = off;

-- 1) Add new name fields to users
alter table public.users
  add column if not exists first_name text,
  add column if not exists last_name text;

-- 2) Update the handle_new_user trigger to populate new fields when available
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer as $$
declare
    v_first_name text := null;
    v_last_name  text := null;
    v_full_name  text := null;
    v_avatar_url text := null;
begin
    if (NEW.raw_user_meta_data is not null) then
        v_full_name  := (NEW.raw_user_meta_data->>'full_name')::text;
        v_first_name := (NEW.raw_user_meta_data->>'first_name')::text;
        v_last_name  := (NEW.raw_user_meta_data->>'last_name')::text;
        v_avatar_url := (NEW.raw_user_meta_data->>'avatar_url')::text;
    end if;

    -- Fallback: build full_name from first + last if full_name missing
    if v_full_name is null then
        v_full_name := trim(coalesce(v_first_name, '') || ' ' || coalesce(v_last_name, ''));
        if v_full_name = '' then
          v_full_name := null;
        end if;
    end if;

    insert into public.users (id, created_at, full_name, first_name, last_name, email, avatar_url)
    values (
      NEW.id,
      now(),
      v_full_name,
      v_first_name,
      v_last_name,
      NEW.email,
      v_avatar_url
    );

    return NEW;
end;$$;

-- 3) Create purchases table to track user purchases
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null, -- e.g., 'revenuecat', 'apple', 'google'
  product_id text not null,
  transaction_id text unique,
  amount_cents integer,
  currency text,
  tokens_awarded integer not null default 0,
  raw jsonb, -- raw provider payload for auditing/debugging
  created_at timestamptz not null default now()
);

alter table public.purchases enable row level security;

-- RLS: users can read/insert their own purchases
create policy "purchases_select_own" on public.purchases
  for select to authenticated
  using (auth.uid() = user_id);

create policy "purchases_insert_own" on public.purchases
  for insert to authenticated
  with check (auth.uid() = user_id);

-- Helpful indexes
create index if not exists purchases_user_id_idx on public.purchases(user_id);
create index if not exists purchases_created_at_idx on public.purchases(created_at desc);

