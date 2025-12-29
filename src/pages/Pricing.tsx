import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, X, Zap, Crown, Building2, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const plans = [
  {
    name: "Miễn phí",
    icon: Zap,
    description: "Bắt đầu học với các khóa học cơ bản",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: "Truy cập 50+ khóa học miễn phí", included: true },
      { text: "Bài tập thực hành cơ bản", included: true },
      { text: "Chứng chỉ hoàn thành", included: false },
      { text: "Hỗ trợ 24/7", included: false },
      { text: "Tải xuống offline", included: false },
      { text: "Dự án thực tế", included: false },
    ],
    cta: "Bắt đầu miễn phí",
    popular: false,
  },
  {
    name: "Pro",
    icon: Crown,
    description: "Dành cho cá nhân muốn phát triển sự nghiệp",
    monthlyPrice: 299000,
    yearlyPrice: 2390000,
    features: [
      { text: "Truy cập tất cả 1,200+ khóa học", included: true },
      { text: "Bài tập thực hành nâng cao", included: true },
      { text: "Chứng chỉ hoàn thành", included: true },
      { text: "Hỗ trợ 24/7", included: true },
      { text: "Tải xuống offline", included: true },
      { text: "Dự án thực tế", included: true },
    ],
    cta: "Bắt đầu dùng thử",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: Building2,
    description: "Giải pháp đào tạo cho doanh nghiệp",
    monthlyPrice: null,
    yearlyPrice: null,
    features: [
      { text: "Tất cả tính năng Pro", included: true },
      { text: "Quản lý nhóm & báo cáo", included: true },
      { text: "API tích hợp", included: true },
      { text: "Khóa học tùy chỉnh", included: true },
      { text: "Account manager riêng", included: true },
      { text: "SLA cam kết", included: true },
    ],
    cta: "Liên hệ sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Tôi có thể hủy gói đăng ký bất cứ lúc nào không?",
    answer: "Có, bạn có thể hủy gói đăng ký bất cứ lúc nào. Sau khi hủy, bạn vẫn có thể sử dụng đến hết chu kỳ thanh toán hiện tại.",
  },
  {
    question: "Có chính sách hoàn tiền không?",
    answer: "Chúng tôi cung cấp chính sách hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ.",
  },
  {
    question: "Tôi có thể nâng cấp hoặc hạ cấp gói không?",
    answer: "Có, bạn có thể thay đổi gói đăng ký bất cứ lúc nào. Chi phí sẽ được tính theo tỷ lệ cho thời gian còn lại.",
  },
  {
    question: "Phương thức thanh toán nào được hỗ trợ?",
    answer: "Chúng tôi hỗ trợ thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard), ví điện tử (MoMo, ZaloPay), và chuyển khoản ngân hàng.",
  },
  {
    question: "Gói Enterprise có bao nhiêu người dùng?",
    answer: "Gói Enterprise được tùy chỉnh theo nhu cầu của doanh nghiệp. Liên hệ với đội ngũ sales để được tư vấn chi tiết.",
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-hero-foreground py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Chọn gói phù hợp với bạn
            </h1>
            <p className="text-lg md:text-xl text-hero-foreground/80 mb-8 animate-fade-in-up animation-delay-100">
              Đầu tư vào bản thân với mức giá hợp lý nhất. Tiết kiệm đến 33% khi đăng ký theo năm.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 animate-fade-in-up animation-delay-200">
              <span className={`text-sm ${!isYearly ? "text-hero-foreground" : "text-hero-foreground/60"}`}>
                Hàng tháng
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm ${isYearly ? "text-hero-foreground" : "text-hero-foreground/60"}`}>
                Hàng năm
              </span>
              <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
                Tiết kiệm 33%
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative bg-card border-border ${
                  plan.popular ? "ring-2 ring-primary shadow-xl scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Phổ biến nhất
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                    <plan.icon className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Price */}
                  <div className="text-center">
                    {plan.monthlyPrice !== null ? (
                      <>
                        <div className="text-4xl font-bold text-foreground">
                          {formatPrice(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                          <span className="text-lg font-normal text-muted-foreground">đ</span>
                        </div>
                        <div className="text-muted-foreground">
                          {isYearly ? "/năm" : "/tháng"}
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-foreground">Liên hệ</div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.text} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <Link to={plan.monthlyPrice === null ? "/contact" : "/auth"}>
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">Câu hỏi thường gặp</h2>
              <p className="text-muted-foreground">
                Giải đáp các thắc mắc phổ biến về gói dịch vụ
              </p>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Vẫn chưa quyết định?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bắt đầu với gói miễn phí và nâng cấp bất cứ lúc nào khi bạn sẵn sàng
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/auth">Bắt đầu miễn phí</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
