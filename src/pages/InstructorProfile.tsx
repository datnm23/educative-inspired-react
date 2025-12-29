import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Star, Users, BookOpen, Award, Play, Globe, 
  Linkedin, Twitter, ArrowLeft, Clock, UserPlus, UserMinus, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useInstructorFollow } from "@/hooks/useInstructorFollow";

// Mock instructor data
const instructorsData: Record<string, {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  fullBio: string;
  rating: number;
  reviewsCount: number;
  students: number;
  courses: number;
  specialties: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  coursesList: {
    id: string;
    title: string;
    image: string;
    rating: number;
    students: number;
    duration: string;
    price: number;
  }[];
  achievements: string[];
}> = {
  "1": {
    id: "1",
    name: "Alex Chen",
    title: "Staff Engineer",
    company: "Google",
    avatar: "",
    bio: "Alex has 10+ years of experience building large-scale distributed systems.",
    fullBio: `Alex Chen là một Staff Engineer tại Google với hơn 10 năm kinh nghiệm trong việc xây dựng các hệ thống phân tán quy mô lớn. Trước đó, anh đã làm việc tại Meta và Amazon, nơi anh dẫn dắt các dự án quan trọng về infrastructure và platform engineering.

Với niềm đam mê chia sẻ kiến thức, Alex đã giúp hơn 125,000 học viên trên toàn thế giới nắm vững các khái niệm về system design thông qua các khóa học trực tuyến. Phương pháp giảng dạy của anh tập trung vào việc giải thích các khái niệm phức tạp một cách đơn giản và dễ hiểu.

Alex tốt nghiệp Thạc sĩ Khoa học Máy tính tại Stanford University và có nhiều bằng sáng chế trong lĩnh vực distributed computing.`,
    rating: 4.9,
    reviewsCount: 8456,
    students: 125000,
    courses: 12,
    specialties: ["System Design", "Distributed Systems", "Cloud Architecture", "Microservices", "Database Design"],
    social: {
      linkedin: "https://linkedin.com/in/alexchen",
      twitter: "https://twitter.com/alexchen",
      website: "https://alexchen.dev"
    },
    coursesList: [
      {
        id: "1",
        title: "Grokking Modern System Design Interview",
        image: "/placeholder.svg",
        rating: 4.9,
        students: 45230,
        duration: "12 hours",
        price: 79
      },
      {
        id: "2",
        title: "Distributed Systems Fundamentals",
        image: "/placeholder.svg",
        rating: 4.8,
        students: 32150,
        duration: "15 hours",
        price: 89
      },
      {
        id: "3",
        title: "Cloud Architecture Masterclass",
        image: "/placeholder.svg",
        rating: 4.7,
        students: 28400,
        duration: "18 hours",
        price: 99
      },
      {
        id: "4",
        title: "Database Design & Optimization",
        image: "/placeholder.svg",
        rating: 4.8,
        students: 19220,
        duration: "10 hours",
        price: 69
      }
    ],
    achievements: [
      "Hơn 125,000 học viên trên toàn cầu",
      "Rating trung bình 4.9/5 sao",
      "12 khóa học chất lượng cao",
      "Diễn giả tại Google I/O, AWS re:Invent",
      "Tác giả sách 'Designing Data-Intensive Applications'"
    ]
  },
  "2": {
    id: "2",
    name: "Sarah Johnson",
    title: "Senior Frontend Engineer",
    company: "Meta",
    avatar: "",
    bio: "Sarah specializes in React and modern frontend development.",
    fullBio: `Sarah Johnson là Senior Frontend Engineer tại Meta với hơn 8 năm kinh nghiệm trong phát triển web. Cô chuyên về React, TypeScript và các công nghệ frontend hiện đại.

Sarah đã đóng góp vào nhiều dự án open-source lớn và là một speaker thường xuyên tại các hội nghị công nghệ như React Conf và JSConf. Cô có đam mê với việc tạo ra những trải nghiệm người dùng tuyệt vời và chia sẻ kiến thức với cộng đồng.`,
    rating: 4.8,
    reviewsCount: 5234,
    students: 89000,
    courses: 8,
    specialties: ["React", "TypeScript", "Next.js", "CSS/Tailwind", "Performance Optimization"],
    social: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahj_dev"
    },
    coursesList: [
      {
        id: "5",
        title: "Complete React Developer Course",
        image: "/placeholder.svg",
        rating: 4.8,
        students: 35000,
        duration: "20 hours",
        price: 79
      },
      {
        id: "6",
        title: "TypeScript Mastery",
        image: "/placeholder.svg",
        rating: 4.7,
        students: 28000,
        duration: "14 hours",
        price: 69
      }
    ],
    achievements: [
      "Hơn 89,000 học viên",
      "Contributor React Core Team",
      "Speaker tại React Conf 2023"
    ]
  }
};

const InstructorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFollowing, followInstructor, unfollowInstructor, loading: followLoading } = useInstructorFollow();
  const [actionLoading, setActionLoading] = useState(false);
  
  const instructor = instructorsData[id || "1"] || instructorsData["1"];
  const following = isFollowing(instructor.id);

  const handleFollowToggle = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setActionLoading(true);
    if (following) {
      await unfollowInstructor(instructor.id, instructor.name);
    } else {
      await followInstructor(instructor.id, instructor.name);
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-12 lg:py-16">
          <div className="container">
            <Link 
              to="/courses" 
              className="inline-flex items-center gap-2 text-hero-foreground/70 hover:text-hero-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Khóa học
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-5xl md:text-6xl">
                  {instructor.name.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hero-foreground mb-2">
                  {instructor.name}
                </h1>
                <p className="text-xl text-hero-foreground/80 mb-4">
                  {instructor.title} tại {instructor.company}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-hero-foreground">{instructor.rating}</span>
                    <span className="text-hero-foreground/60">({instructor.reviewsCount.toLocaleString()} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2 text-hero-foreground/70">
                    <Users className="w-5 h-5" />
                    <span>{instructor.students.toLocaleString()} học viên</span>
                  </div>
                  <div className="flex items-center gap-2 text-hero-foreground/70">
                    <BookOpen className="w-5 h-5" />
                    <span>{instructor.courses} khóa học</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-3">
                  {instructor.social.linkedin && (
                    <a 
                      href={instructor.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-hero-foreground/10 rounded-lg hover:bg-hero-foreground/20 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-hero-foreground" />
                    </a>
                  )}
                  {instructor.social.twitter && (
                    <a 
                      href={instructor.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-hero-foreground/10 rounded-lg hover:bg-hero-foreground/20 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-hero-foreground" />
                    </a>
                  )}
                  {instructor.social.website && (
                    <a 
                      href={instructor.social.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-hero-foreground/10 rounded-lg hover:bg-hero-foreground/20 transition-colors"
                    >
                      <Globe className="w-5 h-5 text-hero-foreground" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* About */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Giới thiệu</h2>
                  <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-line">
                    {instructor.fullBio}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Chuyên môn</h2>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Courses */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Khóa học của {instructor.name.split(' ')[0]} ({instructor.coursesList.length})
                  </h2>
                  <div className="grid gap-4">
                    {instructor.coursesList.map((course) => (
                      <Link key={course.id} to={`/courses/${course.id}`}>
                        <Card className="hover:shadow-card-hover transition-all duration-300 group">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="w-40 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Play className="w-8 h-8 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                  {course.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                                  <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    {course.rating}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {course.students.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {course.duration}
                                  </span>
                                </div>
                                <p className="font-bold text-primary">${course.price}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Thành tựu
                    </h3>
                    <ul className="space-y-3">
                      {instructor.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>

                    <Separator className="my-6" />

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{instructor.courses}</p>
                        <p className="text-sm text-muted-foreground">Khóa học</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{(instructor.students / 1000).toFixed(0)}K</p>
                        <p className="text-sm text-muted-foreground">Học viên</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{instructor.rating}</p>
                        <p className="text-sm text-muted-foreground">Đánh giá</p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">{(instructor.reviewsCount / 1000).toFixed(1)}K</p>
                        <p className="text-sm text-muted-foreground">Reviews</p>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      variant={following ? "outline" : "default"}
                      onClick={handleFollowToggle}
                      disabled={actionLoading || followLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : following ? (
                        <UserMinus className="w-4 h-4 mr-2" />
                      ) : (
                        <UserPlus className="w-4 h-4 mr-2" />
                      )}
                      {following ? 'Đang theo dõi' : 'Theo dõi giảng viên'}
                    </Button>
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

export default InstructorProfile;