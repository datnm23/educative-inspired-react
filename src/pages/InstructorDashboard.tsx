import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Users, Bell, TrendingUp, Edit, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  thumbnail: string;
  students: number;
  rating: number;
  status: "draft" | "published";
  createdAt: string;
}

// Mock data for demo
const mockCourses: Course[] = [
  {
    id: "1",
    title: "React & TypeScript Master Class",
    description: "Học React và TypeScript từ cơ bản đến nâng cao",
    price: 1490000,
    category: "Frontend",
    level: "Trung cấp",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    students: 1250,
    rating: 4.8,
    status: "published",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Node.js Backend Development",
    description: "Xây dựng API với Node.js và Express",
    price: 1290000,
    category: "Backend",
    level: "Cơ bản",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    students: 890,
    rating: 4.6,
    status: "published",
    createdAt: "2024-02-20",
  },
];

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  // Redirect if not logged in
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const stats = {
    totalStudents: courses.reduce((acc, c) => acc + c.students, 0),
    totalCourses: courses.length,
    avgRating: (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1),
    totalRevenue: courses.reduce((acc, c) => acc + c.price * c.students * 0.7, 0),
  };


  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter(c => c.id !== courseId));
    toast.success("Đã xóa khóa học");
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
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full md:w-40 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                      </div>
                      <Badge variant={course.status === "published" ? "default" : "secondary"}>
                        {course.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>{course.students} học viên</span>
                      <span>{course.rating} ⭐</span>
                      <span>{formatCurrency(course.price)}</span>
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa
                    </Button>
                  </div>
                </div>
              ))}

              {courses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Bạn chưa có khóa học nào</p>
                  <Button className="mt-4" onClick={() => navigate("/instructor/create-course")}>
                    Tạo khóa học đầu tiên
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default InstructorDashboard;
