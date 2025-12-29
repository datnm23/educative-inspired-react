-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-images', 'course-images', true);

-- Allow anyone to view course images (public bucket)
CREATE POLICY "Anyone can view course images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-images');

-- Admins can upload course images
CREATE POLICY "Admins can upload course images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Instructors can upload course images
CREATE POLICY "Instructors can upload course images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'course-images' 
  AND public.has_role(auth.uid(), 'instructor')
);

-- Admins can update course images
CREATE POLICY "Admins can update course images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'course-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Admins can delete course images
CREATE POLICY "Admins can delete course images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'course-images' 
  AND public.has_role(auth.uid(), 'admin')
);