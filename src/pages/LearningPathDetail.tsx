import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Clock, Users, CheckCircle2, Lock, Play, 
  ArrowLeft, Target, Award, TrendingUp, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pathData = {
  id: "frontend",
  title: "Frontend Developer",
  description: "Trở thành Frontend Developer chuyên nghiệp với lộ trình học tập được thiết kế bởi các chuyên gia. Từ cơ bản đến nâng cao, bạn sẽ học mọi thứ cần thiết để xây dựng các ứng dụng web hiện đại.",
  image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
  duration: "6 tháng",
  students: 12500,
  level: "Beginner to Advanced",
  rating: 4.9,
  outcomes: [
    "Xây dựng giao diện web responsive với HTML, CSS",
    "Lập trình JavaScript từ cơ bản đến nâng cao",
    "Phát triển ứng dụng React với TypeScript",
    "Quản lý state với Redux và Context API",
    "Tối ưu hiệu suất và SEO",
    "Triển khai ứng dụng lên production"
  ],
  courses: [
    {
      id: "1",
      title: "HTML & CSS Fundamentals",
      description: "Nền tảng về HTML5 và CSS3 cho web development",
      duration: "20 giờ",
      lessons: 35,
      status: "completed",
      progress: 100
    },
    {
      id: "2",
      title: "JavaScript Essential",
      description: "Lập trình JavaScript từ cơ bản đến nâng cao",
      duration: "40 giờ",
      lessons: 60,
      status: "in_progress",
      progress: 65
    },
    {
      id: "3",
      title: "React - The Complete Guide",
      description: "Xây dựng ứng dụng React hiện đại",
      duration: "50 giờ",
      lessons: 80,
      status: "locked",
      progress: 0
    },
    {
      id: "4",
      title: "TypeScript Mastery",
      description: "Type-safe JavaScript development",
      duration: "25 giờ",
      lessons: 40,
      status: "locked",
      progress: 0
    },
    {
      id: "5",
      title: "Advanced React Patterns",
      description: "Design patterns và best practices trong React",
      duration: "30 giờ",
      lessons: 45,
      status: "locked",
      progress: 0
    },
    {
      id: "6",
      title: "Testing & Deployment",
      description: "Testing, CI/CD và deployment",
      duration: "20 giờ",
      lessons: 30,
      status: "locked",
      progress: 0
    }
  ]
};

const LearningPathDetail = () => {
  const { id } = useParams();

  const completedCourses = pathData.courses.filter(c => c.status === "completed").length;
  const overallProgress = Math.round((completedCourses / pathData.courses.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-12 lg:py-16">
          <div className="container">
            <Link 
              to="/learning-paths" 
              className="inline-flex items-center gap-2 text-hero-foreground/70 hover:text-hero-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tất cả lộ trình
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                  <Target className="w-3 h-3 mr-1" />
                  Lộ trình học tập
                </Badge>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hero-foreground mb-4">
                  {pathData.title}
                </h1>
                
                <p className="text-lg text-hero-foreground/80 mb-6">
                  {pathData.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6 text-hero-foreground/70">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {pathData.courses.length} khóa học
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pathData.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {pathData.students.toLocaleString()} học viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {pathData.rating}
                  </span>
                </div>

                <Button variant="hero" size="lg">
                  Bắt đầu học
                </Button>
              </div>

              {/* Progress Card */}
              <div className="lg:col-span-1">
                <Card className="bg-card/95 backdrop-blur">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Tiến độ của bạn</h3>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Hoàn thành</span>
                        <span className="font-medium text-foreground">{overallProgress}%</span>
                      </div>
                      <Progress value={overallProgress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{completedCourses}</p>
                        <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{pathData.courses.length - completedCourses}</p>
                        <p className="text-xs text-muted-foreground">Còn lại</p>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      <Award className="w-4 h-4 mr-2" />
                      Xem chứng chỉ
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Courses List */}
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Các khóa học trong lộ trình
                </h2>
                
                <div className="space-y-4">
                  {pathData.courses.map((course, index) => (
                    <Card 
                      key={course.id} 
                      className={`overflow-hidden transition-all ${
                        course.status === "locked" ? "opacity-60" : "hover:shadow-lg"
                      }`}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4 p-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                            course.status === "completed" 
                              ? "bg-accent text-accent-foreground" 
                              : course.status === "in_progress"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {course.status === "completed" ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : course.status === "locked" ? (
                              <Lock className="w-5 h-5" />
                            ) : (
                              <span className="font-bold">{index + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {course.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {course.description}
                                </p>
                              </div>
                              <Badge variant={
                                course.status === "completed" ? "default" :
                                course.status === "in_progress" ? "secondary" : "outline"
                              }>
                                {course.status === "completed" ? "Hoàn thành" :
                                 course.status === "in_progress" ? "Đang học" : "Khóa"}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {course.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {course.lessons} bài học
                              </span>
                            </div>

                            {course.status !== "locked" && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2">
                                  <Progress value={course.progress} className="h-1.5 flex-1" />
                                  <span className="text-xs text-muted-foreground">{course.progress}%</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {course.status !== "locked" && (
                            <Link to={`/courses/${course.id}`}>
                              <Button size="sm" variant={course.status === "completed" ? "outline" : "default"}>
                                <Play className="w-4 h-4 mr-1" />
                                {course.status === "completed" ? "Xem lại" : "Tiếp tục"}
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Bạn sẽ học được
                    </h3>
                    <ul className="space-y-3">
                      {pathData.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LearningPathDetail;
