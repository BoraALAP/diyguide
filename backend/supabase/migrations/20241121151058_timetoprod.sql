create table "public"."feedback" (
    "id" uuid not null,
    "guide_id" uuid,
    "user_id" uuid,
    "rating" integer,
    "comments" text,
    "created_at" timestamp without time zone default now()
);


create table "public"."guide_tags" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "guide_id" uuid,
    "tag_id" uuid
);


alter table "public"."guide_tags" enable row level security;

create table "public"."guides" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "content" text not null,
    "created_by" text default 'AI'::text,
    "created_at" timestamp without time zone default now(),
    "steps" jsonb[],
    "tips" text[],
    "materials" text[],
    "tools" text[]
);


alter table "public"."guides" enable row level security;

create table "public"."tags" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "name" text not null
);


alter table "public"."tags" enable row level security;

CREATE UNIQUE INDEX feedback_pkey ON public.feedback USING btree (id);

CREATE UNIQUE INDEX guide_tags_pkey ON public.guide_tags USING btree (id);

CREATE UNIQUE INDEX guides_pkey ON public.guides USING btree (id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

alter table "public"."feedback" add constraint "feedback_pkey" PRIMARY KEY using index "feedback_pkey";

alter table "public"."guide_tags" add constraint "guide_tags_pkey" PRIMARY KEY using index "guide_tags_pkey";

alter table "public"."guides" add constraint "guides_pkey" PRIMARY KEY using index "guides_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."feedback" add constraint "feedback_guide_id_fkey" FOREIGN KEY (guide_id) REFERENCES guides(id) not valid;

alter table "public"."feedback" validate constraint "feedback_guide_id_fkey";

alter table "public"."feedback" add constraint "feedback_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."feedback" validate constraint "feedback_rating_check";

alter table "public"."guide_tags" add constraint "guide_tags_guide_id_fkey" FOREIGN KEY (guide_id) REFERENCES guides(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."guide_tags" validate constraint "guide_tags_guide_id_fkey";

alter table "public"."guide_tags" add constraint "guide_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."guide_tags" validate constraint "guide_tags_tag_id_fkey";

grant delete on table "public"."feedback" to "anon";

grant insert on table "public"."feedback" to "anon";

grant references on table "public"."feedback" to "anon";

grant select on table "public"."feedback" to "anon";

grant trigger on table "public"."feedback" to "anon";

grant truncate on table "public"."feedback" to "anon";

grant update on table "public"."feedback" to "anon";

grant delete on table "public"."feedback" to "authenticated";

grant insert on table "public"."feedback" to "authenticated";

grant references on table "public"."feedback" to "authenticated";

grant select on table "public"."feedback" to "authenticated";

grant trigger on table "public"."feedback" to "authenticated";

grant truncate on table "public"."feedback" to "authenticated";

grant update on table "public"."feedback" to "authenticated";

grant delete on table "public"."feedback" to "service_role";

grant insert on table "public"."feedback" to "service_role";

grant references on table "public"."feedback" to "service_role";

grant select on table "public"."feedback" to "service_role";

grant trigger on table "public"."feedback" to "service_role";

grant truncate on table "public"."feedback" to "service_role";

grant update on table "public"."feedback" to "service_role";

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

grant delete on table "public"."guides" to "anon";

grant insert on table "public"."guides" to "anon";

grant references on table "public"."guides" to "anon";

grant select on table "public"."guides" to "anon";

grant trigger on table "public"."guides" to "anon";

grant truncate on table "public"."guides" to "anon";

grant update on table "public"."guides" to "anon";

grant delete on table "public"."guides" to "authenticated";

grant insert on table "public"."guides" to "authenticated";

grant references on table "public"."guides" to "authenticated";

grant select on table "public"."guides" to "authenticated";

grant trigger on table "public"."guides" to "authenticated";

grant truncate on table "public"."guides" to "authenticated";

grant update on table "public"."guides" to "authenticated";

grant delete on table "public"."guides" to "service_role";

grant insert on table "public"."guides" to "service_role";

grant references on table "public"."guides" to "service_role";

grant select on table "public"."guides" to "service_role";

grant trigger on table "public"."guides" to "service_role";

grant truncate on table "public"."guides" to "service_role";

grant update on table "public"."guides" to "service_role";

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


create policy "Select Public"
on "public"."guides"
as permissive
for select
to anon
using (true);


create policy "insert"
on "public"."guides"
as permissive
for insert
to anon
with check (true);


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



