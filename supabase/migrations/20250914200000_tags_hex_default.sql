-- Ensure tags.hex_code always gets a value on insert (e.g., during seed)
set check_function_bodies = off;

-- Ensure pgcrypto is available for gen_random_bytes
create extension if not exists pgcrypto with schema extensions;

-- Set a default 6-hex value for new rows
do $$
begin
  begin
    alter table public.tags
      alter column hex_code set default substring(encode(extensions.gen_random_bytes(3), 'hex') from 1 for 6);
  exception
    when undefined_function then
      alter table public.tags
        alter column hex_code set default substring(encode(gen_random_bytes(3), 'hex') from 1 for 6);
  end;
end;
$$ language plpgsql;

-- Backfill again in case any NULLs slipped in
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

-- Keep uniqueness (will already exist from prior migration, but idempotent to ensure)
do $$ begin
  perform 1 from pg_indexes where schemaname = 'public' and indexname = 'tags_hex_code_unique_idx';
  if not found then
    create unique index tags_hex_code_unique_idx on public.tags(hex_code);
  end if;
end $$;
