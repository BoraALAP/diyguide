drop policy "allow_inserts_from_auth_trigger" on "public"."user";

drop policy "user can get their info" on "public"."user";

revoke delete on table "public"."user" from "anon";

revoke insert on table "public"."user" from "anon";

revoke references on table "public"."user" from "anon";

revoke select on table "public"."user" from "anon";

revoke trigger on table "public"."user" from "anon";

revoke truncate on table "public"."user" from "anon";

revoke update on table "public"."user" from "anon";

revoke delete on table "public"."user" from "authenticated";

revoke insert on table "public"."user" from "authenticated";

revoke references on table "public"."user" from "authenticated";

revoke select on table "public"."user" from "authenticated";

revoke trigger on table "public"."user" from "authenticated";

revoke truncate on table "public"."user" from "authenticated";

revoke update on table "public"."user" from "authenticated";

revoke delete on table "public"."user" from "service_role";

revoke insert on table "public"."user" from "service_role";

revoke references on table "public"."user" from "service_role";

revoke select on table "public"."user" from "service_role";

revoke trigger on table "public"."user" from "service_role";

revoke truncate on table "public"."user" from "service_role";

revoke update on table "public"."user" from "service_role";

alter table "public"."user" drop constraint "unique_email";

alter table "public"."user" drop constraint "user_id_fkey";

alter table "public"."user" drop constraint "user_pkey";

drop index if exists "public"."unique_email";

drop index if exists "public"."user_pkey";

drop table "public"."user";

create table "public"."users" (
    "id" uuid not null,
    "email" text not null,
    "full_name" text,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "tokens" bigint not null default '0'::bigint,
    "avatar_url" text
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX unique_email ON public.users USING btree (email);

CREATE UNIQUE INDEX user_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "user_pkey" PRIMARY KEY using index "user_pkey";

alter table "public"."users" add constraint "unique_email" UNIQUE using index "unique_email";

alter table "public"."users" add constraint "user_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$DECLARE
    new_user_id uuid;
    user_full_name text := NULL;  -- Default to NULL
    user_avatar_url text := NULL;  -- Default to NULL
BEGIN
    -- Check if the raw_user_meta_data field exists and assign values accordingly
    IF (NEW.raw_user_meta_data IS NOT NULL) THEN
        user_full_name := (NEW.raw_user_meta_data->>'full_name')::text;
        user_avatar_url := (NEW.raw_user_meta_data->>'avatar_url')::text;
    END IF;

    -- Create a new user profile in the users table
    INSERT INTO public.users (id, created_at, full_name, email, avatar_url)
    VALUES (
        NEW.id,
        now(),
        user_full_name,
        NEW.email,
        user_avatar_url
    )
    RETURNING id INTO new_user_id;

    
    RETURN NEW;
END;$function$
;

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "allow_inserts_from_auth_trigger"
on "public"."users"
as permissive
for insert
to public
with check (true);


create policy "user can get their info"
on "public"."users"
as permissive
for select
to authenticated
using ((auth.uid() = id));



