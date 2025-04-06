
-- Create a storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('profile-photos', 'profile-photos', true, false);

-- Set up a policy to allow authenticated users to upload their own profile photos
CREATE POLICY "Allow users to upload their own profile photo" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  name = auth.uid()::text
);

-- Allow users to update their own profile photos
CREATE POLICY "Allow users to update their own profile photo" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  name = auth.uid()::text
);

-- Allow anyone to view profile photos (since they're public)
CREATE POLICY "Allow public to view profile photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'profile-photos');

-- Allow users to delete their own profile photos
CREATE POLICY "Allow users to delete their own profile photo" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  name = auth.uid()::text
);
