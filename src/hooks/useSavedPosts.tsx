import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const useSavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSavedPosts();
    } else {
      setSavedPosts([]);
      setLoading(false);
    }
  }, [user]);

  const fetchSavedPosts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setSavedPosts(data?.map((item) => item.post_id) || []);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSavePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để lưu bài viết yêu thích.",
        variant: "destructive",
      });
      return;
    }

    const isSaved = savedPosts.includes(postId);

    try {
      if (isSaved) {
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);

        if (error) throw error;
        setSavedPosts(savedPosts.filter((id) => id !== postId));
        toast({
          title: "Đã bỏ lưu",
          description: "Bài viết đã được xóa khỏi danh sách yêu thích.",
        });
      } else {
        const { error } = await supabase
          .from("saved_posts")
          .insert({ user_id: user.id, post_id: postId });

        if (error) throw error;
        setSavedPosts([...savedPosts, postId]);
        toast({
          title: "Đã lưu",
          description: "Bài viết đã được thêm vào danh sách yêu thích.",
        });
      }
    } catch (error) {
      console.error("Error toggling save post:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thực hiện thao tác. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const isPostSaved = (postId: string) => savedPosts.includes(postId);

  return {
    savedPosts,
    loading,
    toggleSavePost,
    isPostSaved,
  };
};
