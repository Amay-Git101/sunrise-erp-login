import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Shield, RefreshCw, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState(""); 
  
  // Validation Errors
  const [usernameError, setUsernameError] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- CAPTCHA GENERATOR ---
  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput(""); 
    setCaptchaError("");
    drawCaptcha(code);
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Background
        ctx.fillStyle = "#f3f4f6"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        ctx.font = "bold 24px 'Courier New', monospace";
        ctx.fillStyle = "#374151"; 
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        
        const xGap = canvas.width / 7;
        for (let i = 0; i < code.length; i++) {
            ctx.save();
            const angle = (Math.random() - 0.5) * 0.4;
            ctx.translate(xGap * (i + 1), canvas.height / 2);
            ctx.rotate(angle);
            ctx.fillText(code[i], 0, 0);
            ctx.restore();
        }

        // Draw Noise Lines
        for (let i = 0; i < 7; i++) {
            ctx.strokeStyle = `rgba(100, 100, 100, ${Math.random() * 0.5})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
      }
    }
  };

  // Generate on mount
  useEffect(() => {
    generateCaptcha();
  }, []);


  // --- HANDLERS ---

  // Username Handler: No spaces allowed
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, ''); // Block spaces
    setUsername(val);
    if (val.length > 0) setUsernameError("");
  };

  // Password Handler: No spaces allowed
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\s/g, ''); // Block spaces
    setPassword(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate Username
    if (!username) {
        setUsernameError("Username is required");
        return;
    }

    // 2. Validate Password (Simple required check only)
    if (!password) {
        alert("Password is required");
        return;
    }

    // 3. Validate Captcha
    if (captchaInput !== captchaCode) {
        setCaptchaError("Incorrect Captcha. Please try again.");
        generateCaptcha();
        return;
    }

    // Success
    setCaptchaError("");
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-card p-8 lg:p-10 font-sans">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-medium text-foreground mb-2">
          Log in to your account
        </h2>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your ERP dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-1.5">
        
        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text" 
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
                className={`h-12 pl-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 ${usernameError ? "border-red-500 focus:ring-red-200" : ""}`}
            />
          </div>
          {usernameError && (
            <p className="text-xs text-red-500">{usernameError}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="h-12 pl-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 pr-12"
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

        {/* Captcha Section */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Security Check
            </label>
            <div className="flex items-center gap-3">
                {/* Canvas Area */}
                <div className="relative border border-border rounded-md overflow-hidden bg-muted/20 select-none">
                    <canvas 
                        ref={canvasRef} 
                        width="140" 
                        height="48" 
                        className="cursor-pointer"
                        onClick={generateCaptcha}
                        title="Click to refresh captcha"
                    />
                </div>
                
                {/* Refresh Button - Styled to look better on hover */}
                <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={generateCaptcha}
                    className="shrink-0 h-12 w-12 border-border hover:bg-transparent hover:border-primary hover:text-primary transition-colors"
                    title="Refresh Captcha"
                >
                    <RefreshCw size={18} />
                </Button>
            </div>

            {/* Captcha Input */}
            <Input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Type the characters above"
                className={`h-12 bg-secondary/50 border-border focus:border-primary focus:ring-primary/20 ${captchaError ? "border-red-500 focus:ring-red-200" : ""}`}
            />
            {captchaError && (
                <p className="text-xs text-red-500">{captchaError}</p>
            )}
        </div>

        {/* Remember / Forgot Password */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" className="border-border" />
            <label
              htmlFor="remember"
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot Password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base transition-all duration-300 hover:shadow-glow mt-4"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>

        {/* Footer Links */}
        <div className="flex items-center justify-center text-sm pt-4">
          <a href="#" className="text-primary hover:text-primary/80 hover:underline font-medium">
            Create Account
          </a>
          
          <span className="mx-3 text-muted-foreground/30 text-lg font-light">|</span>
          
          <a href="#" className="text-primary hover:text-primary/80 hover:underline font-medium">
            Need Help?
          </a>
        </div>

      </form>
    </div>
  );
};

export default LoginForm;