import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type AppRole = 'admin' | 'instructor' | 'student';

export const useUserRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRoles();
    } else {
      setRoles([]);
      setLoading(false);
    }
  }, [user]);

  const fetchRoles = async () => {
    if (!user) return;

    try {
      console.log('Fetching roles for user:', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      console.log('Roles fetch result:', { data, error });
      
      if (error) throw error;
      const fetchedRoles = (data?.map((r) => r.role) as AppRole[]) || [];
      console.log('Setting roles:', fetchedRoles);
      setRoles(fetchedRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = roles.includes('admin');
  const isInstructor = roles.includes('instructor');
  const isStudent = roles.includes('student');

  const hasRole = (role: AppRole) => roles.includes(role);

  return {
    roles,
    loading,
    isAdmin,
    isInstructor,
    isStudent,
    hasRole,
    refetch: fetchRoles,
  };
};
