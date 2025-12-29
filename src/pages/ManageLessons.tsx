import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, GripVertical, Edit, Trash2, Video, Clock, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_minutes: number | null;
  order_index: number;
  is_free: boolean | null;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  instructor_id: string | null;
}

const ManageLessons = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [deleteLesson, setDeleteLesson] = useState<Lesson | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    duration_minutes: 0,
    is_free: false,
  });

  useEffect(() => {
    if (user && courseId) {
      fetchCourseAndLessons();
    }
  }, [user, courseId]);

  const fetchCourseAndLessons = async () => {
    if (!courseId) return;
    
    setLoading(true);
    
    // Fetch course
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('id, title, instructor_id')
      .eq('id', courseId)
      .maybeSingle();

    if (courseError || !courseData) {
      toast.error('Không tìm thấy khóa học');
      navigate('/instructor-dashboard');
      return;
    }

    // Check if user owns this course
    if (courseData.instructor_id !== user?.id) {
      toast.error('Bạn không có quyền quản lý khóa học này');
      navigate('/instructor-dashboard');
      return;
    }

    setCourse(courseData);

    // Fetch lessons
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
      toast.error('Không thể tải danh sách bài học');
    } else {
      setLessons(lessonsData || []);
    }

    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingLesson(null);
    setFormData({
      title: "",
      description: "",
      video_url: "",
      duration_minutes: 0,
      is_free: false,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      video_url: lesson.video_url || "",
      duration_minutes: lesson.duration_minutes || 0,
      is_free: lesson.is_free || false,
    });
    setIsDialogOpen(true);
  };

  const handleSaveLesson = async () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài học');
      return;
    }

    setSaving(true);

    if (editingLesson) {
      // Update existing lesson
      const { error } = await supabase
        .from('lessons')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          video_url: formData.video_url.trim() || null,
          duration_minutes: formData.duration_minutes,
          is_free: formData.is_free,
        })
        .eq('id', editingLesson.id);

      if (error) {
        console.error('Error updating lesson:', error);
        toast.error('Không thể cập nhật bài học');
      } else {
        toast.success('Đã cập nhật bài học');
        fetchCourseAndLessons();
        setIsDialogOpen(false);
      }
    } else {
      // Create new lesson
      const newOrderIndex = lessons.length > 0 
        ? Math.max(...lessons.map(l => l.order_index)) + 1 
        : 0;

      const { error } = await supabase
        .from('lessons')
        .insert({
          course_id: courseId,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          video_url: formData.video_url.trim() || null,
          duration_minutes: formData.duration_minutes,
          is_free: formData.is_free,
          order_index: newOrderIndex,
        });

      if (error) {
        console.error('Error creating lesson:', error);
        toast.error('Không thể tạo bài học');
      } else {
        toast.success('Đã thêm bài học mới');
        fetchCourseAndLessons();
        setIsDialogOpen(false);
      }
    }

    setSaving(false);
  };

  const handleDeleteLesson = async () => {
    if (!deleteLesson) return;

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', deleteLesson.id);

    if (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Không thể xóa bài học');
    } else {
      toast.success('Đã xóa bài học');
      setLessons(lessons.filter(l => l.id !== deleteLesson.id));
    }

    setDeleteLesson(null);
  };

  const moveLesson = async (lessonId: string, direction: 'up' | 'down') => {
    const currentIndex = lessons.findIndex(l => l.id === lessonId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= lessons.length) return;

    const updatedLessons = [...lessons];
    const temp = updatedLessons[currentIndex];
    updatedLessons[currentIndex] = updatedLessons[newIndex];
    updatedLessons[newIndex] = temp;

    // Update order_index for both lessons
    const updates = [
      { id: updatedLessons[currentIndex].id, order_index: currentIndex },
      { id: updatedLessons[newIndex].id, order_index: newIndex },
    ];

    for (const update of updates) {
      await supabase
        .from('lessons')
        .update({ order_index: update.order_index })
        .eq('id', update.id);
    }

    setLessons(updatedLessons.map((l, i) => ({ ...l, order_index: i })));
  };

  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="gap-2 mb-4"
            onClick={() => navigate('/instructor-dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quản lý bài học</h1>
              {course && (
                <p className="text-muted-foreground mt-1">Khóa học: {course.title}</p>
              )}
            </div>

            <Button className="gap-2" onClick={openAddDialog}>
              <Plus className="w-4 h-4" />
              Thêm bài học
            </Button>
          </div>
        </div>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài học ({lessons.length})</CardTitle>
            <CardDescription>Kéo thả để sắp xếp thứ tự bài học</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Đang tải...
              </div>
            ) : lessons.length > 0 ? (
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === 0}
                        onClick={() => moveLesson(lesson.id, 'up')}
                      >
                        <span className="text-xs">▲</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === lessons.length - 1}
                        onClick={() => moveLesson(lesson.id, 'down')}
                      >
                        <span className="text-xs">▼</span>
                      </Button>
                    </div>

                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                        {lesson.is_free && (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Miễn phí
                          </Badge>
                        )}
                      </div>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {lesson.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {lesson.video_url && (
                          <span className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Có video
                          </span>
                        )}
                        {lesson.duration_minutes && lesson.duration_minutes > 0 && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.duration_minutes} phút
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => openEditDialog(lesson)}
                      >
                        <Edit className="w-3 h-3" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => setDeleteLesson(lesson)}
                      >
                        <Trash2 className="w-3 h-3" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có bài học nào</p>
                <Button className="mt-4" onClick={openAddDialog}>
                  Thêm bài học đầu tiên
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add/Edit Lesson Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
            </DialogTitle>
            <DialogDescription>
              {editingLesson 
                ? "Cập nhật thông tin bài học" 
                : "Điền thông tin để tạo bài học mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề bài học *</Label>
              <Input
                id="title"
                placeholder="VD: Giới thiệu về React"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả ngắn về nội dung bài học..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url">URL Video</Label>
              <Input
                id="video_url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Thời lượng (phút)</Label>
              <Input
                id="duration"
                type="number"
                min={0}
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Bài học miễn phí</Label>
                <p className="text-xs text-muted-foreground">
                  Cho phép xem trước miễn phí
                </p>
              </div>
              <Switch
                checked={formData.is_free}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveLesson} disabled={saving}>
              {saving ? "Đang lưu..." : editingLesson ? "Cập nhật" : "Thêm bài học"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteLesson} onOpenChange={() => setDeleteLesson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài học?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài học "{deleteLesson?.title}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLesson}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default ManageLessons;