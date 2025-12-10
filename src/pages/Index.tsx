import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import LoginSection from "@/components/LoginSection";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  const loginRef = useRef<HTMLDivElement>(null);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <Header onLogoClick={scrollToLogin} />
      <HeroSection />
      <div ref={loginRef}>
        <LoginSection />
      </div>
      <TrustSection />
    </div>
  );
};

export default Index;
