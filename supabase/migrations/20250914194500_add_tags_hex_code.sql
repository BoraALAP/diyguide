-- Add hex_code column to public.tags and backfill
set check_function_bodies = off;

-- Ensure pgcrypto is available for gen_random_bytes (some self-hosted envs omit it)
create extension if not exists pgcrypto with schema extensions;

alter table public.tags
  add column if not exists hex_code text;

-- Backfill any NULLs with random 6-hex (very low collision probability)
do $$
begin
  begin
    update public.tags
       set hex_code = substring(encode(extensions.gen_random_bytes(3), 'hex') from 1 for 6)
     where hex_code is null;
  exception
    when undefined_function then
      update public.tags
         set hex_code = substring(encode(gen_random_bytes(3), 'hex') from 1 for 6)
       where hex_code is null;
  end;
end;
$$ language plpgsql;

-- Enforce constraints after backfill
alter table public.tags
  alter column hex_code set not null;

alter table public.tags
  add constraint tags_hex_code_unique unique (hex_code);
