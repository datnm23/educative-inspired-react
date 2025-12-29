import { useState, useEffect } from "react";
import { Check, X, User, Clock, ExternalLink, RefreshCw } from "lucide-react";
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

interface InstructorApplication {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  expertise: string[] | null;
  experience_years: number | null;
  portfolio_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export const InstructorApprovalTab = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<InstructorApplication | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("instructor_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Không thể tải danh sách đơn đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedApp || !actionType || !user) return;

    setProcessing(true);
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from("instructor_applications")
        .update({
          status: actionType === "approve" ? "approved" : "rejected",
          notes: notes || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selectedApp.id);

      if (updateError) throw updateError;

      // If approved, add instructor role
      if (actionType === "approve") {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({
            user_id: selectedApp.user_id,
            role: "instructor",
          });

        if (roleError && roleError.code !== "23505") {
          throw roleError;
        }
      }

      toast.success(
        actionType === "approve"
          ? "Đã duyệt giảng viên thành công"
          : "Đã từ chối đơn đăng ký"
      );

      setSelectedApp(null);
      setActionType(null);
      setNotes("");
      fetchApplications();
    } catch (error) {
      console.error("Error processing application:", error);
      toast.error("Không thể xử lý đơn đăng ký");
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

  const pendingCount = applications.filter(a => a.status === "pending").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Duyệt giảng viên
              {pendingCount > 0 && (
                <Badge variant="destructive">{pendingCount} chờ duyệt</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Xem xét và duyệt đơn đăng ký trở thành giảng viên
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chưa có đơn đăng ký giảng viên nào</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Chuyên môn</TableHead>
                <TableHead>Kinh nghiệm</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{app.full_name}</p>
                      {app.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{app.bio}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {app.expertise?.slice(0, 2).map((exp, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{exp}</Badge>
                      ))}
                      {app.expertise && app.expertise.length > 2 && (
                        <Badge variant="outline" className="text-xs">+{app.expertise.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {app.experience_years ? `${app.experience_years} năm` : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(app.created_at).toLocaleDateString("vi-VN")}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {app.portfolio_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {app.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setSelectedApp(app);
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
                              setSelectedApp(app);
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
        <Dialog open={!!selectedApp && !!actionType} onOpenChange={() => {
          setSelectedApp(null);
          setActionType(null);
          setNotes("");
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "approve" ? "Duyệt giảng viên" : "Từ chối đơn đăng ký"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "approve"
                  ? `Bạn sắp duyệt ${selectedApp?.full_name} trở thành giảng viên. Họ sẽ có quyền tạo và quản lý khóa học.`
                  : `Bạn sắp từ chối đơn đăng ký của ${selectedApp?.full_name}. Vui lòng cung cấp lý do.`}
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
                setSelectedApp(null);
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
                {processing ? "Đang xử lý..." : actionType === "approve" ? "Duyệt" : "Từ chối"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
