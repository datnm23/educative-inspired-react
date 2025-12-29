import { Link, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Target, 
  Play,
  ChevronRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useCourseProgress } from "@/hooks/useCourseProgress";

// Mock course data - in production this would come from database
const coursesData: Record<string, { 
  title: string; 
  instructor: string; 
  image: string; 
  totalLessons: number;
  lessons: { id: string; title: string }[];
}> = {
  "1": {
    title: "System Design Interview",
    instructor: "Alex Xu",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    totalLessons: 45,
    lessons: [
      { id: "1-1", title: "Introduction to System Design" },
      { id: "1-2", title: "Scalability Basics" },
      { id: "1-3", title: "Load Balancing" },
      { id: "1-4", title: "Caching Strategies" },
      { id: "1-5", title: "Database Sharding" },
    ]
  },
  "2": {
    title: "React - The Complete Guide",
    instructor: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    totalLessons: 60,
    lessons: [
      { id: "2-1", title: "React Fundamentals" },
      { id: "2-2", title: "Components & Props" },
      { id: "2-3", title: "State Management" },
      { id: "2-4", title: "useEffect Deep Dive" },
      { id: "2-5", title: "Custom Hooks" },
    ]
  },
  "3": {
    title: "Python for Data Science",
    instructor: "Mike Johnson",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
    totalLessons: 80,
    lessons: [
      { id: "3-1", title: "Python Basics" },
      { id: "3-2", title: "NumPy Fundamentals" },
      { id: "3-3", title: "Pandas Introduction" },
      { id: "3-4", title: "Data Visualization" },
      { id: "3-5", title: "Machine Learning Basics" },
    ]
  }
};

const MyLearning = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    enrollments, 
    loading, 
    getCourseProgress, 
    getCompletedLessonsForCourse,
    markLessonComplete,
    isLessonCompleted
  } = useCourseProgress();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const inProgressCourses = enrollments.filter(e => !e.completed_at);
  const completedCourses = enrollments.filter(e => e.completed_at);

  const stats = [
    { label: "Đang học", value: inProgressCourses.length, icon: BookOpen, color: "text-primary" },
    { label: "Hoàn thành", value: completedCourses.length, icon: Trophy, color: "text-accent" },
    { label: "Tổng khóa học", value: enrollments.length, icon: Target, color: "text-chart-4" },
    { label: "Giờ học", value: enrollments.length * 12, icon: Clock, color: "text-chart-3" }
  ];

  const handleLessonClick = async (courseId: string, lessonId: string) => {
    if (!isLessonCompleted(courseId, lessonId)) {
      await markLessonComplete(courseId, lessonId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Khóa học của tôi
              </h1>
              <p className="text-muted-foreground mt-2">
                Quản lý và theo dõi tiến độ học tập của bạn
              </p>
            </div>
            <Link to="/courses">
              <Button className="gap-2">
                <BookOpen className="w-4 h-4" />
                Khám phá thêm
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Bạn chưa đăng ký khóa học nào
              </h2>
              <p className="text-muted-foreground mb-6">
                Khám phá các khóa học chất lượng và bắt đầu hành trình học tập của bạn
              </p>
              <Link to="/courses">
                <Button>Khám phá khóa học</Button>
              </Link>
            </Card>
          ) : (
            <Tabs defaultValue="in-progress" className="space-y-6">
              <TabsList>
                <TabsTrigger value="in-progress" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Đang học ({inProgressCourses.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  <Trophy className="w-4 h-4" />
                  Hoàn thành ({completedCourses.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="in-progress" className="space-y-6">
                {inProgressCourses.map((enrollment) => {
                  const course = coursesData[enrollment.course_id];
                  if (!course) return null;

                  const progress = getCourseProgress(enrollment.course_id, course.totalLessons);
                  const completedLessons = getCompletedLessonsForCourse(enrollment.course_id);

                  return (
                    <Card key={enrollment.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Course Info */}
                          <div className="lg:w-80 p-6 border-b lg:border-b-0 lg:border-r border-border">
                            <div className="flex gap-4">
                              <img 
                                src={course.image} 
                                alt={course.title}
                                className="w-24 h-24 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <Link to={`/course/${enrollment.course_id}`}>
                                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                    {course.title}
                                  </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground">{course.instructor}</p>
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-muted-foreground">
                                      {completedLessons}/{course.totalLessons} bài học
                                    </span>
                                    <span className="font-medium text-primary">{progress}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Lessons List */}
                          <div className="flex-1 p-6">
                            <h4 className="font-medium text-foreground mb-4">Bài học tiếp theo</h4>
                            <div className="space-y-2">
                              {course.lessons.slice(0, 5).map((lesson) => {
                                const isCompleted = isLessonCompleted(enrollment.course_id, lesson.id);
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(enrollment.course_id, lesson.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${
                                      isCompleted 
                                        ? 'bg-accent/10 border-accent/20' 
                                        : 'bg-muted/50 border-border hover:border-primary/50'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                                    ) : (
                                      <Play className="w-5 h-5 text-primary flex-shrink-0" />
                                    )}
                                    <span className={`text-sm ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                      {lesson.title}
                                    </span>
                                    {!isCompleted && (
                                      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {inProgressCourses.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Bạn đã hoàn thành tất cả khóa học!</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedCourses.map((enrollment) => {
                  const course = coursesData[enrollment.course_id];
                  if (!course) return null;

                  return (
                    <Card key={enrollment.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <Link to={`/course/${enrollment.course_id}`}>
                              <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                                {course.title}
                              </h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">{course.instructor}</p>
                            <Badge className="mt-2 bg-accent text-accent-foreground">
                              <Trophy className="w-3 h-3 mr-1" />
                              Hoàn thành
                            </Badge>
                          </div>
                          <Button variant="outline" className="gap-2">
                            Xem chứng chỉ
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {completedCourses.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">Bạn chưa hoàn thành khóa học nào</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MyLearning;
