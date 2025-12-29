import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickLinks = [
  { label: "System Design", href: "#" },
  { label: "Interview Prep", href: "#" },
  { label: "React", href: "#" },
  { label: "Python", href: "#" },
  { label: "Machine Learning", href: "#" },
];

const companies = [
  "Google", "Meta", "Amazon", "Netflix", "Apple", "Microsoft"
];

const HeroSection = () => {
  return (
    <section className="hero-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hero-foreground mb-6 animate-fade-in-up">
            Learn tech skills{" "}
            <span className="text-primary">3x faster</span>
            <br />
            with interactive courses
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-hero-foreground/70 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-100">
            Join millions of developers mastering new skills through hands-on coding exercises and real-world projects.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="I want to learn..."
                className="w-full h-14 pl-12 pr-32 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-hero-foreground placeholder:text-hero-foreground/50 focus:outline-none focus:border-primary/50 transition-all duration-300"
              />
              <Button 
                variant="hero" 
                size="lg" 
                className="absolute right-2"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-16 animate-fade-in-up animation-delay-300">
            <span className="text-hero-foreground/60 text-sm self-center">Popular:</span>
            {quickLinks.map((link) => (
              <Button
                key={link.label}
                variant="heroOutline"
                size="sm"
                className="group"
              >
                {link.label}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            ))}
          </div>

          {/* Social Proof */}
          <div className="animate-fade-in-up animation-delay-400">
            <p className="text-hero-foreground/60 text-sm mb-6">
              Join <span className="text-primary font-semibold">2.8 million+</span> developers working at
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {companies.map((company) => (
                <span
                  key={company}
                  className="text-hero-foreground/40 font-semibold text-lg hover:text-hero-foreground/70 transition-colors cursor-default"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
