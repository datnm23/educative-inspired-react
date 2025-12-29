import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Shield,
  Trash2,
  UserPlus,
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Eye,
  EyeOff,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  level: string;
  thumbnail_url: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  duration_hours: number | null;
  total_lessons: number | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  rating: number | null;
  total_students: number | null;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  
  // Users state
  const [users, setUsers] = useState<UserData[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    short_description: "",
    price: "",
    original_price: "",
    category: "Frontend",
    level: "Cơ bản",
    thumbnail_url: "",
    instructor_name: "",
    duration_hours: "",
    total_lessons: "",
    is_published: false,
    is_featured: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    publishedCourses: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!roleLoading && user && !isAdmin) {
      toast.error("Bạn không có quyền truy cập trang này");
      navigate("/");
    }
  }, [roleLoading, isAdmin, user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchCourses();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const userRolesMap = new Map<string, string[]>();
      rolesData?.forEach((item) => {
        const existing = userRolesMap.get(item.user_id) || [];
        existing.push(item.role);
        userRolesMap.set(item.user_id, existing);
      });

      const uniqueUserIds = [...new Set(rolesData?.map((r) => r.user_id) || [])];
      const usersData: UserData[] = uniqueUserIds.map((userId) => ({
        id: userId,
        email: `user_${userId.slice(0, 8)}@example.com`,
        created_at: new Date().toISOString(),
        roles: userRolesMap.get(userId) || [],
      }));

      setUsers(usersData);
      setStats(prev => ({ ...prev, totalUsers: uniqueUserIds.length }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setCourses(data || []);
      setStats(prev => ({
        ...prev,
        totalCourses: data?.length || 0,
        publishedCourses: data?.filter(c => c.is_published).length || 0,
        totalRevenue: data?.reduce((acc, c) => acc + (c.price * (c.total_students || 0)), 0) || 0,
      }));
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async () => {
    if (!selectedUserId || !selectedRole) {
      toast.error("Vui lòng chọn vai trò");
      return;
    }

    try {
      const { error } = await supabase.from("user_roles").insert({
        user_id: selectedUserId,
        role: selectedRole as "admin" | "instructor" | "student",
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Người dùng đã có vai trò này");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Đã thêm vai trò thành công");
      setIsAddRoleDialogOpen(false);
      setSelectedUserId(null);
      setSelectedRole("");
      fetchUsers();
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("Không thể thêm vai trò");
    }
  };

  const handleRemoveRole = async (userId: string, role: "admin" | "instructor" | "student") => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      toast.success("Đã xóa vai trò");
      fetchUsers();
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error("Không thể xóa vai trò");
    }
  };

  // Course CRUD functions
  const openCourseDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setCourseForm({
        title: course.title,
        description: course.description || "",
        short_description: course.short_description || "",
        price: course.price.toString(),
        original_price: course.original_price?.toString() || "",
        category: course.category,
        level: course.level,
        thumbnail_url: course.thumbnail_url || "",
        instructor_name: course.instructor_name || "",
        duration_hours: course.duration_hours?.toString() || "",
        total_lessons: course.total_lessons?.toString() || "",
        is_published: course.is_published || false,
        is_featured: course.is_featured || false,
      });
    } else {
      setEditingCourse(null);
      setCourseForm({
        title: "",
        description: "",
        short_description: "",
        price: "",
        original_price: "",
        category: "Frontend",
        level: "Cơ bản",
        thumbnail_url: "",
        instructor_name: "",
        duration_hours: "",
        total_lessons: "",
        is_published: false,
        is_featured: false,
      });
    }
    setIsCourseDialogOpen(true);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.title || !courseForm.price) {
      toast.error("Vui lòng điền tên và giá khóa học");
      return;
    }

    try {
      const courseData = {
        title: courseForm.title,
        description: courseForm.description || null,
        short_description: courseForm.short_description || null,
        price: parseInt(courseForm.price),
        original_price: courseForm.original_price ? parseInt(courseForm.original_price) : null,
        category: courseForm.category,
        level: courseForm.level,
        thumbnail_url: courseForm.thumbnail_url || null,
        instructor_name: courseForm.instructor_name || null,
        duration_hours: courseForm.duration_hours ? parseInt(courseForm.duration_hours) : null,
        total_lessons: courseForm.total_lessons ? parseInt(courseForm.total_lessons) : null,
        is_published: courseForm.is_published,
        is_featured: courseForm.is_featured,
      };

      if (editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update(courseData)
          .eq("id", editingCourse.id);

        if (error) throw error;
        toast.success("Đã cập nhật khóa học");
      } else {
        const { error } = await supabase
          .from("courses")
          .insert(courseData);

        if (error) throw error;
        toast.success("Đã tạo khóa học mới");
      }

      setIsCourseDialogOpen(false);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Không thể lưu khóa học");
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;
      toast.success("Đã xóa khóa học");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Không thể xóa khóa học");
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_published: !course.is_published })
        .eq("id", course.id);

      if (error) throw error;
      toast.success(course.is_published ? "Đã ẩn khóa học" : "Đã xuất bản khóa học");
      fetchCourses();
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleToggleFeatured = async (course: Course) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ is_featured: !course.is_featured })
        .eq("id", course.id);

      if (error) throw error;
      toast.success(course.is_featured ? "Đã bỏ nổi bật" : "Đã đánh dấu nổi bật");
      fetchCourses();
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error("Không thể cập nhật");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "instructor":
        return "default";
      default:
        return "secondary";
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Bảng điều khiển Admin
            </h1>
          </div>
          <p className="text-muted-foreground">
            Quản lý người dùng, khóa học và hệ thống
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Người dùng có vai trò</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng khóa học</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.publishedCourses} đã xuất bản
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu ước tính</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khóa học đã xuất bản</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publishedCourses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="courses">Quản lý khóa học</TabsTrigger>
            <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
            <TabsTrigger value="roles">Phân quyền</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <CardTitle>Danh sách khóa học</CardTitle>
                    <CardDescription>
                      Quản lý tất cả khóa học trong hệ thống
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm..."
                        className="pl-9 w-64"
                        value={courseSearchTerm}
                        onChange={(e) => setCourseSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button onClick={() => openCourseDialog()} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Thêm khóa học
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có khóa học nào</p>
                    <Button className="mt-4" onClick={() => openCourseDialog()}>
                      Tạo khóa học đầu tiên
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khóa học</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Học viên</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {course.thumbnail_url && (
                                <img
                                  src={course.thumbnail_url}
                                  alt={course.title}
                                  className="w-16 h-10 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{course.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {course.instructor_name || "Chưa có giảng viên"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{course.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatCurrency(course.price)}</p>
                              {course.original_price && (
                                <p className="text-xs text-muted-foreground line-through">
                                  {formatCurrency(course.original_price)}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{course.total_students || 0}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {course.is_published ? (
                                <Badge variant="default">Đã xuất bản</Badge>
                              ) : (
                                <Badge variant="secondary">Bản nháp</Badge>
                              )}
                              {course.is_featured && (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                                  <Star className="w-3 h-3 mr-1" />
                                  Nổi bật
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openCourseDialog(course)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTogglePublish(course)}>
                                  {course.is_published ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Ẩn khóa học
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Xuất bản
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleFeatured(course)}>
                                  <Star className="w-4 h-4 mr-2" />
                                  {course.is_featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa khóa học
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <CardTitle>Danh sách người dùng</CardTitle>
                    <CardDescription>
                      Quản lý tài khoản và quyền truy cập
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm..."
                      className="pl-9 w-64"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có người dùng nào có vai trò</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((userData) => (
                        <TableRow key={userData.id}>
                          <TableCell className="font-mono text-sm">
                            {userData.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {userData.roles.map((role) => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)}>
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUserId(userData.id);
                                    setIsAddRoleDialogOpen(true);
                                  }}
                                >
                                  <UserPlus className="w-4 h-4 mr-2" />
                                  Thêm vai trò
                                </DropdownMenuItem>
                                {userData.roles.map((role) => (
                                  <DropdownMenuItem
                                    key={role}
                                    onClick={() =>
                                      handleRemoveRole(userData.id, role as "admin" | "instructor" | "student")
                                    }
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Xóa vai trò {role}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý vai trò</CardTitle>
                <CardDescription>
                  Cấp quyền admin hoặc instructor cho người dùng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-destructive/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="w-5 h-5 text-destructive" />
                          Admin
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Quyền cao nhất. Có thể quản lý người dùng, khóa học, và toàn bộ hệ thống.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Instructor
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Có thể tạo và quản lý khóa học của mình, xem thống kê học viên.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Student
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Người dùng thường. Có thể đăng ký và học các khóa học.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-medium mb-2">Thêm vai trò cho người dùng</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập User ID..."
                        value={selectedUserId || ""}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="max-w-xs font-mono"
                      />
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="instructor">Instructor</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddRole}>Thêm vai trò</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Role Dialog */}
        <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm vai trò</DialogTitle>
              <DialogDescription>
                Chọn vai trò để cấp cho người dùng này
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>Vai trò</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddRole}>Thêm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Course Dialog */}
        <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết cho khóa học
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên khóa học *</Label>
                <Input
                  id="title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="VD: React Master Class"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="short_description">Mô tả ngắn</Label>
                <Input
                  id="short_description"
                  value={courseForm.short_description}
                  onChange={(e) => setCourseForm({ ...courseForm, short_description: e.target.value })}
                  placeholder="Mô tả ngắn gọn về khóa học..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Mô tả đầy đủ về nội dung khóa học..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Giá (VND) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    placeholder="1490000"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="original_price">Giá gốc (VND)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={courseForm.original_price}
                    onChange={(e) => setCourseForm({ ...courseForm, original_price: e.target.value })}
                    placeholder="1990000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Danh mục</Label>
                  <Select
                    value={courseForm.category}
                    onValueChange={(value) => setCourseForm({ ...courseForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Cấp độ</Label>
                  <Select
                    value={courseForm.level}
                    onValueChange={(value) => setCourseForm({ ...courseForm, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                      <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                      <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration_hours">Thời lượng (giờ)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    value={courseForm.duration_hours}
                    onChange={(e) => setCourseForm({ ...courseForm, duration_hours: e.target.value })}
                    placeholder="40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="total_lessons">Số bài học</Label>
                  <Input
                    id="total_lessons"
                    type="number"
                    value={courseForm.total_lessons}
                    onChange={(e) => setCourseForm({ ...courseForm, total_lessons: e.target.value })}
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instructor_name">Tên giảng viên</Label>
                <Input
                  id="instructor_name"
                  value={courseForm.instructor_name}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid gap-2">
                <Label>Ảnh bìa khóa học</Label>
                <ImageUpload
                  value={courseForm.thumbnail_url}
                  onChange={(url) => setCourseForm({ ...courseForm, thumbnail_url: url })}
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_published"
                    checked={courseForm.is_published}
                    onCheckedChange={(checked) => setCourseForm({ ...courseForm, is_published: checked })}
                  />
                  <Label htmlFor="is_published">Xuất bản ngay</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="is_featured"
                    checked={courseForm.is_featured}
                    onCheckedChange={(checked) => setCourseForm({ ...courseForm, is_featured: checked })}
                  />
                  <Label htmlFor="is_featured">Đánh dấu nổi bật</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCourseDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSaveCourse}>
                {editingCourse ? "Cập nhật" : "Tạo khóa học"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
