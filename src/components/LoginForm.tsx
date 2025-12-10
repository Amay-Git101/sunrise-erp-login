import { useState } from "react";
import { Eye, EyeOff, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-card p-8 lg:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-medium text-foreground mb-2">
          Welcome Back
        </h2>
        <p className="font-sans text-muted-foreground text-sm">
          Sign in to access your enterprise dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-sans text-sm font-medium text-foreground">
            Username / Employee ID
          </label>
          <Input
            type="text"
            placeholder="Enter your username"
            className="h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 font-sans"
          />
        </div>

        <div className="space-y-2">
          <label className="font-sans text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 font-sans pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" className="border-border" />
            <label
              htmlFor="remember"
              className="text-sm font-sans text-muted-foreground cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-sans text-primary hover:text-primary/80 transition-colors"
          >
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-sans font-medium text-base transition-all duration-300 hover:shadow-glow"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Shield size={14} />
          <span className="font-sans text-xs">
            Protected by enterprise-grade verification
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
