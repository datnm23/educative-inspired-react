import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, Filter, X, ChevronDown, BookOpen, Users, 
  Clock, Star, Grid3X3, List, SlidersHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  "All Categories",
  "System Design",
  "Interview Prep",
  "Web Development",
  "AI & Machine Learning",
  "Cloud Computing",
  "Data Science",
  "Mobile Development",
  "DevOps",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const durations = [
  "Any Duration",
  "0-2 hours",
  "2-5 hours",
  "5-10 hours",
  "10+ hours",
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const allCourses = [
  {
    id: "1",
    title: "Grokking Modern System Design Interview",
    description: "Master the fundamentals of system design and ace your technical interviews.",
    type: "course" as const,
    category: "System Design",
    level: "Intermediate",
    lessons: 28,
    duration: "12 hours",
    rating: 4.9,
    students: 45230,
    price: 79,
    originalPrice: 199,
    isBestseller: true,
  },
  {
    id: "2",
    title: "Grokking the Coding Interview: Patterns",
    description: "Learn 16 coding patterns to solve any coding interview question effectively.",
    type: "course" as const,
    category: "Interview Prep",
    level: "Intermediate",
    lessons: 45,
    duration: "18 hours",
    rating: 4.8,
    students: 67890,
    price: 89,
    originalPrice: 199,
    isBestseller: true,
  },
  {
    id: "3",
    title: "Complete React Developer Course",
    description: "Build modern web applications with React, Redux, and Next.js from scratch.",
    type: "course" as const,
    category: "Web Development",
    level: "Beginner",
    lessons: 65,
    duration: "25 hours",
    rating: 4.7,
    students: 34567,
    price: 69,
    originalPrice: 149,
    isBestseller: false,
  },
  {
    id: "4",
    title: "Machine Learning A-Z: Hands-On Python",
    description: "Learn ML from scratch with Python, NumPy, and scikit-learn.",
    type: "course" as const,
    category: "AI & Machine Learning",
    level: "Beginner",
    lessons: 55,
    duration: "20 hours",
    rating: 4.9,
    students: 89234,
    price: 99,
    originalPrice: 249,
    isBestseller: true,
  },
  {
    id: "5",
    title: "AWS Certified Solutions Architect",
    description: "Prepare for AWS certification with hands-on labs and practice exams.",
    type: "course" as const,
    category: "Cloud Computing",
    level: "Intermediate",
    lessons: 42,
    duration: "15 hours",
    rating: 4.8,
    students: 28901,
    price: 79,
    originalPrice: 179,
    isBestseller: false,
  },
  {
    id: "6",
    title: "Data Science Bootcamp",
    description: "Complete data science training with Python, Pandas, and visualization.",
    type: "course" as const,
    category: "Data Science",
    level: "Beginner",
    lessons: 80,
    duration: "30 hours",
    rating: 4.6,
    students: 23456,
    price: 89,
    originalPrice: 199,
    isBestseller: false,
  },
  {
    id: "7",
    title: "React Native - Build Mobile Apps",
    description: "Create cross-platform mobile apps for iOS and Android with React Native.",
    type: "course" as const,
    category: "Mobile Development",
    level: "Intermediate",
    lessons: 48,
    duration: "18 hours",
    rating: 4.7,
    students: 19234,
    price: 79,
    originalPrice: 169,
    isBestseller: false,
  },
  {
    id: "8",
    title: "Docker & Kubernetes Complete Guide",
    description: "Master containerization and orchestration for modern DevOps workflows.",
    type: "course" as const,
    category: "DevOps",
    level: "Advanced",
    lessons: 52,
    duration: "22 hours",
    rating: 4.8,
    students: 31234,
    price: 89,
    originalPrice: 189,
    isBestseller: true,
  },
  {
    id: "9",
    title: "Deep Learning Specialization",
    description: "Master deep learning, neural networks, and AI with TensorFlow.",
    type: "course" as const,
    category: "AI & Machine Learning",
    level: "Advanced",
    lessons: 70,
    duration: "35 hours",
    rating: 4.9,
    students: 45678,
    price: 129,
    originalPrice: 299,
    isBestseller: true,
  },
  {
    id: "10",
    title: "Full-Stack JavaScript Developer",
    description: "Become a full-stack developer with Node.js, Express, and MongoDB.",
    type: "course" as const,
    category: "Web Development",
    level: "Beginner",
    lessons: 90,
    duration: "40 hours",
    rating: 4.7,
    students: 56789,
    price: 99,
    originalPrice: 229,
    isBestseller: false,
  },
  {
    id: "11",
    title: "Microservices Architecture Patterns",
    description: "Design and implement scalable microservices with best practices.",
    type: "course" as const,
    category: "System Design",
    level: "Advanced",
    lessons: 35,
    duration: "14 hours",
    rating: 4.8,
    students: 12345,
    price: 89,
    originalPrice: 179,
    isBestseller: false,
  },
  {
    id: "12",
    title: "Google Cloud Platform Essentials",
    description: "Learn GCP fundamentals and prepare for certification exams.",
    type: "course" as const,
    category: "Cloud Computing",
    level: "Beginner",
    lessons: 38,
    duration: "12 hours",
    rating: 4.6,
    students: 18234,
    price: 69,
    originalPrice: 149,
    isBestseller: false,
  },
];

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedDuration, setSelectedDuration] = useState("Any Duration");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter courses
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    
    let matchesDuration = true;
    if (selectedDuration !== "Any Duration") {
      const hours = parseInt(course.duration);
      if (selectedDuration === "0-2 hours") matchesDuration = hours <= 2;
      else if (selectedDuration === "2-5 hours") matchesDuration = hours > 2 && hours <= 5;
      else if (selectedDuration === "5-10 hours") matchesDuration = hours > 5 && hours <= 10;
      else if (selectedDuration === "10+ hours") matchesDuration = hours > 10;
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesDuration;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.id.localeCompare(a.id);
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return b.students - a.students;
    }
  });

  const activeFiltersCount = [
    selectedCategory !== "All Categories",
    selectedLevel !== "All Levels",
    selectedDuration !== "Any Duration",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedLevel("All Levels");
    setSelectedDuration("Any Duration");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-muted/50 py-8 lg:py-12 border-b border-border">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore All Courses
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Discover {allCourses.length}+ courses across various technologies. Learn from industry experts and advance your career.
            </p>
          </div>
        </section>

        <div className="container py-8">
          {/* Search and Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Category */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 pl-4 pr-10 rounded-lg bg-card border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Level */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="h-12 pl-4 pr-10 rounded-lg bg-card border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary/50"
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* Duration */}
              <div className="relative">
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="h-12 pl-4 pr-10 rounded-lg bg-card border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:border-primary/50"
                >
                  {durations.map((dur) => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden bg-card border border-border rounded-lg p-4 mb-6 animate-fade-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground"
                  >
                    {durations.map((dur) => (
                      <option key={dur} value={dur}>{dur}</option>
                    ))}
                  </select>
                </div>
                {activeFiltersCount > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{sortedCourses.length}</span> courses
            </p>
            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 pl-3 pr-8 rounded-lg bg-card border border-border text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:border-primary/50"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="hidden md:flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Course Grid/List */}
          {sortedCourses.length > 0 ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
            }>
              {sortedCourses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className={`group bg-card rounded-xl border border-border overflow-hidden card-hover animate-fade-in-up ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Image */}
                  <div className={`relative bg-gradient-to-br from-primary/20 to-accent/20 ${
                    viewMode === "list" ? "w-48 h-32 shrink-0" : "h-40"
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    {course.isBestseller && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-5 ${viewMode === "list" ? "flex-1 flex flex-col" : ""}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                        {course.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{course.level}</span>
                    </div>

                    <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>

                    {viewMode === "list" && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.lessons} lessons
                      </span>
                    </div>

                    <div className={`flex items-center justify-between ${viewMode === "list" ? "mt-auto" : "pt-3 border-t border-border"}`}>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-card-foreground">{course.rating}</span>
                        <span className="text-xs text-muted-foreground">({course.students.toLocaleString()})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">${course.price}</span>
                        <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
