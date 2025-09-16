-- Helpers to compute relative luminance and contrast to black/white
set check_function_bodies = off;

-- Ensure pgcrypto before using gen_random_bytes
create extension if not exists pgcrypto with schema extensions;

-- Helper to safely produce a 6-char hex string regardless of pgcrypto schema
create or replace function public.random_hex6()
returns text
language plpgsql
as $$
declare
  bytes bytea;
begin
  begin
    bytes := extensions.gen_random_bytes(3);
  exception
    when undefined_function then
      bytes := gen_random_bytes(3);
  end;
  return substring(encode(bytes, 'hex') from 1 for 6);
end;
$$;

create or replace function public.hex_rel_luminance(hex text)
returns double precision language sql immutable as $$
  with b as (
    select get_byte(decode(regexp_replace(hex, '^#', ''), 'hex'), 0) as r,
           get_byte(decode(regexp_replace(hex, '^#', ''), 'hex'), 1) as g,
           get_byte(decode(regexp_replace(hex, '^#', ''), 'hex'), 2) as b
  ),
  n as (
    select r/255.0 as rn, g/255.0 as gn, b/255.0 as bn from b
  ),
  lin as (
    select
      case when rn <= 0.03928 then rn/12.92 else power((rn+0.055)/1.055, 2.4) end as R,
      case when gn <= 0.03928 then gn/12.92 else power((gn+0.055)/1.055, 2.4) end as G,
      case when bn <= 0.03928 then bn/12.92 else power((bn+0.055)/1.055, 2.4) end as B
    from n
  )
  select 0.2126*R + 0.7152*G + 0.0722*B from lin;
$$;

create or replace function public.hex_contrast_ok(hex text)
returns boolean language sql immutable as $$
  select (1.0+0.05)/(public.hex_rel_luminance(hex)+0.05) >= 3.0
     and (public.hex_rel_luminance(hex)+0.05)/(0.0+0.05) >= 3.0;
$$;

-- Fix existing tags to satisfy contrast; retry random values until valid and unique
do $$
declare
  rec record;
  candidate text;
  tries int;
begin
  for rec in (
    select id, hex_code from public.tags
    where hex_code is null or not public.hex_contrast_ok(hex_code)
  ) loop
    tries := 0;
    loop
      candidate := public.random_hex6();
      exit when public.hex_contrast_ok(candidate)
             and not exists (select 1 from public.tags where lower(hex_code) = lower(candidate));
      tries := tries + 1;
      exit when tries > 100;
    end loop;
    update public.tags set hex_code = candidate where id = rec.id;
  end loop;
end $$;
