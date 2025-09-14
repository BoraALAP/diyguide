-- Add session_id column referenced by generate-guide function
ALTER TABLE public.guides
ADD COLUMN IF NOT EXISTS session_id text;

-- Optional: index for faster lookup by session
CREATE INDEX IF NOT EXISTS guides_session_id_idx
  ON public.guides (session_id);

