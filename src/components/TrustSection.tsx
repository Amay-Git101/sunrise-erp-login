import ReviewCard from "./ReviewCard";

const reviews = [
  {
    quote: "Custom Tailoring Operations.",
    fullReview: "Order tracking, customer measurements, and production status finally live in one place. Our tailoring workflow is no longer scattered across teams",
    department: "Tailoring Website Industry",
  },
  {
    quote: "Payroll & HR Department.",
    fullReview: "Salary processing, attendance, and compliance used to take days. Now payroll closes on time without last-minute chaos.",
    department: "Payroll Industry",
  },
  {
    quote: "Transportation Industry.",
    fullReview: "Vehicle logs, route planning, and driver accountability became transparent. We finally operate with data instead of assumptions.",
    department: "Transportation & Fleet Management",
  },
];

const TrustSection = () => {
  return (
    <section className="section-snap min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-medium text-foreground mb-4">
              Trusted Across Core Business Operations
            </h2>
            <p className="font-sans text-muted-foreground text-lg max-w-xl mx-auto">
              How Sunrise Software Development supports tailored softwares, payroll, and transportation teams every day
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="md:hidden mt-8 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-border"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-surface-dark border-t border-divider-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left */}
            <div className="text-center lg:text-left">
              <p className="font-sans text-sm text-surface-dark-foreground/60">
                © 2025 Sunrise ERP. All rights reserved.
              </p>
              <p className="font-serif text-xs text-surface-dark-foreground/40 italic mt-1">
                Building structure. Driving clarity.
              </p>
            </div>

            {/* Divider - Desktop */}
            <div className="hidden lg:block w-px h-10 bg-white/20" />

            {/* Right */}
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="font-sans text-sm text-surface-dark-foreground/60 hover:text-primary transition-colors underline-reveal"
              >
                Privacy
              </a>
              <span className="text-white/40">•</span>
              <a
                href="#"
                className="font-sans text-sm text-surface-dark-foreground/60 hover:text-primary transition-colors underline-reveal"
              >
                Terms
              </a>
              <span className="text-white/40">•</span>
              <a
                href="#"
                className="font-sans text-sm text-surface-dark-foreground/60 hover:text-primary transition-colors underline-reveal"
              >
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default TrustSection;