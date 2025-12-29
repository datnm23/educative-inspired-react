import { useState, useEffect, useMemo } from "react";
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
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  FileSpreadsheet,
  BarChart3,
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
import AdminCharts from "@/components/admin/AdminCharts";
import Pagination from "@/components/admin/Pagination";

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
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFeatured, setFilterFeatured] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);
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
  const [showCharts, setShowCharts] = useState(true);
  
  // Pagination state for courses
  const [courseCurrentPage, setCourseCurrentPage] = useState(1);
  const [coursePageSize, setCoursePageSize] = useState(10);
  
  // Pagination state for users
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [userPageSize, setUserPageSize] = useState(10);

  // Revenue time filter
  const [revenueTimeFilter, setRevenueTimeFilter] = useState<string>("all");
  // Published courses time filter
  const [publishedTimeFilter, setPublishedTimeFilter] = useState<string>("all");

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    publishedCourses: 0,
  });

  // Enrollments for revenue calculation
  const [enrollments, setEnrollments] = useState<{ course_id: string; enrolled_at: string }[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    // Only check permission after both auth and role loading are complete
    if (!authLoading && !roleLoading && user && !isAdmin) {
      console.log('Permission check failed - isAdmin:', isAdmin, 'roleLoading:', roleLoading);
      toast.error("Bạn không có quyền truy cập trang này");
      navigate("/");
    }
  }, [authLoading, roleLoading, isAdmin, user, navigate]);

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

      // Fetch enrollments for time-based revenue
      const { data: enrollmentData } = await supabase
        .from("course_enrollments")
        .select("course_id, enrolled_at");
      
      setEnrollments(enrollmentData || []);
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

  const filteredCourses = courses.filter((c) => {
    // Search filter
    const matchesSearch =
      c.title.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
      (c.instructor_name?.toLowerCase().includes(courseSearchTerm.toLowerCase()) ?? false) ||
      (c.description?.toLowerCase().includes(courseSearchTerm.toLowerCase()) ?? false);

    // Category filter
    const matchesCategory = filterCategory === "all" || c.category === filterCategory;

    // Level filter
    const matchesLevel = filterLevel === "all" || c.level === filterLevel;

    // Status filter
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && c.is_published) ||
      (filterStatus === "draft" && !c.is_published);

    // Featured filter
    const matchesFeatured =
      filterFeatured === "all" ||
      (filterFeatured === "featured" && c.is_featured) ||
      (filterFeatured === "normal" && !c.is_featured);

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus && matchesFeatured;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "students-high":
        return (b.total_students || 0) - (a.total_students || 0);
      case "students-low":
        return (a.total_students || 0) - (b.total_students || 0);
      case "rating-high":
        return (b.rating || 0) - (a.rating || 0);
      case "title-asc":
        return a.title.localeCompare(b.title, 'vi');
      case "title-desc":
        return b.title.localeCompare(a.title, 'vi');
      default:
        return 0;
    }
  });

  // Calculate filtered revenue based on time filter
  const filteredRevenue = useMemo(() => {
    if (revenueTimeFilter === "all") {
      return stats.totalRevenue;
    }

    const now = new Date();
    let startDate: Date;

    switch (revenueTimeFilter) {
      case "7d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "3m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "6m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "1y":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return stats.totalRevenue;
    }

    // Create a map of course prices
    const courseMap = new Map(courses.map(c => [c.id, c.price]));

    // Filter enrollments by date and sum revenue
    return enrollments
      .filter(e => new Date(e.enrolled_at) >= startDate)
      .reduce((acc, e) => acc + (courseMap.get(e.course_id) || 0), 0);
  }, [revenueTimeFilter, stats.totalRevenue, enrollments, courses]);

  const revenueTimeLabels: Record<string, string> = {
    "all": "Tất cả",
    "7d": "7 ngày",
    "30d": "30 ngày",
    "3m": "3 tháng",
    "6m": "6 tháng",
    "1y": "1 năm"
  };

  // Calculate filtered published courses based on time filter
  const filteredPublishedCourses = useMemo(() => {
    const publishedCourses = courses.filter(c => c.is_published);
    
    if (publishedTimeFilter === "all") {
      return publishedCourses.length;
    }

    const now = new Date();
    let startDate: Date;

    switch (publishedTimeFilter) {
      case "7d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "3m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "6m":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "1y":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return publishedCourses.length;
    }

    return publishedCourses.filter(c => new Date(c.created_at) >= startDate).length;
  }, [publishedTimeFilter, courses]);

  // Paginated courses
  const paginatedCourses = useMemo(() => {
    const startIndex = (courseCurrentPage - 1) * coursePageSize;
    return sortedCourses.slice(startIndex, startIndex + coursePageSize);
  }, [sortedCourses, courseCurrentPage, coursePageSize]);

  const totalCoursePages = Math.ceil(sortedCourses.length / coursePageSize);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (userCurrentPage - 1) * userPageSize;
    return filteredUsers.slice(startIndex, startIndex + userPageSize);
  }, [filteredUsers, userCurrentPage, userPageSize]);

  const totalUserPages = Math.ceil(filteredUsers.length / userPageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCourseCurrentPage(1);
  }, [courseSearchTerm, filterCategory, filterLevel, filterStatus, filterFeatured, sortBy]);

  useEffect(() => {
    setUserCurrentPage(1);
  }, [userSearchTerm]);

  const clearFilters = () => {
    setCourseSearchTerm("");
    setFilterCategory("all");
    setFilterLevel("all");
    setFilterStatus("all");
    setFilterFeatured("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    courseSearchTerm !== "" ||
    filterCategory !== "all" ||
    filterLevel !== "all" ||
    filterStatus !== "all" ||
    filterFeatured !== "all" ||
    sortBy !== "newest";

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Tên khóa học",
      "Mô tả ngắn",
      "Danh mục",
      "Cấp độ",
      "Giá (VND)",
      "Giá gốc (VND)",
      "Giảng viên",
      "Thời lượng (giờ)",
      "Số bài học",
      "Số học viên",
      "Đánh giá",
      "Trạng thái",
      "Nổi bật",
      "Ngày tạo",
      "Ngày cập nhật",
    ];

    const csvData = sortedCourses.map((course) => [
      course.id,
      course.title,
      course.short_description || "",
      course.category,
      course.level,
      course.price,
      course.original_price || "",
      course.instructor_name || "",
      course.duration_hours || "",
      course.total_lessons || "",
      course.total_students || 0,
      course.rating || 0,
      course.is_published ? "Đã xuất bản" : "Bản nháp",
      course.is_featured ? "Có" : "Không",
      new Date(course.created_at).toLocaleDateString("vi-VN"),
      new Date(course.updated_at).toLocaleDateString("vi-VN"),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        row.map((cell) => {
          const cellStr = String(cell);
          // Escape quotes and wrap in quotes if contains comma or quote
          if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(",")
      ),
    ].join("\n");

    // Add BOM for UTF-8
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-khoa-hoc-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Đã xuất ${sortedCourses.length} khóa học ra file CSV`);
  };

  const exportToExcel = () => {
    const headers = [
      "ID",
      "Tên khóa học",
      "Mô tả ngắn",
      "Danh mục",
      "Cấp độ",
      "Giá (VND)",
      "Giá gốc (VND)",
      "Giảng viên",
      "Thời lượng (giờ)",
      "Số bài học",
      "Số học viên",
      "Đánh giá",
      "Trạng thái",
      "Nổi bật",
      "Ngày tạo",
      "Ngày cập nhật",
    ];

    const data = sortedCourses.map((course) => ({
      ID: course.id,
      "Tên khóa học": course.title,
      "Mô tả ngắn": course.short_description || "",
      "Danh mục": course.category,
      "Cấp độ": course.level,
      "Giá (VND)": course.price,
      "Giá gốc (VND)": course.original_price || "",
      "Giảng viên": course.instructor_name || "",
      "Thời lượng (giờ)": course.duration_hours || "",
      "Số bài học": course.total_lessons || "",
      "Số học viên": course.total_students || 0,
      "Đánh giá": course.rating || 0,
      "Trạng thái": course.is_published ? "Đã xuất bản" : "Bản nháp",
      "Nổi bật": course.is_featured ? "Có" : "Không",
      "Ngày tạo": new Date(course.created_at).toLocaleDateString("vi-VN"),
      "Ngày cập nhật": new Date(course.updated_at).toLocaleDateString("vi-VN"),
    }));

    // Create XML for Excel
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<?mso-application progid="Excel.Sheet"?>\n';
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
    xml += '<Worksheet ss:Name="Báo cáo khóa học">\n';
    xml += '<Table>\n';

    // Header row
    xml += '<Row>\n';
    headers.forEach((header) => {
      xml += `<Cell><Data ss:Type="String">${header}</Data></Cell>\n`;
    });
    xml += '</Row>\n';

    // Data rows
    data.forEach((row) => {
      xml += '<Row>\n';
      headers.forEach((header) => {
        const value = row[header as keyof typeof row];
        const type = typeof value === "number" ? "Number" : "String";
        xml += `<Cell><Data ss:Type="${type}">${value}</Data></Cell>\n`;
      });
      xml += '</Row>\n';
    });

    xml += '</Table>\n';
    xml += '</Worksheet>\n';
    xml += '</Workbook>';

    const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao-cao-khoa-hoc-${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Đã xuất ${sortedCourses.length} khóa học ra file Excel`);
  };

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
              <Select value={revenueTimeFilter} onValueChange={setRevenueTimeFilter}>
                <SelectTrigger className="w-[100px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="30d">30 ngày</SelectItem>
                  <SelectItem value="3m">3 tháng</SelectItem>
                  <SelectItem value="6m">6 tháng</SelectItem>
                  <SelectItem value="1y">1 năm</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(filteredRevenue)}</div>
              {revenueTimeFilter !== "all" && (
                <p className="text-xs text-muted-foreground">
                  Trong {revenueTimeLabels[revenueTimeFilter]}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khóa học đã xuất bản</CardTitle>
              <Select value={publishedTimeFilter} onValueChange={setPublishedTimeFilter}>
                <SelectTrigger className="w-[100px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="30d">30 ngày</SelectItem>
                  <SelectItem value="3m">3 tháng</SelectItem>
                  <SelectItem value="6m">6 tháng</SelectItem>
                  <SelectItem value="1y">1 năm</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPublishedCourses}</div>
              {publishedTimeFilter !== "all" && (
                <p className="text-xs text-muted-foreground">
                  Trong {revenueTimeLabels[publishedTimeFilter]}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCharts(!showCharts)}
            className="gap-2 mb-4"
          >
            <BarChart3 className="h-4 w-4" />
            {showCharts ? "Ẩn biểu đồ" : "Hiện biểu đồ"}
          </Button>
          
          {showCharts && <AdminCharts courses={courses} />}
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
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <CardTitle>Danh sách khóa học</CardTitle>
                      <CardDescription>
                        Quản lý tất cả khóa học trong hệ thống
                        {hasActiveFilters && (
                          <span className="ml-2 text-primary">
                            ({filteredCourses.length} kết quả)
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Tìm kiếm tên, mô tả, giảng viên..."
                          className="pl-9 w-72"
                          value={courseSearchTerm}
                          onChange={(e) => setCourseSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button
                        variant={showFilters ? "secondary" : "outline"}
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        Lọc
                        {hasActiveFilters && (
                          <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            !
                          </Badge>
                        )}
                      </Button>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                          <X className="w-4 h-4" />
                          Xóa bộ lọc
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Xuất báo cáo
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={exportToCSV} className="gap-2">
                            <FileSpreadsheet className="w-4 h-4" />
                            Xuất CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={exportToExcel} className="gap-2">
                            <FileSpreadsheet className="w-4 h-4" />
                            Xuất Excel (.xls)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button onClick={() => openCourseDialog()} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Thêm khóa học
                      </Button>
                    </div>
                  </div>

                  {/* Filters Panel */}
                  {showFilters && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Danh mục</Label>
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tất cả" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả danh mục</SelectItem>
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

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Cấp độ</Label>
                        <Select value={filterLevel} onValueChange={setFilterLevel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tất cả" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả cấp độ</SelectItem>
                            <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                            <SelectItem value="Trung cấp">Trung cấp</SelectItem>
                            <SelectItem value="Nâng cao">Nâng cao</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Trạng thái</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tất cả" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="published">Đã xuất bản</SelectItem>
                            <SelectItem value="draft">Bản nháp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Nổi bật</Label>
                        <Select value={filterFeatured} onValueChange={setFilterFeatured}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tất cả" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="featured">Khóa học nổi bật</SelectItem>
                            <SelectItem value="normal">Khóa học thường</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 col-span-2 md:col-span-4 border-t pt-4 mt-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <ArrowUpDown className="w-3 h-3" />
                          Sắp xếp theo
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={sortBy === "newest" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy("newest")}
                            className="gap-1"
                          >
                            <ArrowDown className="w-3 h-3" />
                            Mới nhất
                          </Button>
                          <Button
                            variant={sortBy === "oldest" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy("oldest")}
                            className="gap-1"
                          >
                            <ArrowUp className="w-3 h-3" />
                            Cũ nhất
                          </Button>
                          <Button
                            variant={sortBy === "price-high" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy("price-high")}
                            className="gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Giá cao → thấp
                          </Button>
                          <Button
                            variant={sortBy === "price-low" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy("price-low")}
                            className="gap-1"
                          >
                            <DollarSign className="w-3 h-3" />
                            Giá thấp → cao
                          </Button>
                          <Button
                            variant={sortBy === "students-high" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy("students-high")}
                            className="gap-1"
                          >
                            <Users className="w-3 h-3" />
                            Học viên nhiều nhất
                          </Button>
                          <Button
                            variant={sortBy === "rating-high" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy("rating-high")}
                            className="gap-1"
                          >
                            <Star className="w-3 h-3" />
                            Đánh giá cao
                          </Button>
                          <Button
                            variant={sortBy === "title-asc" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSortBy("title-asc")}
                            className="gap-1"
                          >
                            A → Z
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : sortedCourses.length === 0 ? (
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
                      {paginatedCourses.map((course) => (
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
                
                {/* Course Pagination */}
                {sortedCourses.length > 0 && (
                  <Pagination
                    currentPage={courseCurrentPage}
                    totalPages={totalCoursePages}
                    pageSize={coursePageSize}
                    totalItems={sortedCourses.length}
                    onPageChange={setCourseCurrentPage}
                    onPageSizeChange={(size) => {
                      setCoursePageSize(size);
                      setCourseCurrentPage(1);
                    }}
                  />
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
                      {paginatedUsers.map((userData) => (
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
                
                {/* User Pagination */}
                {filteredUsers.length > 0 && (
                  <Pagination
                    currentPage={userCurrentPage}
                    totalPages={totalUserPages}
                    pageSize={userPageSize}
                    totalItems={filteredUsers.length}
                    onPageChange={setUserCurrentPage}
                    onPageSizeChange={(size) => {
                      setUserPageSize(size);
                      setUserCurrentPage(1);
                    }}
                  />
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
