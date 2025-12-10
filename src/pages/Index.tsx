import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LoginSection from "@/components/LoginSection";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  const loginRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header onLogoClick={scrollToTop} onLoginClick={scrollToLogin} />
      <div 
        ref={containerRef}
        className="h-dvh w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        <HeroSection />
        <LoginSection ref={loginRef} />
        <TrustSection />
      </div>
    </>
  );
};

export default Index;