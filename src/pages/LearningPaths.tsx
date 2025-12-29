import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, ChevronRight, Target, TrendingUp, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const learningPaths = [
  {
    id: "frontend",
    title: "Frontend Developer",
    description: "Trở thành Frontend Developer chuyên nghiệp với React, TypeScript và các công nghệ hiện đại.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    courses: 8,
    duration: "6 tháng",
    students: 12500,
    level: "Beginner to Advanced",
    skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "Next.js"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: "Xây dựng API và hệ thống backend mạnh mẽ với Node.js, Python và database.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    courses: 10,
    duration: "8 tháng",
    students: 9800,
    level: "Intermediate",
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "REST API"],
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "fullstack",
    title: "Fullstack Developer",
    description: "Làm chủ cả Frontend và Backend để trở thành Fullstack Developer toàn diện.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    courses: 15,
    duration: "12 tháng",
    students: 8200,
    level: "Intermediate to Advanced",
    skills: ["React", "Node.js", "PostgreSQL", "DevOps", "System Design"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Phân tích dữ liệu và xây dựng mô hình Machine Learning với Python.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    courses: 12,
    duration: "10 tháng",
    students: 7500,
    level: "Intermediate",
    skills: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow"],
    color: "from-orange-500 to-red-500"
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    description: "Tự động hóa quy trình phát triển và triển khai phần mềm với CI/CD.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800",
    courses: 8,
    duration: "6 tháng",
    students: 5600,
    level: "Advanced",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    color: "from-indigo-500 to-violet-500"
  },
  {
    id: "mobile",
    title: "Mobile Developer",
    description: "Phát triển ứng dụng di động đa nền tảng với React Native.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    courses: 7,
    duration: "5 tháng",
    students: 6300,
    level: "Intermediate",
    skills: ["React Native", "TypeScript", "Redux", "Firebase", "App Store"],
    color: "from-teal-500 to-cyan-500"
  }
];

const LearningPaths = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-16 lg:py-24">
          <div className="container text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              <Target className="w-3 h-3 mr-1" />
              Lộ trình có hướng dẫn
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hero-foreground mb-6">
              Lộ trình học tập
            </h1>
            <p className="text-lg md:text-xl text-hero-foreground/80 max-w-2xl mx-auto mb-8">
              Theo dõi lộ trình được thiết kế bởi chuyên gia để đạt mục tiêu nghề nghiệp của bạn
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-hero-foreground/70">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Học theo trình tự</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Chứng chỉ hoàn thành</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span>Mục tiêu rõ ràng</span>
              </div>
            </div>
          </div>
        </section>

        {/* Paths Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {learningPaths.map((path) => (
                <Card key={path.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48">
                    <img 
                      src={path.image} 
                      alt={path.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${path.color} opacity-60`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white text-center px-4">
                        {path.title}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {path.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {path.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {path.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{path.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {path.courses} khóa học
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {path.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {(path.students / 1000).toFixed(1)}K
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{path.level}</Badge>
                      <Link to={`/learning-paths/${path.id}`}>
                        <Button className="gap-1">
                          Xem chi tiết
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LearningPaths;
