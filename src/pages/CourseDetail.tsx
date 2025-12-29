import { useParams, Link } from "react-router-dom";
import { 
  Play, Clock, BookOpen, Users, Star, Award, CheckCircle, 
  ChevronDown, ChevronRight, Globe, Calendar, BarChart3,
  Share2, Heart, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const courseData = {
  id: "1",
  title: "Grokking Modern System Design Interview",
  description: "Master the fundamentals of system design and ace your technical interviews at top companies. Learn how to design scalable, distributed systems from scratch.",
  longDescription: "This comprehensive course covers everything you need to know about system design interviews. From basic concepts to advanced distributed systems, you'll learn how to approach any system design problem with confidence. Perfect for software engineers preparing for interviews at FAANG companies.",
  instructor: {
    name: "Alex Chen",
    title: "Staff Engineer at Google",
    avatar: "",
    bio: "Alex has 10+ years of experience building large-scale distributed systems. Previously worked at Meta and Amazon.",
    courses: 12,
    students: 125000,
    rating: 4.9,
  },
  rating: 4.9,
  reviewsCount: 2345,
  students: 45230,
  duration: "12 hours",
  lessons: 28,
  level: "Intermediate",
  language: "English",
  lastUpdated: "December 2024",
  price: 79,
  originalPrice: 199,
  features: [
    "28 interactive lessons",
    "12+ hours of content",
    "Hands-on coding exercises",
    "Certificate of completion",
    "Lifetime access",
    "Mobile and desktop access",
  ],
  curriculum: [
    {
      title: "Introduction to System Design",
      lessons: [
        { title: "What is System Design?", duration: "15 min", isPreview: true },
        { title: "How to Approach System Design", duration: "20 min", isPreview: false },
        { title: "Key Concepts Overview", duration: "25 min", isPreview: false },
      ],
    },
    {
      title: "Scalability Fundamentals",
      lessons: [
        { title: "Horizontal vs Vertical Scaling", duration: "18 min", isPreview: false },
        { title: "Load Balancing Techniques", duration: "22 min", isPreview: false },
        { title: "Caching Strategies", duration: "30 min", isPreview: false },
        { title: "Database Sharding", duration: "28 min", isPreview: false },
      ],
    },
    {
      title: "Distributed Systems",
      lessons: [
        { title: "CAP Theorem Explained", duration: "20 min", isPreview: false },
        { title: "Consistency Patterns", duration: "25 min", isPreview: false },
        { title: "Message Queues", duration: "22 min", isPreview: false },
      ],
    },
    {
      title: "Real-World System Design",
      lessons: [
        { title: "Design a URL Shortener", duration: "35 min", isPreview: true },
        { title: "Design Twitter", duration: "45 min", isPreview: false },
        { title: "Design Netflix", duration: "50 min", isPreview: false },
        { title: "Design Uber", duration: "48 min", isPreview: false },
      ],
    },
  ],
  reviews: [
    {
      id: 1,
      user: "Michael T.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent course! The system design patterns explained here helped me land a job at Google. Highly recommended for anyone preparing for tech interviews.",
    },
    {
      id: 2,
      user: "Sarah K.",
      rating: 5,
      date: "1 month ago",
      comment: "Very well structured content. The real-world examples like designing Twitter and Netflix were incredibly helpful.",
    },
    {
      id: 3,
      user: "David L.",
      rating: 4,
      date: "1 month ago",
      comment: "Great course overall. Would love to see more content on microservices architecture.",
    },
  ],
};

const CourseDetail = () => {
  const { id } = useParams();
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const totalLessons = courseData.curriculum.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );

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
              Back to Courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    Bestseller
                  </span>
                  <span className="px-3 py-1 bg-hero-foreground/10 text-hero-foreground rounded-full text-sm">
                    {courseData.level}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hero-foreground mb-4">
                  {courseData.title}
                </h1>

                <p className="text-lg text-hero-foreground/80 mb-6">
                  {courseData.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-hero-foreground">{courseData.rating}</span>
                    <span className="text-hero-foreground/60">({courseData.reviewsCount.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-hero-foreground/60">
                    <Users className="w-4 h-4" />
                    {courseData.students.toLocaleString()} students
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {courseData.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-hero-foreground font-medium">{courseData.instructor.name}</p>
                    <p className="text-hero-foreground/60 text-sm">{courseData.instructor.title}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-hero-foreground/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Updated {courseData.lastUpdated}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    {courseData.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {courseData.level}
                  </span>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-card-hover sticky top-24">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-6 flex items-center justify-center">
                    <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:bg-primary-hover transition-colors">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-foreground">${courseData.price}</span>
                    <span className="text-lg text-muted-foreground line-through">${courseData.originalPrice}</span>
                    <span className="px-2 py-1 bg-destructive/10 text-destructive text-sm font-medium rounded">
                      60% OFF
                    </span>
                  </div>

                  <Button variant="hero" size="lg" className="w-full mb-3">
                    Enroll Now
                  </Button>
                  <Button variant="outline" size="lg" className="w-full mb-4">
                    Try for Free
                  </Button>

                  <p className="text-center text-sm text-muted-foreground mb-6">
                    30-day money-back guarantee
                  </p>

                  <div className="space-y-3">
                    <p className="font-semibold text-foreground">This course includes:</p>
                    {courseData.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-12">
                {/* What you'll learn */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">What you'll learn</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Design scalable distributed systems",
                      "Master load balancing techniques",
                      "Implement caching strategies",
                      "Handle database sharding",
                      "Understand CAP theorem",
                      "Build message queue systems",
                      "Design real-world systems",
                      "Ace system design interviews",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curriculum */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Course Curriculum</h2>
                    <span className="text-muted-foreground text-sm">
                      {courseData.curriculum.length} sections • {totalLessons} lessons • {courseData.duration}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {courseData.curriculum.map((section, index) => (
                      <div key={index} className="border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(index)}
                          className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedSections.includes(index) ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                            <span className="font-medium text-foreground">{section.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {section.lessons.length} lessons
                          </span>
                        </button>

                        {expandedSections.includes(index) && (
                          <div className="divide-y divide-border">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Play className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-foreground">{lesson.title}</span>
                                  {lesson.isPreview && (
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded">
                                      Preview
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructor */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Your Instructor</h2>
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-2xl">
                          {courseData.instructor.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{courseData.instructor.name}</h3>
                        <p className="text-muted-foreground mb-3">{courseData.instructor.title}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {courseData.instructor.rating} rating
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {courseData.instructor.students.toLocaleString()} students
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {courseData.instructor.courses} courses
                          </span>
                        </div>
                        <p className="text-foreground">{courseData.instructor.bio}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Student Reviews</h2>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-foreground">{courseData.rating}</span>
                      <span className="text-muted-foreground">({courseData.reviewsCount.toLocaleString()} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {courseData.reviews.map((review) => (
                      <div key={review.id} className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium">{review.user.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{review.user}</p>
                              <p className="text-sm text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-6">
                    Show all reviews
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
