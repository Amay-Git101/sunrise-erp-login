const HeroSection = () => {
  return (
    <section className="section-snap min-h-screen flex items-center bg-background pt-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-0">
        
        {/* Grid Layout: 1 column on mobile, 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Left Column: Heading + Quote */}
          <div className="flex flex-col h-full justify-between">
            {/* Main Heading */}
            <div className="mb-12">
              <h1 className="font-serif text-7xl lg:text-9xl font-medium tracking-tight text-foreground leading-none">
                ERP
              </h1>
              <p className="font-serif text-4xl lg:text-6xl italic text-primary mt-2">
                Solutions
              </p>
            </div>

            {/* Desktop Quote (Visible on LG screens) */}
            <div className="hidden lg:block mt-auto">
              <div className="border-l-2 border-primary pl-6 py-2">
                <p className="font-serif text-2xl lg:text-3xl text-foreground italic leading-snug mb-3">
                  "Every action tracked. Every permission justified."
                </p>
                <p className="font-sans text-muted-foreground text-sm lg:text-base">
                  Accountability isn't optional — it's fundamental.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Description Text */}
          <div className="space-y-8 pt-2 lg:pt-4">
            {/* Supporting Line */}
            <p className="text-xl lg:text-2xl font-sans text-muted-foreground leading-relaxed">
              Centralized control for modern enterprise operations.
            </p>

            {/* Editorial Paragraphs */}
            <div className="space-y-8">
              <p className="font-sans text-foreground/80 text-lg leading-relaxed">
                Structured access management, multi-level approvals, comprehensive reporting, 
                and seamless cross-departmental coordination — all unified within a single 
                enterprise platform.
              </p>
              <p className="font-sans text-foreground/80 text-lg leading-relaxed">
                Built for stability, designed for reliability. Your organization's 
                foundation for long-term operational excellence and sustainable growth.
              </p>
            </div>

            {/* Mobile Quote (Visible only on small screens) */}
            <div className="lg:hidden mt-8 border-l-2 border-primary pl-6 py-2">
              <p className="font-serif text-2xl text-foreground italic leading-snug mb-3">
                "Every action tracked. Every permission justified."
              </p>
              <p className="font-sans text-muted-foreground text-sm">
                Accountability isn't optional — it's fundamental.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;