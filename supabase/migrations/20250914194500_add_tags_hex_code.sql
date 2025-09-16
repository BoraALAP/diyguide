-- Add hex_code column to public.tags and backfill
set check_function_bodies = off;

alter table public.tags
  add column if not exists hex_code text;

-- Backfill any NULLs with random 6-hex (very low collision probability)
update public.tags
   set hex_code = substring(encode(gen_random_bytes(3), 'hex') from 1 for 6)
 where hex_code is null;

-- Enforce constraints after backfill
alter table public.tags
  alter column hex_code set not null;

alter table public.tags
  add constraint tags_hex_code_unique unique (hex_code);

