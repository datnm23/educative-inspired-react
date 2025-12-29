import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Award, Users, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formSchema = z.object({
  full_name: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự").max(100, "Họ tên không được quá 100 ký tự"),
  bio: z.string().min(50, "Tiểu sử phải có ít nhất 50 ký tự").max(1000, "Tiểu sử không được quá 1000 ký tự"),
  experience_years: z.coerce.number().min(0, "Số năm kinh nghiệm không hợp lệ").max(50, "Số năm kinh nghiệm không hợp lệ"),
  expertise: z.string().min(2, "Vui lòng nhập chuyên môn của bạn"),
  portfolio_url: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const BecomeInstructor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isInstructor } = useUserRole();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<{ status: string } | null>(null);
  const [checkingApplication, setCheckingApplication] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      bio: "",
      experience_years: 0,
      expertise: "",
      portfolio_url: "",
    },
  });

  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user) {
        setCheckingApplication(false);
        return;
      }

      const { data, error } = await supabase
        .from("instructor_applications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setExistingApplication(data);
      }
      setCheckingApplication(false);
    };

    checkExistingApplication();
  }, [user]);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đăng ký trở thành giảng viên",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    const expertiseArray = data.expertise.split(",").map((e) => e.trim()).filter(Boolean);

    const { error } = await supabase.from("instructor_applications").insert({
      user_id: user.id,
      full_name: data.full_name,
      bio: data.bio,
      experience_years: data.experience_years,
      expertise: expertiseArray,
      portfolio_url: data.portfolio_url || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi đơn đăng ký. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Đã gửi đơn đăng ký",
      description: "Chúng tôi sẽ xem xét đơn của bạn trong thời gian sớm nhất.",
    });

    setExistingApplication({ status: "pending" });
  };

  if (authLoading || checkingApplication) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isInstructor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Bạn đã là giảng viên</h2>
              <p className="text-muted-foreground mb-6">
                Bạn đã có quyền giảng viên và có thể tạo khóa học ngay bây giờ.
              </p>
              <Button onClick={() => navigate("/instructor-dashboard")}>
                Đi đến trang quản lý
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (existingApplication) {
    const statusMap: Record<string, { label: string; color: string; description: string }> = {
      pending: {
        label: "Đang chờ xét duyệt",
        color: "bg-yellow-500",
        description: "Đơn đăng ký của bạn đang được xem xét. Chúng tôi sẽ thông báo khi có kết quả.",
      },
      approved: {
        label: "Đã được duyệt",
        color: "bg-green-500",
        description: "Chúc mừng! Đơn của bạn đã được duyệt. Hãy bắt đầu tạo khóa học.",
      },
      rejected: {
        label: "Đã bị từ chối",
        color: "bg-red-500",
        description: "Rất tiếc, đơn của bạn chưa được duyệt lần này. Bạn có thể liên hệ để biết thêm chi tiết.",
      },
    };

    const status = statusMap[existingApplication.status] || statusMap.pending;

    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-8">
              <Badge className={`${status.color} text-white mb-4`}>{status.label}</Badge>
              <h2 className="text-2xl font-bold mb-2">Đơn đăng ký của bạn</h2>
              <p className="text-muted-foreground mb-6">{status.description}</p>
              {existingApplication.status === "approved" && (
                <Button onClick={() => navigate("/instructor-dashboard")}>
                  Đi đến trang quản lý
                </Button>
              )}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
          <div className="container text-center">
            <Badge variant="secondary" className="mb-4">
              Trở thành giảng viên
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Chia sẻ kiến thức, <span className="text-primary">Tạo thu nhập</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tham gia cộng đồng giảng viên EduLearn và tiếp cận hàng nghìn học viên đang mong muốn học hỏi từ bạn.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Chia sẻ chuyên môn</h3>
                  <p className="text-muted-foreground">
                    Tạo khóa học theo chuyên môn của bạn và giúp đỡ người khác phát triển kỹ năng.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tạo thu nhập</h3>
                  <p className="text-muted-foreground">
                    Kiếm tiền từ mỗi học viên đăng ký khóa học của bạn với mức chia sẻ doanh thu hấp dẫn.
                  </p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Xây dựng thương hiệu</h3>
                  <p className="text-muted-foreground">
                    Tăng độ nhận diện cá nhân và xây dựng cộng đồng học viên theo dõi bạn.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Application Form */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Đơn đăng ký giảng viên</CardTitle>
                <CardDescription>
                  Điền thông tin bên dưới để gửi đơn đăng ký. Chúng tôi sẽ xem xét và phản hồi trong 3-5 ngày làm việc.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để gửi đơn đăng ký.</p>
                    <Button onClick={() => navigate("/auth")}>Đăng nhập</Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nguyễn Văn A" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Giới thiệu bản thân</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Hãy chia sẻ về kinh nghiệm, thành tích và lý do bạn muốn trở thành giảng viên..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Tối thiểu 50 ký tự</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience_years"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số năm kinh nghiệm</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} max={50} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chuyên môn</FormLabel>
                            <FormControl>
                              <Input placeholder="React, Node.js, Python (phân cách bằng dấu phẩy)" {...field} />
                            </FormControl>
                            <FormDescription>Liệt kê các lĩnh vực chuyên môn, cách nhau bởi dấu phẩy</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="portfolio_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link portfolio (tùy chọn)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://your-portfolio.com" {...field} />
                            </FormControl>
                            <FormDescription>LinkedIn, GitHub, website cá nhân, etc.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          "Gửi đơn đăng ký"
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeInstructor;
