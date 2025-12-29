import { BookOpen, Users, Clock, Star, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  title: string;
  description: string;
  type: "course" | "path" | "project";
  lessons?: number;
  duration?: string;
  rating?: number;
  students?: number;
  image?: string;
}

const typeStyles = {
  course: "bg-primary/10 text-primary",
  path: "bg-purple-100 text-purple-600",
  project: "bg-orange-100 text-orange-600",
};

const CourseCard = ({
  title,
  description,
  type,
  lessons = 12,
  duration = "4 hours",
  rating = 4.8,
  students = 1234,
}: CourseCardProps) => {
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden card-hover cursor-pointer">
      {/* Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        <button className="absolute top-3 right-3 p-2 bg-card/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Bookmark className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Type Badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${typeStyles[type]}`}>
          <BookOpen className="w-3 h-3" />
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {lessons} lessons
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-card-foreground">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {students.toLocaleString()} students
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
