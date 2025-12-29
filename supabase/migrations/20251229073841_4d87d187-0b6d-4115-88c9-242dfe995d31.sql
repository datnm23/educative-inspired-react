-- Add approval status to courses table
ALTER TABLE public.courses 
ADD COLUMN approval_status text NOT NULL DEFAULT 'pending' 
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Add approval_notes for rejection reasons
ALTER TABLE public.courses 
ADD COLUMN approval_notes text;

-- Add approved_at timestamp
ALTER TABLE public.courses 
ADD COLUMN approved_at timestamp with time zone;

-- Add approved_by (admin who approved)
ALTER TABLE public.courses 
ADD COLUMN approved_by uuid;

-- Create instructor_applications table for instructor approval requests
CREATE TABLE public.instructor_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  full_name text NOT NULL,
  bio text,
  expertise text[],
  experience_years integer,
  portfolio_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on instructor_applications
ALTER TABLE public.instructor_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own application
CREATE POLICY "Users can view their own application"
ON public.instructor_applications
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own application
CREATE POLICY "Users can create their own application"
ON public.instructor_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending application
CREATE POLICY "Users can update their own pending application"
ON public.instructor_applications
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.instructor_applications
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Admins can update all applications
CREATE POLICY "Admins can update all applications"
ON public.instructor_applications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger to update updated_at
CREATE TRIGGER update_instructor_applications_updated_at
BEFORE UPDATE ON public.instructor_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();