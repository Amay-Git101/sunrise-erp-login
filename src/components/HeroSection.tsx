const HeroSection = () => {
  return (
    <section className="section-snap min-h-screen flex items-center bg-background pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-0">
        <div className="max-w-3xl">
          {/* Main Heading */}
          <div className="mb-12">
            <h1 className="font-serif text-7xl lg:text-9xl font-medium tracking-tight text-foreground leading-none">
              ERP
            </h1>
            <p className="font-serif text-4xl lg:text-6xl italic text-primary mt-2">
              Solutions
            </p>
          </div>

          {/* Supporting Line */}
          <p className="text-xl lg:text-2xl font-sans text-muted-foreground mb-16 max-w-xl leading-relaxed">
            Centralized control for modern enterprise operations.
          </p>

          {/* Editorial Paragraphs */}
          <div className="space-y-8 mb-16">
            <p className="font-sans text-foreground/80 text-lg leading-relaxed max-w-lg">
              Structured access management, multi-level approvals, comprehensive reporting, 
              and seamless cross-departmental coordination — all unified within a single 
              enterprise platform.
            </p>
            <p className="font-sans text-foreground/80 text-lg leading-relaxed max-w-lg">
              Built for stability, designed for reliability. Your organization's 
              foundation for long-term operational excellence and sustainable growth.
            </p>
          </div>

          {/* Pull Quote */}
          <div className="border-l-2 border-primary pl-8 py-4">
            <p className="font-serif text-2xl lg:text-3xl text-foreground italic leading-snug mb-3">
              "Every action tracked. Every permission justified."
            </p>
            <p className="font-sans text-muted-foreground text-base">
              Accountability isn't optional — it's fundamental.
            </p>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="absolute bottom-12 left-6 right-6 lg:left-12 lg:right-12">
          <div className="max-w-7xl mx-auto">
            <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
