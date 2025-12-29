import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const categories = [
  "Lập trình",
  "Thiết kế",
  "Marketing",
  "Kinh doanh",
  "Ngoại ngữ",
  "Phát triển cá nhân",
  "Nhiếp ảnh",
  "Âm nhạc",
  "Khác",
];

const levels = ["Cơ bản", "Trung cấp", "Nâng cao"];

const EditCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    price: "",
    original_price: "",
    category: "",
    level: "",
    duration_hours: "",
    total_lessons: "",
    thumbnail_url: "",
  });

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("id", id)
          .eq("instructor_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast.error("Không tìm thấy khóa học hoặc bạn không có quyền chỉnh sửa");
          navigate("/instructor-dashboard");
          return;
        }

        setFormData({
          title: data.title || "",
          short_description: data.short_description || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          original_price: data.original_price?.toString() || "",
          category: data.category || "",
          level: data.level || "",
          duration_hours: data.duration_hours?.toString() || "",
          total_lessons: data.total_lessons?.toString() || "",
          thumbnail_url: data.thumbnail_url || "",
        });
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Không thể tải thông tin khóa học");
        navigate("/instructor-dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchCourse();
    } else if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [id, user, authLoading, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file tối đa là 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("course-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("course-images")
        .getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: publicUrl });
      toast.success("Đã tải ảnh lên thành công");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.level) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase
        .from("courses")
        .update({
          title: formData.title,
          short_description: formData.short_description || null,
          description: formData.description,
          price: parseInt(formData.price),
          original_price: formData.original_price ? parseInt(formData.original_price) : null,
          category: formData.category,
          level: formData.level,
          duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
          total_lessons: formData.total_lessons ? parseInt(formData.total_lessons) : null,
          thumbnail_url: formData.thumbnail_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("instructor_id", user?.id);

      if (updateError) throw updateError;

      toast.success("Đã cập nhật khóa học thành công!");
      navigate("/instructor-dashboard");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Không thể cập nhật khóa học");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chỉnh sửa khóa học</h1>
            <p className="text-muted-foreground mt-1">
              Cập nhật thông tin khóa học của bạn
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Thông tin chính về khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên khóa học *</Label>
                <Input
                  id="title"
                  placeholder="VD: React & TypeScript Master Class"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="short_description">Mô tả ngắn</Label>
                <Input
                  id="short_description"
                  placeholder="Mô tả ngắn gọn về khóa học (hiển thị trên thẻ khóa học)"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  maxLength={200}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả chi tiết *</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về nội dung, lợi ích và đối tượng phù hợp với khóa học..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="level">Cấp độ *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Giá khóa học</CardTitle>
              <CardDescription>Thiết lập giá bán cho khóa học</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Giá bán (VND) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="1490000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min={0}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="original_price">Giá gốc (VND)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    placeholder="1990000 (để trống nếu không giảm giá)"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập giá gốc nếu bạn muốn hiển thị mức giảm giá
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết khóa học</CardTitle>
              <CardDescription>Thông tin bổ sung về nội dung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration_hours">Thời lượng (giờ)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    placeholder="20"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                    min={0}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="total_lessons">Số bài học</Label>
                  <Input
                    id="total_lessons"
                    type="number"
                    placeholder="50"
                    value={formData.total_lessons}
                    onChange={(e) => setFormData({ ...formData, total_lessons: e.target.value })}
                    min={0}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail */}
          <Card>
            <CardHeader>
              <CardTitle>Ảnh bìa khóa học</CardTitle>
              <CardDescription>Hình ảnh đại diện cho khóa học (khuyến nghị 16:9)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Label
                    htmlFor="thumbnail"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
                        <span className="text-muted-foreground">Đang tải lên...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <span className="text-muted-foreground">Nhấn để chọn ảnh mới</span>
                        <span className="text-xs text-muted-foreground mt-1">PNG, JPG tối đa 5MB</span>
                      </>
                    )}
                  </Label>
                </div>

                {formData.thumbnail_url && (
                  <div className="w-full md:w-64">
                    <p className="text-sm text-muted-foreground mb-2">Ảnh hiện tại:</p>
                    <img
                      src={formData.thumbnail_url}
                      alt="Thumbnail preview"
                      className="w-full h-36 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-destructive"
                      onClick={() => setFormData({ ...formData, thumbnail_url: "" })}
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditCourse;
