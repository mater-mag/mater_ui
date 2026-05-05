-- Add responsive video support to articles
-- Allows different video for desktop vs mobile (e.g., image on desktop, video on mobile)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_video_desktop TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_video_mobile TEXT;

-- Update media_type to support 'mixed' for different media per breakpoint
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_media_type_check;
ALTER TABLE articles ADD CONSTRAINT articles_media_type_check
  CHECK (media_type IN ('image', 'video', 'mixed'));
