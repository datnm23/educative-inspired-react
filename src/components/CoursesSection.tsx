import { useState } from "react";
import CourseCard from "./CourseCard";

const categories = [
  "Most Popular",
  "System Design",
  "Interview Prep",
  "Web Development",
  "AI & Machine Learning",
  "Cloud Computing",
  "Data Science",
];

const courses = [
  {
    title: "Grokking Modern System Design Interview",
    description: "Master the fundamentals of system design and ace your technical interviews at top companies.",
    type: "course" as const,
    lessons: 28,
    duration: "12 hours",
    rating: 4.9,
    students: 45230,
  },
  {
    title: "Grokking the Coding Interview: Patterns",
    description: "Learn 16 coding patterns to solve any coding interview question effectively.",
    type: "course" as const,
    lessons: 45,
    duration: "18 hours",
    rating: 4.8,
    students: 67890,
  },
  {
    title: "Web Development Learning Path",
    description: "Complete path from beginner to professional full-stack web developer.",
    type: "path" as const,
    lessons: 120,
    duration: "60 hours",
    rating: 4.7,
    students: 23456,
  },
  {
    title: "Build a Real-time Chat Application",
    description: "Hands-on project to build a complete chat app with React and Node.js.",
    type: "project" as const,
    lessons: 15,
    duration: "6 hours",
    rating: 4.8,
    students: 12345,
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Learn ML from scratch with Python, NumPy, and scikit-learn.",
    type: "course" as const,
    lessons: 35,
    duration: "15 hours",
    rating: 4.9,
    students: 34567,
  },
  {
    title: "AWS Certified Solutions Architect",
    description: "Prepare for AWS certification with hands-on labs and practice exams.",
    type: "course" as const,
    lessons: 42,
    duration: "20 hours",
    rating: 4.8,
    students: 28901,
  },
  {
    title: "React & TypeScript Mastery",
    description: "Build type-safe, scalable applications with React and TypeScript.",
    type: "course" as const,
    lessons: 32,
    duration: "14 hours",
    rating: 4.9,
    students: 19234,
  },
  {
    title: "Data Structures & Algorithms in Python",
    description: "Master essential data structures and algorithms for coding interviews.",
    type: "course" as const,
    lessons: 50,
    duration: "22 hours",
    rating: 4.7,
    students: 56789,
  },
];

const CoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState("Most Popular");

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular roadmaps & learning guides
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trending resources on in-demand topics. All recently published and/or updated.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 gap-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-full transition-all duration-200 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div
              key={course.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CourseCard {...course} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            View all courses
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
