
-- Create posts table for blog editor
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled',
  content JSONB,
  html_content TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public read for published posts
CREATE POLICY "Anyone can read published posts"
  ON public.posts FOR SELECT
  USING (status = 'published');

-- Allow anon to do everything (no auth required per assignment spec)
CREATE POLICY "Anyone can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
  ON public.posts FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete posts"
  ON public.posts FOR DELETE
  USING (true);

CREATE POLICY "Anyone can read draft posts"
  ON public.posts FOR SELECT
  USING (status = 'draft');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
