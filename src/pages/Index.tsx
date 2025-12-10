import { useRef } from "react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  const loginRef = useRef<HTMLElement>(null);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 1. Header (Fixed at top) */}
      <Header onLogoClick={scrollToTop} />

      <main className="flex-1">
        {/* 2. Split Screen Section */}
        <div className="flex flex-col lg:flex-row min-h-screen pt-16">
          
          {/* --- LEFT COLUMN: Branding --- */}
          {/* Animation: Custom 'animate-slide-in-left' defined in tailwind.config.ts */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-background items-center justify-center p-12 overflow-hidden border-r border-border/50">
            <div className="relative z-10 max-w-3xl pl-8 animate-slide-in-left">
              
              {/* Main Title & Subtitle */}
              <div className="mb-12">
                <h1 className="font-serif text-5xl lg:text-7xl font-medium tracking-tight text-foreground leading-tight mb-4">
                  Sunrise Software Development
                </h1>
                <p className="font-serif text-3xl lg:text-5xl italic text-primary">
                  ERP Solutions
                </p>
              </div>

              {/* Pull Quote */}
              <div className="border-l-4 border-primary pl-8 py-4">
                <p className="font-serif text-2xl lg:text-3xl text-foreground italic leading-snug mb-3">
                  "Every action tracked. Every permission justified."
                </p>
                <p className="font-sans text-muted-foreground text-base">
                  Accountability isn't optional — it's fundamental.
                </p>
              </div>

            </div>
          </div>

          {/* --- STYLISH VERTICAL SEPARATOR (Desktop Only) --- */}
          <div className="hidden lg:flex flex-col justify-center py-20">
            <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-border/60 to-transparent" />
          </div>

          {/* --- RIGHT COLUMN: Login Form --- */}
          {/* Animation: Custom 'animate-slide-in-right' defined in tailwind.config.ts */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-4 pt-8 sm:p-8 lg:p-12 bg-secondary/30">
            
            {/* Mobile-Only Branding (Compact) - Fades in */}
            <div className="lg:hidden text-center mb-6 animate-fade-in">
              <h1 className="font-serif text-3xl font-medium text-foreground tracking-tight">
                Sunrise Software <br /> <span className="text-primary italic">ERP Solutions</span>
              </h1>
            </div>

            {/* Login Form Container - Slides in from Right */}
            {/* Added a small delay-200 class (if supported by tailwindcss-animate) or relying on natural timing */}
            <div 
              className="w-full max-w-md animate-slide-in-right" 
              style={{ animationDelay: "0.2s" }} // Inline style for delay ensures it works
              ref={loginRef as any}
            >
               <LoginForm />
            </div>
          </div>
          
        </div>

        {/* 3. Comment/Review Section & Footer (Appears on Scroll) */}
        <TrustSection />
      </main>
    </div>
  );
};

export default Index;