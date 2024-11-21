create table "public"."guide_tags" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "guide_id" uuid,
    "tag_id" uuid
);


alter table "public"."guide_tags" enable row level security;

create table "public"."tags" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
);


alter table "public"."tags" enable row level security;

alter table "public"."guides" drop column "tags";

CREATE UNIQUE INDEX guide_tags_pkey ON public.guide_tags USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

alter table "public"."guide_tags" add constraint "guide_tags_pkey" PRIMARY KEY using index "guide_tags_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."guide_tags" add constraint "guide_tags_guide_id_fkey" FOREIGN KEY (guide_id) REFERENCES guides(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."guide_tags" validate constraint "guide_tags_guide_id_fkey";

alter table "public"."guide_tags" add constraint "guide_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."guide_tags" validate constraint "guide_tags_tag_id_fkey";

grant delete on table "public"."guide_tags" to "anon";

grant insert on table "public"."guide_tags" to "anon";

grant references on table "public"."guide_tags" to "anon";

grant select on table "public"."guide_tags" to "anon";

grant trigger on table "public"."guide_tags" to "anon";

grant truncate on table "public"."guide_tags" to "anon";

grant update on table "public"."guide_tags" to "anon";

grant delete on table "public"."guide_tags" to "authenticated";

grant insert on table "public"."guide_tags" to "authenticated";

grant references on table "public"."guide_tags" to "authenticated";

grant select on table "public"."guide_tags" to "authenticated";

grant trigger on table "public"."guide_tags" to "authenticated";

grant truncate on table "public"."guide_tags" to "authenticated";

grant update on table "public"."guide_tags" to "authenticated";

grant delete on table "public"."guide_tags" to "service_role";

grant insert on table "public"."guide_tags" to "service_role";

grant references on table "public"."guide_tags" to "service_role";

grant select on table "public"."guide_tags" to "service_role";

grant trigger on table "public"."guide_tags" to "service_role";

grant truncate on table "public"."guide_tags" to "service_role";

grant update on table "public"."guide_tags" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

create policy "Insert Public"
on "public"."guide_tags"
as permissive
for insert
to public
with check (true);


create policy "Select Public"
on "public"."guide_tags"
as permissive
for select
to public
using (true);


create policy "Insert Public"
on "public"."tags"
as permissive
for insert
to public
with check (true);


create policy "Select Public"
on "public"."tags"
as permissive
for select
to public
using (true);



