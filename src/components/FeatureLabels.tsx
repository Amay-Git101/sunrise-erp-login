import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    label: "Operational Control",
    description: "Complete oversight of all business processes with granular control mechanisms and real-time monitoring capabilities.",
  },
  {
    label: "Real-Time Sync",
    description: "Instantaneous data synchronization across departments, ensuring everyone operates with the latest information.",
  },
  {
    label: "Audit & Accountability",
    description: "Comprehensive logging of all system activities with detailed audit trails for compliance and transparency.",
  },
  {
    label: "Role-Based Access",
    description: "Sophisticated permission structures that ensure users access only what they need, maintaining security boundaries.",
  },
];

const FeatureLabels = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div
            className={cn(
              "feature-label font-sans text-sm lg:text-base text-muted-foreground py-2 pl-6 border-l-2 transition-all duration-300",
              activeIndex === index
                ? "border-primary text-foreground"
                : "border-border/50 hover:border-border"
            )}
          >
            {feature.label}
          </div>

          {/* Hover Panel */}
          <div
            className={cn(
              "absolute left-0 top-full mt-2 w-72 p-4 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-hover transition-all duration-300 z-10",
              activeIndex === index
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <div
              className={cn(
                "absolute -top-2 left-6 w-4 h-4 bg-card border-l border-t border-border rotate-45 transition-opacity duration-300",
                activeIndex === index ? "opacity-100" : "opacity-0"
              )}
            />
            <p className="font-sans text-sm text-foreground/80 leading-relaxed animate-blur-in">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureLabels;
