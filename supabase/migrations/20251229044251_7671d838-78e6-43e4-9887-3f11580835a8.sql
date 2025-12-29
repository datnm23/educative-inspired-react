-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price BIGINT NOT NULL DEFAULT 0,
  original_price BIGINT,
  category TEXT NOT NULL DEFAULT 'Khác',
  level TEXT NOT NULL DEFAULT 'Cơ bản',
  thumbnail_url TEXT,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  instructor_name TEXT,
  duration_hours INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  rating NUMERIC(2,1) DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view published courses
CREATE POLICY "Anyone can view published courses"
ON public.courses
FOR SELECT
USING (is_published = true);

-- Admins can view all courses
CREATE POLICY "Admins can view all courses"
ON public.courses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Instructors can view their own courses
CREATE POLICY "Instructors can view their own courses"
ON public.courses
FOR SELECT
USING (auth.uid() = instructor_id);

-- Admins can insert courses
CREATE POLICY "Admins can insert courses"
ON public.courses
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Instructors can insert their own courses
CREATE POLICY "Instructors can insert their own courses"
ON public.courses
FOR INSERT
WITH CHECK (auth.uid() = instructor_id AND public.has_role(auth.uid(), 'instructor'));

-- Admins can update any course
CREATE POLICY "Admins can update courses"
ON public.courses
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Instructors can update their own courses
CREATE POLICY "Instructors can update their own courses"
ON public.courses
FOR UPDATE
USING (auth.uid() = instructor_id AND public.has_role(auth.uid(), 'instructor'));

-- Admins can delete courses
CREATE POLICY "Admins can delete courses"
ON public.courses
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();