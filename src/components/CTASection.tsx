import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 lg:py-24 hero-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-hero-foreground mb-6">
            Ready to start your learning journey?
          </h2>
          <p className="text-lg text-hero-foreground/70 mb-10">
            Join 2.8 million+ developers and start learning today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Start Learning for Free
            </Button>
            <Button variant="heroOutline" size="xl">
              View All Courses
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
