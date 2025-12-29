import { useState, useEffect } from "react";
import { Check, X, BookOpen, Clock, Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Course {
  id: string;
  title: string;
  short_description: string | null;
  category: string;
  level: string;
  price: number;
  instructor_name: string | null;
  approval_status: string;
  approval_notes: string | null;
  created_at: string;
  thumbnail_url: string | null;
}

export const CourseApprovalTab = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, short_description, category, level, price, instructor_name, approval_status, approval_notes, created_at, thumbnail_url")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedCourse || !actionType || !user) return;

    setProcessing(true);
    try {
      const updateData: Record<string, unknown> = {
        approval_status: actionType === "approve" ? "approved" : "rejected",
        approval_notes: notes || null,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      };

      // If approved, also publish the course
      if (actionType === "approve") {
        updateData.is_published = true;
      }

      const { error } = await supabase
        .from("courses")
        .update(updateData)
        .eq("id", selectedCourse.id);

      if (error) throw error;

      toast.success(
        actionType === "approve"
          ? "Đã duyệt và xuất bản khóa học"
          : "Đã từ chối khóa học"
      );

      setSelectedCourse(null);
      setActionType(null);
      setNotes("");
      fetchCourses();
    } catch (error) {
      console.error("Error processing course:", error);
      toast.error("Không thể xử lý khóa học");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Chờ duyệt</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-700">Đã duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const pendingCount = courses.filter(c => c.approval_status === "pending").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Duyệt khóa học
              {pendingCount > 0 && (
                <Badge variant="destructive">{pendingCount} chờ duyệt</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Xem xét và duyệt khóa học mới từ giảng viên
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchCourses} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có khóa học nào cần duyệt</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khóa học</TableHead>
                <TableHead>Giảng viên</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {course.thumbnail_url && (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium line-clamp-1">{course.title}</p>
                        {course.short_description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {course.short_description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{course.instructor_name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.category}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(course.price)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(course.created_at).toLocaleDateString("vi-VN")}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(course.approval_status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {course.approval_status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setSelectedCourse(course);
                              setActionType("approve");
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSelectedCourse(course);
                              setActionType("reject");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Approval/Rejection Dialog */}
        <Dialog open={!!selectedCourse && !!actionType} onOpenChange={() => {
          setSelectedCourse(null);
          setActionType(null);
          setNotes("");
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Duyệt khóa học" : "Từ chối khóa học"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "approve"
                  ? `Bạn sắp duyệt khóa học "${selectedCourse?.title}". Khóa học sẽ được xuất bản và hiển thị công khai.`
                  : `Bạn sắp từ chối khóa học "${selectedCourse?.title}". Vui lòng cung cấp lý do.`}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Textarea
                placeholder={actionType === "approve" ? "Ghi chú (tùy chọn)" : "Lý do từ chối..."}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSelectedCourse(null);
                setActionType(null);
                setNotes("");
              }}>
                Hủy
              </Button>
              <Button
                variant={actionType === "approve" ? "default" : "destructive"}
                onClick={handleAction}
                disabled={processing || (actionType === "reject" && !notes)}
              >
                {processing ? "Đang xử lý..." : actionType === "approve" ? "Duyệt & Xuất bản" : "Từ chối"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
