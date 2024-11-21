alter table "public"."guides" add column "materials" text[];

alter table "public"."guides" add column "tips" text[];

alter table "public"."guides" add column "tools" text[];

create policy "insert"
on "public"."guides"
as permissive
for insert
to anon
with check (true);



