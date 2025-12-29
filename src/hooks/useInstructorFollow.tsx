import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface InstructorFollow {
  id: string;
  user_id: string;
  instructor_id: string;
  created_at: string;
}

export const useInstructorFollow = () => {
  const { user } = useAuth();
  const [follows, setFollows] = useState<InstructorFollow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollows();
    } else {
      setFollows([]);
      setLoading(false);
    }
  }, [user]);

  const fetchFollows = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('instructor_follows')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setFollows(data || []);
    } catch (error) {
      console.error('Error fetching follows:', error);
    } finally {
      setLoading(false);
    }
  };

  const followInstructor = async (instructorId: string, instructorName: string) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để theo dõi giảng viên');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('instructor_follows')
        .insert({
          user_id: user.id,
          instructor_id: instructorId,
        })
        .select()
        .single();

      if (error) throw error;

      setFollows(prev => [...prev, data]);
      toast.success(`Đã theo dõi ${instructorName}`);
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast.info('Bạn đã theo dõi giảng viên này');
      } else {
        console.error('Error following instructor:', error);
        toast.error('Không thể theo dõi giảng viên');
      }
      return false;
    }
  };

  const unfollowInstructor = async (instructorId: string, instructorName: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('instructor_follows')
        .delete()
        .eq('user_id', user.id)
        .eq('instructor_id', instructorId);

      if (error) throw error;

      setFollows(prev => prev.filter(f => f.instructor_id !== instructorId));
      toast.success(`Đã hủy theo dõi ${instructorName}`);
      return true;
    } catch (error) {
      console.error('Error unfollowing instructor:', error);
      toast.error('Không thể hủy theo dõi');
      return false;
    }
  };

  const isFollowing = (instructorId: string) => {
    return follows.some(f => f.instructor_id === instructorId);
  };

  const getFollowCount = () => follows.length;

  return {
    follows,
    loading,
    followInstructor,
    unfollowInstructor,
    isFollowing,
    getFollowCount,
    refetch: fetchFollows,
  };
};