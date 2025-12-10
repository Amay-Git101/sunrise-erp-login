import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  quote: string;
  fullReview: string;
  department: string;
}

const ReviewCard = ({ quote, fullReview, department }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="review-card cursor-pointer">
        <div className="border-t-2 border-primary/30 pt-6">
          <p className="font-serif text-lg text-foreground leading-relaxed mb-4 italic">
            "{quote}"
          </p>
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest">
            {department}
          </p>
        </div>
      </div>

      {/* Expanded Panel */}
      <div
        className={cn(
          "absolute left-0 right-0 bottom-full mb-4 p-6 bg-card border border-border rounded-lg shadow-hover transition-all duration-300 z-20",
          isExpanded
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <p className="font-sans text-foreground/80 leading-relaxed mb-4">
          {fullReview}
        </p>
        <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest">
          {department}
        </p>
        <div className="absolute left-8 -bottom-2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
      </div>
    </div>
  );
};

export default ReviewCard;
