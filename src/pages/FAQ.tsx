import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  CreditCard, 
  User, 
  Settings, 
  Award, 
  MessageCircle,
  ChevronRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const categories = [
  { icon: BookOpen, label: "Khóa học", count: 12 },
  { icon: CreditCard, label: "Thanh toán", count: 8 },
  { icon: User, label: "Tài khoản", count: 10 },
  { icon: Settings, label: "Kỹ thuật", count: 6 },
  { icon: Award, label: "Chứng chỉ", count: 5 },
];

const faqData = [
  {
    category: "Khóa học",
    questions: [
      {
        q: "Làm thế nào để bắt đầu học một khóa học?",
        a: "Sau khi đăng ký tài khoản, bạn có thể duyệt danh mục khóa học, chọn khóa học phù hợp và nhấn 'Bắt đầu học'. Đối với khóa học Pro, bạn cần đăng ký gói trả phí trước.",
      },
      {
        q: "Tôi có thể học offline không?",
        a: "Có, với gói Pro bạn có thể tải xuống video bài giảng để học offline trên ứng dụng di động của chúng tôi.",
      },
      {
        q: "Khóa học có thời hạn truy cập không?",
        a: "Không, một khi bạn đã đăng ký hoặc mua khóa học, bạn sẽ có quyền truy cập vĩnh viễn vào nội dung đó.",
      },
      {
        q: "Làm sao để theo dõi tiến độ học tập?",
        a: "Bạn có thể xem tiến độ học tập chi tiết trong Dashboard của mình. Hệ thống tự động lưu tiến độ mỗi khi bạn hoàn thành bài học.",
      },
    ],
  },
  {
    category: "Thanh toán",
    questions: [
      {
        q: "Phương thức thanh toán nào được hỗ trợ?",
        a: "Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard), ví điện tử (MoMo, ZaloPay, VNPay), và chuyển khoản ngân hàng.",
      },
      {
        q: "Có chính sách hoàn tiền không?",
        a: "Có, chúng tôi cung cấp chính sách hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ.",
      },
      {
        q: "Làm sao để hủy đăng ký?",
        a: "Bạn có thể hủy đăng ký bất cứ lúc nào trong phần Cài đặt > Quản lý đăng ký. Sau khi hủy, bạn vẫn có thể sử dụng đến hết chu kỳ thanh toán.",
      },
    ],
  },
  {
    category: "Tài khoản",
    questions: [
      {
        q: "Làm sao để đổi mật khẩu?",
        a: "Vào Cài đặt > Bảo mật > Đổi mật khẩu. Bạn cần nhập mật khẩu hiện tại và mật khẩu mới để xác nhận thay đổi.",
      },
      {
        q: "Tôi có thể sử dụng tài khoản trên nhiều thiết bị không?",
        a: "Có, bạn có thể đăng nhập trên nhiều thiết bị cùng lúc. Tiến độ học tập sẽ được đồng bộ tự động.",
      },
      {
        q: "Làm sao để xóa tài khoản?",
        a: "Để xóa tài khoản, vui lòng liên hệ đội ngũ hỗ trợ qua email support@edulearn.vn. Lưu ý rằng việc xóa tài khoản sẽ xóa toàn bộ dữ liệu học tập.",
      },
    ],
  },
  {
    category: "Chứng chỉ",
    questions: [
      {
        q: "Làm sao để nhận chứng chỉ?",
        a: "Sau khi hoàn thành 100% nội dung khóa học và vượt qua bài kiểm tra cuối khóa (nếu có), chứng chỉ sẽ tự động được cấp trong Dashboard của bạn.",
      },
      {
        q: "Chứng chỉ có giá trị như thế nào?",
        a: "Chứng chỉ của EduLearn được nhiều doanh nghiệp công nhận. Mỗi chứng chỉ có mã xác thực riêng để nhà tuyển dụng có thể xác minh.",
      },
    ],
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFAQs = faqData.filter((category) => {
    if (activeCategory && category.category !== activeCategory) return false;
    if (!searchQuery) return true;
    return category.questions.some(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-hero-foreground py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Trung tâm hỗ trợ
            </h1>
            <p className="text-lg md:text-xl text-hero-foreground/80 mb-8 animate-fade-in-up animation-delay-100">
              Tìm câu trả lời cho mọi thắc mắc của bạn
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto animate-fade-in-up animation-delay-200">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-background text-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 -mt-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <Card 
                key={cat.label}
                className={`cursor-pointer transition-all ${
                  activeCategory === cat.label 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "bg-card hover:shadow-md"
                }`}
                onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
              >
                <CardContent className="p-4 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-foreground">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} câu hỏi</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-8">
            {filteredFAQs.map((category) => (
              <div key={category.category}>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {category.questions
                    .filter(
                      (q) =>
                        !searchQuery ||
                        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.a.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.category}-${index}`}
                        className="bg-card border border-border rounded-lg px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            ))}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Không tìm thấy kết quả phù hợp</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveCategory(null); }}>
                  Xóa bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <Card className="max-w-2xl mx-auto bg-card border-border">
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Không tìm thấy câu trả lời?
              </h2>
              <p className="text-muted-foreground mb-6">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">
                  Liên hệ hỗ trợ
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
