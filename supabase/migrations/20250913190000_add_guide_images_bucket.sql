-- Create a public bucket for guide step images
insert into storage.buckets (id, name, public)
values ('guide-images', 'guide-images', true)
on conflict (id) do nothing;

-- Allow public read of objects in the guide-images bucket
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public Read guide-images'
  ) then
    create policy "Public Read guide-images"
      on storage.objects for select
      using (bucket_id = 'guide-images');
  end if;
end $$;

-- Service role can manage objects in the bucket
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Service role full access guide-images'
  ) then
    create policy "Service role full access guide-images"
      on storage.objects for all to service_role
      using (bucket_id = 'guide-images')
      with check (bucket_id = 'guide-images');
  end if;
end $$;

