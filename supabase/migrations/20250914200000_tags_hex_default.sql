-- Ensure tags.hex_code always gets a value on insert (e.g., during seed)
set check_function_bodies = off;

-- Set a default 6-hex value for new rows
alter table public.tags
  alter column hex_code set default substring(encode(gen_random_bytes(3), 'hex') from 1 for 6);

-- Backfill again in case any NULLs slipped in
update public.tags
   set hex_code = substring(encode(gen_random_bytes(3), 'hex') from 1 for 6)
 where hex_code is null;

-- Keep uniqueness (will already exist from prior migration, but idempotent to ensure)
do $$ begin
  perform 1 from pg_indexes where schemaname = 'public' and indexname = 'tags_hex_code_unique_idx';
  if not found then
    create unique index tags_hex_code_unique_idx on public.tags(hex_code);
  end if;
end $$;

