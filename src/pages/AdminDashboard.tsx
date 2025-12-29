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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  roles: string[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Stats (mock for demo)
  const stats = {
    totalUsers: 1250,
    totalCourses: 45,
    totalRevenue: 125000000,
    activeUsers: 892,
  };

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
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      // Fetch users with their roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Group roles by user
      const userRolesMap = new Map<string, string[]>();
      rolesData?.forEach((item) => {
        const existing = userRolesMap.get(item.user_id) || [];
        existing.push(item.role);
        userRolesMap.set(item.user_id, existing);
      });

      // Create user list from roles data
      const uniqueUserIds = [...new Set(rolesData?.map((r) => r.user_id) || [])];
      const usersData: UserData[] = uniqueUserIds.map((userId) => ({
        id: userId,
        email: `user_${userId.slice(0, 8)}@example.com`, // Placeholder
        created_at: new Date().toISOString(),
        roles: userRolesMap.get(userId) || [],
      }));

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
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
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase())
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
              <CardTitle className="text-sm font-medium">
                Tổng người dùng
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +180 trong tháng này
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng khóa học
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                +5 khóa mới trong tuần
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                +20% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Người dùng hoạt động
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.activeUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                71% tổng người dùng
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
            <TabsTrigger value="roles">Phân quyền</TabsTrigger>
          </TabsList>

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
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm..."
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
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
                                <Badge
                                  key={role}
                                  variant={getRoleBadgeVariant(role)}
                                >
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
                          Quyền cao nhất. Có thể quản lý người dùng, khóa học,
                          và toàn bộ hệ thống.
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
                          Có thể tạo và quản lý khóa học, xem thống kê học viên.
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
                      <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                      >
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
              <Button
                variant="outline"
                onClick={() => setIsAddRoleDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleAddRole}>Thêm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
