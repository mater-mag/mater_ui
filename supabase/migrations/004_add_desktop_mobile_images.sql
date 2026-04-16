-- Add desktop and mobile featured image fields to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image_desktop TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_image_mobile TEXT;

-- Migrate existing featured_image to desktop version
UPDATE articles SET featured_image_desktop = featured_image WHERE featured_image IS NOT NULL;
