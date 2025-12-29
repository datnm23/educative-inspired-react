import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Users, Bell, TrendingUp, Edit, Trash2, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "",
    thumbnail: "",
  });

  // Redirect if not logged in
  if (!loading && !user) {
    navigate('/auth');
    return null;
  }

  const instructorId = "instructor-1"; // Mock instructor ID
  const instructorName = user?.email?.split('@')[0] || "Giảng viên";

  const stats = {
    totalStudents: courses.reduce((acc, c) => acc + c.students, 0),
    totalCourses: courses.length,
    avgRating: (courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1),
    totalRevenue: courses.reduce((acc, c) => acc + c.price * c.students * 0.7, 0),
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.price) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const courseId = `course-${Date.now()}`;
    const course: Course = {
      id: courseId,
      title: newCourse.title,
      description: newCourse.description,
      price: parseInt(newCourse.price),
      category: newCourse.category || "Khác",
      level: newCourse.level || "Cơ bản",
      thumbnail: newCourse.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
      students: 0,
      rating: 0,
      status: "published",
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCourses([course, ...courses]);
    setIsDialogOpen(false);
    setNewCourse({ title: "", description: "", price: "", category: "", level: "", thumbnail: "" });

    toast.success("Đã tạo khóa học mới!");

    // Send notification to followers
    await sendNotificationToFollowers(courseId, course.title);
  };

  const sendNotificationToFollowers = async (courseId: string, courseTitle: string) => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-course-notification', {
        body: {
          instructor_id: instructorId,
          instructor_name: instructorName,
          course_title: courseTitle,
          course_id: courseId,
        },
      });

      if (error) throw error;

      if (data?.notifications_sent > 0) {
        toast.success(`Đã gửi thông báo đến ${data.notifications_sent} người theo dõi`);
      } else {
        toast.info("Chưa có người theo dõi để gửi thông báo");
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast.error("Không thể gửi thông báo");
    } finally {
      setIsSending(false);
    }
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Tạo khóa học mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tạo khóa học mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin khóa học. Thông báo sẽ được gửi tự động đến người theo dõi.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Tên khóa học *</Label>
                  <Input
                    id="title"
                    placeholder="VD: React Master Class"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả *</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn về khóa học..."
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Giá (VND) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="1490000"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="level">Cấp độ</Label>
                    <Select
                      value={newCourse.level}
                      onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn cấp độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                        <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                        <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select
                    value={newCourse.category}
                    onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">URL ảnh bìa</Label>
                  <Input
                    id="thumbnail"
                    placeholder="https://..."
                    value={newCourse.thumbnail}
                    onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateCourse} disabled={isSending} className="gap-2">
                  {isSending ? (
                    <>Đang xử lý...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Tạo & Thông báo
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
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
