import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, BookOpen, Globe, Target, Heart, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { number: "500K+", label: "Học viên toàn cầu", icon: Users },
  { number: "1,200+", label: "Khóa học chất lượng", icon: BookOpen },
  { number: "150+", label: "Giảng viên chuyên gia", icon: Award },
  { number: "50+", label: "Quốc gia", icon: Globe },
];

const values = [
  {
    icon: Target,
    title: "Tập trung vào kết quả",
    description: "Mọi khóa học đều hướng đến giúp học viên đạt được mục tiêu thực tế trong sự nghiệp.",
  },
  {
    icon: Heart,
    title: "Học viên là trọng tâm",
    description: "Chúng tôi luôn lắng nghe và cải tiến dựa trên phản hồi từ cộng đồng học viên.",
  },
  {
    icon: Zap,
    title: "Đổi mới liên tục",
    description: "Nội dung được cập nhật thường xuyên để theo kịp xu hướng công nghệ mới nhất.",
  },
  {
    icon: Shield,
    title: "Chất lượng đảm bảo",
    description: "Mỗi khóa học đều trải qua quy trình kiểm duyệt nghiêm ngặt trước khi xuất bản.",
  },
];

const team = [
  {
    name: "Nguyễn Văn An",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Trần Thị Bình",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Lê Minh Cường",
    role: "Head of Content",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  },
  {
    name: "Phạm Thị Dung",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient text-hero-foreground py-20 lg:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              Về <span className="text-primary">EduLearn</span>
            </h1>
            <p className="text-lg md:text-xl text-hero-foreground/80 mb-8 animate-fade-in-up animation-delay-100">
              Chúng tôi tin rằng mọi người đều xứng đáng được tiếp cận nền giáo dục chất lượng cao. 
              EduLearn là nền tảng học tập trực tuyến hàng đầu, giúp bạn phát triển kỹ năng và 
              thăng tiến trong sự nghiệp.
            </p>
            <Button variant="hero" size="lg" className="animate-fade-in-up animation-delay-200" asChild>
              <Link to="/courses">Khám phá khóa học</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className={`text-center animate-fade-in-up animation-delay-${index + 1}00`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                EduLearn được thành lập với mục tiêu đơn giản: làm cho giáo dục công nghệ trở nên 
                dễ tiếp cận và hiệu quả hơn cho mọi người, bất kể bạn ở đâu hay xuất phát điểm của bạn như thế nào.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Chúng tôi hợp tác với các chuyên gia hàng đầu trong ngành để tạo ra những khóa học 
                thực tiễn, giúp học viên không chỉ hiểu lý thuyết mà còn áp dụng được vào công việc thực tế.
              </p>
              <p className="text-lg text-muted-foreground">
                Với phương pháp học tập tương tác, dự án thực hành và hệ thống hỗ trợ 24/7, 
                chúng tôi cam kết đồng hành cùng bạn trên mọi bước đường.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">2019</div>
                <div className="text-sm">Năm thành lập</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Đội ngũ lãnh đạo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những người đứng sau thành công của EduLearn
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-hero-foreground">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-lg text-hero-foreground/80 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hơn 500,000 học viên đang học tập trên EduLearn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/auth">Đăng ký miễn phí</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-hero-foreground/30 text-hero-foreground hover:bg-hero-foreground/10" asChild>
              <Link to="/contact">Liên hệ chúng tôi</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
