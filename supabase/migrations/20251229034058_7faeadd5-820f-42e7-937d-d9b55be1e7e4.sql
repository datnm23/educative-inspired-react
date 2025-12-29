
-- Create course_enrollments table to track purchased courses
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Create lesson_progress table to track learning progress
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for course_enrollments
CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses"
ON public.course_enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their enrollments"
ON public.course_enrollments
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for lesson_progress
CREATE POLICY "Users can view their own progress"
ON public.lesson_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add progress"
ON public.lesson_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their progress"
ON public.lesson_progress
FOR DELETE
USING (auth.uid() = user_id);
