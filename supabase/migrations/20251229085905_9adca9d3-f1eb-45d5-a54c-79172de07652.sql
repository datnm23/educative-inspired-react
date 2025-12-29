-- Create lessons table
CREATE TABLE public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  duration_minutes integer DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0,
  is_free boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Anyone can view lessons of published courses
CREATE POLICY "Anyone can view lessons of published courses"
ON public.lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id 
    AND courses.is_published = true
  )
);

-- Instructors can view their own course lessons
CREATE POLICY "Instructors can view their own lessons"
ON public.lessons
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id 
    AND courses.instructor_id = auth.uid()
  )
);

-- Instructors can insert lessons for their own courses
CREATE POLICY "Instructors can insert lessons"
ON public.lessons
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id 
    AND courses.instructor_id = auth.uid()
    AND has_role(auth.uid(), 'instructor'::app_role)
  )
);

-- Instructors can update their own course lessons
CREATE POLICY "Instructors can update their own lessons"
ON public.lessons
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id 
    AND courses.instructor_id = auth.uid()
    AND has_role(auth.uid(), 'instructor'::app_role)
  )
);

-- Instructors can delete their own course lessons
CREATE POLICY "Instructors can delete their own lessons"
ON public.lessons
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.courses 
    WHERE courses.id = lessons.course_id 
    AND courses.instructor_id = auth.uid()
    AND has_role(auth.uid(), 'instructor'::app_role)
  )
);

-- Admins can do everything with lessons
CREATE POLICY "Admins can manage all lessons"
ON public.lessons
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();