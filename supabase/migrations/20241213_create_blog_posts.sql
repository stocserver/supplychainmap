-- Blog posts table for SEO content
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Index for published posts ordered by date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- Enable Row Level Security (optional, if you want to restrict access)
-- ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to published posts
-- CREATE POLICY "Public can view published posts" ON blog_posts
--   FOR SELECT USING (published = true);
