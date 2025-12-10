import ReviewCard from "./ReviewCard";

const reviews = [
  {
    quote: "Finally, a system that keeps pace with our operations.",
    fullReview: "After years of fragmented tools and manual processes, Sunrise ERP unified our entire operation. The implementation was seamless, and our teams adapted within weeks. Real-time visibility has transformed how we make decisions.",
    department: "Operations Director",
  },
  {
    quote: "Audit preparation went from weeks to hours.",
    fullReview: "Compliance used to be our biggest headache. Now, every transaction is logged, every approval is documented, and generating reports for auditors takes minutes instead of days. The peace of mind is invaluable.",
    department: "Finance Department",
  },
  {
    quote: "Cross-departmental coordination is effortless now.",
    fullReview: "Before Sunrise, getting procurement, manufacturing, and logistics on the same page was a daily battle. Now information flows automatically. Everyone sees the same data, and handoffs happen without friction.",
    department: "Supply Chain Lead",
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
              Trusted by Industry Leaders
            </h2>
            <p className="font-sans text-muted-foreground text-lg max-w-xl mx-auto">
              See how enterprises rely on Sunrise ERP every day
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