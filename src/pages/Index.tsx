import { useRef } from "react";
import LoginForm from "@/components/LoginForm";
import TrustSection from "@/components/TrustSection";

const Index = () => {
  const loginRef = useRef<HTMLElement>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <main className="flex-1">
        {/* Split Screen Section */}
        <div className="flex flex-col lg:flex-row min-h-screen">

          {/* LEFT COLUMN: BRANDING */}
          <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center p-12 overflow-hidden border-r border-gray-100">
            <div className="relative z-10 max-w-3xl pl-8 animate-slide-in-left">
              
              <div className="mb-12">
                <h1 className="font-serif text-7xl lg:text-9xl font-medium tracking-tight text-gray-900 leading-none">
                  ERP
                </h1>
                <p className="font-serif text-4xl lg:text-6xl italic text-orange-600 mt-2">
                  Solutions
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-8 py-4">
                <p className="font-serif text-2xl lg:text-3xl text-gray-800 italic leading-snug mb-3">
                  "Every action tracked. Every permission justified."
                </p>
                <p className="font-sans text-sm text-gray-500 uppercase tracking-widest font-semibold">
                  Accountability isn't optional — it's fundamental.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: LOGIN FORM */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 bg-gray-50">
            
            {/* Mobile Branding (Visible only on small screens) */}
            <div className="lg:hidden text-center mb-8 animate-fade-in">
              <h1 className="font-serif text-4xl font-medium text-gray-900 tracking-tight">
                ERP <span className="text-orange-600 italic">Solutions</span>
              </h1>
            </div>

            {/* Login Card */}
            <div 
              className="w-full max-w-md animate-slide-in-right" 
             
            >
              <LoginForm />
            </div>

          </div>
        </div>

        {/* TRUST SECTION AT BOTTOM */}
        <TrustSection />

      </main>
    </div>
  );
};

export default Index;