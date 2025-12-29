import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, FileQuestion } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ tên").max(100, "Họ tên không quá 100 ký tự"),
  email: z.string().trim().email("Email không hợp lệ").max(255, "Email không quá 255 ký tự"),
  subject: z.string().trim().min(1, "Vui lòng nhập tiêu đề").max(200, "Tiêu đề không quá 200 ký tự"),
  message: z.string().trim().min(10, "Nội dung phải có ít nhất 10 ký tự").max(2000, "Nội dung không quá 2000 ký tự"),
});

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    content: "support@edulearn.vn",
    description: "Phản hồi trong 24h",
  },
  {
    icon: Phone,
    title: "Hotline",
    content: "1900 1234 56",
    description: "Miễn phí cuộc gọi",
  },
  {
    icon: MapPin,
    title: "Địa chỉ",
    content: "123 Nguyễn Văn Linh, Q.7, TP.HCM",
    description: "Văn phòng chính",
  },
  {
    icon: Clock,
    title: "Giờ làm việc",
    content: "8:00 - 22:00",
    description: "Thứ 2 - Chủ nhật",
  },
];

const supportTypes = [
  {
    icon: MessageSquare,
    title: "Chat trực tiếp",
    description: "Nhận hỗ trợ ngay lập tức qua chat",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ kỹ thuật",
    description: "Giải đáp mọi vấn đề kỹ thuật",
  },
  {
    icon: FileQuestion,
    title: "FAQ",
    description: "Tìm câu trả lời nhanh chóng",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Gửi thành công!",
      description: "Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
    });
    
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-hero-foreground py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-lg md:text-xl text-hero-foreground/80 animate-fade-in-up animation-delay-100">
              Bạn có câu hỏi? Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-8">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info) => (
              <Card key={info.title} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                  <p className="text-primary font-medium mb-1">{info.content}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Support */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Gửi tin nhắn cho chúng tôi</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Nhập họ tên của bạn"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Tiêu đề</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Nhập tiêu đề tin nhắn"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Nội dung</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Nhập nội dung tin nhắn của bạn..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={isSubmitting}
                      />
                      {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                    </div>
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? (
                        "Đang gửi..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Gửi tin nhắn
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Support Options */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Hỗ trợ khác</h2>
              {supportTypes.map((type) => (
                <Card key={type.title} className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Map */}
              <Card className="bg-card border-border overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Bản đồ sẽ hiển thị ở đây</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
