import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Users, Bell, TrendingUp, Edit, Trash2, ListVideo } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  level: string;
  thumbnail_url: string | null;
  total_students: number | null;
  rating: number | null;
  is_published: boolean | null;
  approval_status: string;
  created_at: string;
}

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    if (!user) return;
    
    setLoadingCourses(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      toast.error('Không thể tải danh sách khóa học');
    } else {
      setCourses(data || []);
    }
    setLoadingCourses(false);
  };

  // Redirect if not logged in
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const stats = {
    totalStudents: courses.reduce((acc, c) => acc + (c.total_students || 0), 0),
    totalCourses: courses.length,
    avgRating: courses.length > 0 
      ? (courses.reduce((acc, c) => acc + (c.rating || 0), 0) / courses.length).toFixed(1) 
      : "0.0",
    totalRevenue: courses.reduce((acc, c) => acc + c.price * (c.total_students || 0) * 0.7, 0),
  };

  const handleDeleteCourse = async (courseId: string) => {
    setDeletingId(courseId);
    
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
      toast.error('Không thể xóa khóa học');
    } else {
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success('Đã xóa khóa học thành công');
    }
    
    setDeletingId(null);
  };

  const getStatusBadge = (course: Course) => {
    if (course.approval_status === 'pending') {
      return <Badge variant="secondary">Chờ duyệt</Badge>;
    }
    if (course.approval_status === 'rejected') {
      return <Badge variant="destructive">Bị từ chối</Badge>;
    }
    if (course.is_published) {
      return <Badge variant="default">Đã xuất bản</Badge>;
    }
    return <Badge variant="secondary">Bản nháp</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bảng điều khiển giảng viên</h1>
            <p className="text-muted-foreground mt-1">Quản lý khóa học và theo dõi hiệu suất</p>
          </div>

          <Button className="gap-2" onClick={() => navigate("/instructor/create-course")}>
            <Plus className="w-4 h-4" />
            Tạo khóa học mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng học viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Số khóa học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">Đang hoạt động</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating} ⭐</div>
              <p className="text-xs text-muted-foreground">Từ {stats.totalStudents} đánh giá</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Sau phí nền tảng (30%)</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <Card>
          <CardHeader>
            <CardTitle>Khóa học của bạn</CardTitle>
            <CardDescription>Quản lý và chỉnh sửa các khóa học đã tạo</CardDescription>
          </CardHeader>
          <CardContent>
              {loadingCourses ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Đang tải khóa học...</p>
                </div>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <img
                      src={course.thumbnail_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400"}
                      alt={course.title}
                      className="w-full md:w-40 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                        </div>
                        {getStatusBadge(course)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span>{course.total_students || 0} học viên</span>
                        <span>{course.rating || 0} ⭐</span>
                        <span>{formatCurrency(course.price)}</span>
                        <Badge variant="outline">{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
                      >
                        <ListVideo className="w-3 h-3" />
                        Bài học
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                      >
                        <Edit className="w-3 h-3" />
                        Sửa
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-destructive hover:text-destructive"
                            disabled={deletingId === course.id}
                          >
                            <Trash2 className="w-3 h-3" />
                            {deletingId === course.id ? "Đang xóa..." : "Xóa"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa khóa học?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa khóa học "{course.title}"? Hành động này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteCourse(course.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Bạn chưa có khóa học nào</p>
                  <Button className="mt-4" onClick={() => navigate("/instructor/create-course")}>
                    Tạo khóa học đầu tiên
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorDashboard;
