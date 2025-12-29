import { Code, BookOpen, Trophy, Users, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Code,
    title: "Interactive Coding",
    description: "Practice in-browser with our built-in code editor. No setup required.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Courses",
    description: "Learn from 800+ courses covering all major technologies and skills.",
  },
  {
    icon: Trophy,
    title: "Earn Certificates",
    description: "Get verified certificates to showcase your achievements to employers.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from industry experts at Google, Meta, Amazon, and more.",
  },
  {
    icon: Zap,
    title: "Learn 3x Faster",
    description: "Our interactive approach helps you retain knowledge more effectively.",
  },
  {
    icon: Shield,
    title: "Interview Ready",
    description: "Prepare for technical interviews with real-world practice problems.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why developers choose{" "}
            <span className="text-primary">EduLearn</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join millions of developers who have accelerated their careers with our platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
