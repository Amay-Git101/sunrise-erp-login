import LoginForm from "./LoginForm";
import FeatureLabels from "./FeatureLabels";

const LoginSection = () => {
  return (
    <section id="login" className="section-snap min-h-screen flex items-center bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Side - Editorial Content */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <h3 className="font-serif text-2xl lg:text-3xl font-medium text-foreground mb-8 leading-snug">
              Why teams rely on Sunrise ERP
            </h3>

            <div className="space-y-6 text-foreground/70 font-sans">
              <p className="leading-relaxed">
                <span className="text-foreground font-medium">Workflow control</span> across 
                every department. From procurement to fulfillment, each process flows through 
                defined channels with clear accountability at every stage.
              </p>
              <p className="leading-relaxed">
                <span className="text-foreground font-medium">Live operational visibility</span> that 
                transforms raw data into actionable insights. Dashboards that speak your 
                language, metrics that matter to your business.
              </p>
              <p className="leading-relaxed">
                <span className="text-foreground font-medium">Long-term audit accountability</span> built 
                into the foundation. Every transaction, every approval, every change — 
                documented and accessible for compliance reviews.
              </p>
            </div>
          </div>

          {/* Center - Login Form */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <LoginForm />
          </div>

          {/* Right Side - Feature Labels */}
          <div className="lg:col-span-3 order-3 hidden lg:block">
            <FeatureLabels />
          </div>
        </div>

        {/* Mobile Feature Labels */}
        <div className="lg:hidden mt-16">
          <div className="overflow-x-auto pb-4 -mx-6 px-6">
            <div className="flex gap-4 min-w-max">
              {["Operational Control", "Real-Time Sync", "Audit & Accountability", "Role-Based Access"].map((label, i) => (
                <div
                  key={i}
                  className="px-4 py-3 bg-secondary/50 border border-border rounded-lg font-sans text-sm text-foreground/80 whitespace-nowrap"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
