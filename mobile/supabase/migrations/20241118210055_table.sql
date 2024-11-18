create table "public"."feedback" (
    "id" uuid not null,
    "guide_id" uuid,
    "user_id" uuid,
    "rating" integer,
    "comments" text,
    "created_at" timestamp without time zone default now()
);


create table "public"."guides" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "content" text not null,
    "tags" text[],
    "created_by" text default 'AI'::text,
    "created_at" timestamp without time zone default now(),
    "steps" jsonb[]
);


alter table "public"."guides" enable row level security;

CREATE UNIQUE INDEX feedback_pkey ON public.feedback USING btree (id);

CREATE UNIQUE INDEX guides_pkey ON public.guides USING btree (id);

alter table "public"."feedback" add constraint "feedback_pkey" PRIMARY KEY using index "feedback_pkey";

alter table "public"."guides" add constraint "guides_pkey" PRIMARY KEY using index "guides_pkey";

alter table "public"."feedback" add constraint "feedback_guide_id_fkey" FOREIGN KEY (guide_id) REFERENCES guides(id) not valid;

alter table "public"."feedback" validate constraint "feedback_guide_id_fkey";

alter table "public"."feedback" add constraint "feedback_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."feedback" validate constraint "feedback_rating_check";

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

create policy "Select Public"
on "public"."guides"
as permissive
for select
to anon
using (true);



