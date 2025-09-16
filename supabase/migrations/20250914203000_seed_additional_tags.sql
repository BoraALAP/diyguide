-- Seed additional default tags without requiring a DB reset
set check_function_bodies = off;

insert into public.tags (name)
values
  ('woodworking'),
  ('painting'),
  ('plumbing'),
  ('electrical'),
  ('home repair'),
  ('gardening'),
  ('outdoor living'),
  ('upcycling'),
  ('organization'),
  ('decor craft'),
  ('lighting'),
  ('furniture diy'),
  ('kids projects'),
  ('holiday decor'),
  ('pet projects'),
  ('smart home'),
  ('sewing'),
  ('baking tools'),
  ('masonry'),
  ('flooring'),
  ('eco friendly'),
  ('bathroom refresh'),
  ('kitchen upgrades'),
  ('storage hacks'),
  ('landscaping')
  on conflict (name) do nothing;
