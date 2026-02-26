-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Authors table
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
  seo_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  seo_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  type TEXT NOT NULL DEFAULT 'image' CHECK (type IN ('image', 'video', 'document')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO Settings table (single row)
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'Matermag.hr',
  site_description TEXT NOT NULL DEFAULT '',
  default_og_image TEXT,
  google_analytics_id TEXT,
  robots_txt TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_media_type ON media(type);

-- Full-text search index for articles
CREATE INDEX idx_articles_search ON articles USING GIN (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Public can read published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read published pages" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read authors" ON authors
  FOR SELECT USING (true);

CREATE POLICY "Public can read media" ON media
  FOR SELECT USING (true);

CREATE POLICY "Public can read seo_settings" ON seo_settings
  FOR SELECT USING (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage pages" ON pages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage media" ON media
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage authors" ON authors
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage seo_settings" ON seo_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default SEO settings
INSERT INTO seo_settings (site_title, site_description)
VALUES ('Matermag.hr', 'Lifestyle portal za moderne roditelje');

-- Insert some default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Vijesti', 'vijesti', 'Najnovije vijesti'),
  ('Lifestyle', 'lifestyle', 'Lifestyle članci'),
  ('Zdravlje', 'zdravlje', 'Zdravlje i wellness'),
  ('Recepti', 'recepti', 'Ukusni recepti'),
  ('Djeca', 'djeca', 'Sve o djeci');
