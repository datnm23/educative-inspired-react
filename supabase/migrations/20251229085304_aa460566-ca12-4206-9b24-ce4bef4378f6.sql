-- Add DELETE policy for instructors to delete their own courses
CREATE POLICY "Instructors can delete their own courses" 
ON public.courses 
FOR DELETE 
USING ((auth.uid() = instructor_id) AND has_role(auth.uid(), 'instructor'::app_role));