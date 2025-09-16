-- Seed sample data for local development
-- Tags
INSERT INTO public.tags (name)
VALUES
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
ON CONFLICT DO NOTHING;

-- Guide 1: Simple Bookshelf
WITH new_guide AS (
  INSERT INTO public.guides (
    title,
    content,
    steps,
    materials,
    tips,
    tools,
    created_by
  ) VALUES (
    'Build a Simple Bookshelf',
    'A straightforward weekend project to build a sturdy bookshelf using common tools and lumber.',
    ARRAY[
      jsonb_build_object(
        'step', 1,
        'description', 'Measure and cut boards to size',
        'materials', ARRAY['2x10 lumber'],
        'tools', ARRAY['tape measure','pencil','circular saw']
      )::jsonb,
      jsonb_build_object(
        'step', 2,
        'description', 'Assemble the frame with screws and glue',
        'materials', ARRAY['wood screws','wood glue'],
        'tools', ARRAY['drill/driver','clamps']
      )::jsonb,
      jsonb_build_object(
        'step', 3,
        'description', 'Sand and finish as desired',
        'materials', ARRAY['sandpaper','finish/paint (optional)'],
        'tools', ARRAY['sander']
      )::jsonb
    ],
    ARRAY['2x10 lumber','wood screws','wood glue','sandpaper'],
    ARRAY['Measure twice, cut once','Dry-fit before gluing'],
    ARRAY['circular saw','drill/driver','sander','clamps'],
    'seed'
  )
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO public.guide_tags (guide_id, tag_id)
SELECT ng.id, t.id
FROM new_guide ng
JOIN public.tags t ON t.name IN ('woodworking');

-- Guide 2: Paint a Bedroom
WITH new_guide AS (
  INSERT INTO public.guides (
    title,
    content,
    steps,
    materials,
    tips,
    tools,
    created_by
  ) VALUES (
    'Paint a Bedroom Like a Pro',
    'Prep, prime, and paint walls for a clean, durable finish.',
    ARRAY[
      jsonb_build_object(
        'step', 1,
        'description', 'Prep walls: fill holes and sand smooth',
        'materials', ARRAY['spackle','sandpaper'],
        'tools', ARRAY['putty knife','sanding block']
      )::jsonb,
      jsonb_build_object(
        'step', 2,
        'description', 'Tape trim and protect floors',
        'materials', ARRAY['painter''s tape','drop cloths'],
        'tools', ARRAY['utility knife']
      )::jsonb,
      jsonb_build_object(
        'step', 3,
        'description', 'Prime stains and paint in two coats',
        'materials', ARRAY['primer','interior wall paint'],
        'tools', ARRAY['roller','brush','tray']
      )::jsonb
    ],
    ARRAY['primer','interior wall paint','painter''s tape','drop cloths','spackle','sandpaper'],
    ARRAY['Cut in first, then roll','Maintain a wet edge for even finish'],
    ARRAY['roller','angled brush','extension pole','putty knife'],
    'seed'
  )
  ON CONFLICT DO NOTHING
  RETURNING id
)
INSERT INTO public.guide_tags (guide_id, tag_id)
SELECT ng.id, t.id
FROM new_guide ng
JOIN public.tags t ON t.name IN ('painting');

-- Optional: sample feedback for visibility (uses NULL user_id for seed)
INSERT INTO public.feedback (id, guide_id, user_id, rating, comments)
SELECT gen_random_uuid(), g.id, NULL, 5, 'Great starter project!'
FROM public.guides g
WHERE g.title = 'Build a Simple Bookshelf'
ON CONFLICT DO NOTHING;
