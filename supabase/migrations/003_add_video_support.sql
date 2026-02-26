-- Add video support to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_video TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video'));

-- Create index for media_type
CREATE INDEX IF NOT EXISTS idx_articles_media_type ON articles(media_type);
