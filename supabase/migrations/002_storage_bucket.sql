-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view files in the media bucket
CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update media" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'media');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete media" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'media');

-- Add Intervjui category
INSERT INTO categories (name, slug, description)
VALUES ('Intervjui', 'intervjui', 'Razgovori s poznatim osobama')
ON CONFLICT (slug) DO NOTHING;
