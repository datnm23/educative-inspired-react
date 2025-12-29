import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  Play,
  Download,
  ChevronRight,
  Star,
  Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const enrolledCourses = [
  {
    id: 1,
    title: "System Design Interview",
    instructor: "Alex Xu",
    progress: 68,
    totalLessons: 45,
    completedLessons: 31,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    nextLesson: "Designing a URL Shortener",
    lastAccessed: "2 giờ trước"
  },
  {
    id: 2,
    title: "React - The Complete Guide",
    instructor: "Sarah Chen",
    progress: 42,
    totalLessons: 60,
    completedLessons: 25,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    nextLesson: "useEffect Deep Dive",
    lastAccessed: "1 ngày trước"
  },
  {
    id: 3,
    title: "Python for Data Science",
    instructor: "Mike Johnson",
    progress: 15,
    totalLessons: 80,
    completedLessons: 12,
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
    nextLesson: "NumPy Fundamentals",
    lastAccessed: "3 ngày trước"
  }
];

const certificates = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    issueDate: "15/12/2024",
    instructor: "John Smith",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400"
  },
  {
    id: 2,
    title: "Git & GitHub Mastery",
    issueDate: "02/11/2024",
    instructor: "Emily Davis",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400"
  }
];

const recommendedCourses = [
  {
    id: 5,
    title: "Kubernetes for Developers",
    instructor: "David Kim",
    rating: 4.9,
    students: "18K",
    price: 89,
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400",
    tag: "Trending"
  },
  {
    id: 6,
    title: "AWS Solutions Architect",
    instructor: "Lisa Wang",
    rating: 4.8,
    students: "32K",
    price: 129,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    tag: "Best Seller"
  },
  {
    id: 7,
    title: "GraphQL Complete Course",
    instructor: "Tom Anderson",
    rating: 4.7,
    students: "12K",
    price: 69,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
    tag: "New"
  }
];

const stats = [
  { label: "Đang học", value: 3, icon: BookOpen, color: "text-primary" },
  { label: "Hoàn thành", value: 5, icon: Trophy, color: "text-accent" },
  { label: "Chứng chỉ", value: 2, icon: Target, color: "text-chart-4" },
  { label: "Giờ học", value: 127, icon: Clock, color: "text-chart-3" }
];

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold">
                N
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Chào mừng trở lại, Nguyen!
                </h1>
                <p className="text-muted-foreground">
                  Tiếp tục hành trình học tập của bạn
                </p>
              </div>
            </div>
            <Link to="/courses">
              <Button className="gap-2">
                <BookOpen className="w-4 h-4" />
                Khám phá khóa học
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur border-border/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Continue Learning */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Tiếp tục học</h2>
                  <Link to="/courses" className="text-primary hover:underline text-sm flex items-center gap-1">
                    Xem tất cả <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 h-32 sm:h-auto relative">
                            <img 
                              src={course.image} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Link to={`/course/${course.id}`}>
                                <Button size="icon" className="rounded-full">
                                  <Play className="w-5 h-5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <Link to={`/course/${course.id}`}>
                                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                    {course.title}
                                  </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground">{course.instructor}</p>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {course.lastAccessed}
                              </Badge>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {course.completedLessons}/{course.totalLessons} bài học
                                </span>
                                <span className="font-medium text-primary">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                              <p className="text-sm text-muted-foreground">
                                Tiếp theo: <span className="text-foreground">{course.nextLesson}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-foreground">Chứng chỉ của bạn</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <Card key={cert.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                      <div className="relative h-32">
                        <img 
                          src={cert.image} 
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="font-semibold text-foreground text-sm">{cert.title}</h3>
                          <p className="text-xs text-muted-foreground">{cert.instructor}</p>
                        </div>
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
                          <Trophy className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      </div>
                      <CardContent className="p-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Cấp ngày: {cert.issueDate}
                        </span>
                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                          <Download className="w-3 h-3" />
                          Tải về
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recommended */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Đề xuất cho bạn</h2>
              </div>
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-36">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs">
                        {course.tag}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <Link to={`/course/${course.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
                      <div className="flex items-center gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium text-foreground">{course.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{course.students}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-primary">${course.price}</span>
                        <Link to={`/course/${course.id}`}>
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StudentDashboard;
