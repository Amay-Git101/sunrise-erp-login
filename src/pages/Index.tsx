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
          
          {/* --- LEFT COLUMN: Desktop Branding (Hidden on Mobile) --- */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-background items-center justify-center p-12 overflow-hidden">
            <div className="relative z-10 max-w-2xl animate-fade-in pl-8">
              <div className="mb-12">
                <h1 className="font-serif text-7xl lg:text-9xl font-medium tracking-tight text-foreground leading-none">
                  ERP
                </h1>
                <p className="font-serif text-4xl lg:text-6xl italic text-primary mt-2">
                  Solutions
                </p>
              </div>
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

          {/* --- RIGHT COLUMN: Login Form & Mobile Branding --- */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-start lg:justify-center p-4 pt-8 sm:p-8 lg:p-12 bg-secondary/30">
            
            {/* Mobile-Only Branding (Compact) */}
            <div className="lg:hidden text-center mb-6 animate-fade-in">
              <h1 className="font-serif text-4xl font-medium text-foreground tracking-tight">
                ERP <span className="text-primary italic">Solutions</span>
              </h1>
              <p className="font-sans text-xs text-muted-foreground mt-2">
                Secure Enterprise Access
              </p>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-md animate-scale-in" ref={loginRef as any}>
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