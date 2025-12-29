import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface CourseEnrollment {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
}

interface LessonProgress {
  id: string;
  course_id: string;
  lesson_id: string;
  completed_at: string;
}

export const useCourseProgress = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    if (!user) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('user_id', user.id)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
    } else {
      setEnrollments(data || []);
    }
  };

  const fetchLessonProgress = async () => {
    if (!user) {
      setLessonProgress([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching lesson progress:', error);
    } else {
      setLessonProgress(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchEnrollments();
      fetchLessonProgress();
    } else {
      setEnrollments([]);
      setLessonProgress([]);
      setLoading(false);
    }
  }, [user]);

  const enrollInCourse = async (courseId: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đăng ký khóa học');
      return false;
    }

    const { error } = await supabase
      .from('course_enrollments')
      .insert({ user_id: user.id, course_id: courseId });

    if (error) {
      if (error.code === '23505') {
        toast.info('Bạn đã đăng ký khóa học này rồi');
      } else {
        console.error('Error enrolling:', error);
        toast.error('Không thể đăng ký khóa học');
      }
      return false;
    }

    toast.success('Đăng ký khóa học thành công!');
    await fetchEnrollments();
    return true;
  };

  const markLessonComplete = async (courseId: string, lessonId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('lesson_progress')
      .insert({ user_id: user.id, course_id: courseId, lesson_id: lessonId });

    if (error) {
      if (error.code !== '23505') {
        console.error('Error marking lesson complete:', error);
      }
      return false;
    }

    await fetchLessonProgress();
    return true;
  };

  const getCompletedLessonsForCourse = (courseId: string) => {
    return lessonProgress.filter(p => p.course_id === courseId).length;
  };

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    const completed = getCompletedLessonsForCourse(courseId);
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  };

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    return lessonProgress.some(p => p.course_id === courseId && p.lesson_id === lessonId);
  };

  return {
    enrollments,
    lessonProgress,
    loading,
    enrollInCourse,
    markLessonComplete,
    getCompletedLessonsForCourse,
    getCourseProgress,
    isEnrolled,
    isLessonCompleted,
    refetch: () => {
      fetchEnrollments();
      fetchLessonProgress();
    }
  };
};
