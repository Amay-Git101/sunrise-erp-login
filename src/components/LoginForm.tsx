// src/components/LoginForm.tsx
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, RefreshCw, User, Lock, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom"
// import { API_BASE_URL } from "@/config"; 

const LoginForm = () => {
  const API_BASE_URL = "http://localhost:5162";

  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"login" | "otp">("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  
  const [otp, setOtp] = useState("");
  const [otpDetails, setOtpDetails] = useState<{ userId: number; userLoginId: string; message: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchCaptcha = async () => {
    try {
      setCaptchaInput("");
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.clearRect(0, 0, 140, 48);

      const response = await fetch(`${API_BASE_URL}/api/Auth/generate-captcha`);
      if (!response.ok) throw new Error("Failed to load captcha");
      
      const result = await response.json();
      if (result.success && result.data) {
        setCaptchaId(result.data.captchaId);
        setCaptchaText(result.data.captchaText);
        drawCaptcha(result.data.captchaText);
      }
    } catch (error) {
      console.error("Captcha error:", error);
      toast({ title: "Error", description: "Could not load security check.", variant: "destructive" });
    }
  };

  const loginUser = async () => {
    setIsLoading(true);
    try {
      const payload = {
        userName: username,
        password: password,
        captchaId: captchaId,
        captchaCode: captchaInput
      };

      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.errorType === "captcha_invalid" || result.message?.toLowerCase().includes("captcha")) {
            fetchCaptcha();
        }
        throw new Error(result.message || "Login failed");
      }

      if (result.data?.requiresOTP) {
        setOtpDetails({
          userId: result.data.userId,
          userLoginId: result.data.userLoginId,
          message: result.message || "Enter the OTP sent to your email/mobile"
        });
        setStep("otp");
        toast({ title: "OTP Required", description: result.message });
      } else {
        handleLoginSuccess(result);
      }
    } catch (error: any) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpDetails) return;
    setIsLoading(true);
    try {
      const payload = {
        userId: otpDetails.userId,
        otp: parseInt(otp),
        userLoginId: otpDetails.userLoginId
      };

      const response = await fetch(`${API_BASE_URL}/api/Auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid OTP");
      }

      handleLoginSuccess(result);

    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (result: any) => {
    localStorage.setItem("authToken", result.token);
    localStorage.setItem("userInfo", JSON.stringify(result.data));
    
    if (result.userRights) {
        localStorage.setItem("userRights", JSON.stringify(result.userRights));
    }

    toast({ title: "Success", description: "Logged in successfully!" });
    navigate("/dashboard");
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f3f4f6"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 24px 'Courier New', monospace";
        ctx.fillStyle = "#374151"; 
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        
        const xGap = canvas.width / (text.length + 1);
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            const angle = (Math.random() - 0.5) * 0.4;
            ctx.translate(xGap * (i + 1), canvas.height / 2);
            ctx.rotate(angle);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(100, 100, 100, ${Math.random() * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }
      }
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
        toast({ title: "Validation Error", description: "Username and password are required.", variant: "destructive" });
        return;
    }
    if (!captchaInput) {
        toast({ title: "Validation Error", description: "Please enter the security code.", variant: "destructive" });
        return;
    }
    loginUser();
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    verifyOtp();
  };

  if (step === "otp") {
    return (
        <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-card p-8 lg:p-10 font-sans animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-serif text-2xl font-medium text-foreground mb-2">Verification Required</h2>
                <p className="text-muted-foreground text-sm">{otpDetails?.message}</p>
            </div>
            
            <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">One-Time Password</label>
                    <Input 
                        type="number" 
                        placeholder="Enter 4-digit OTP" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-12 text-center text-lg tracking-widest"
                        autoFocus
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 mt-2">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify & Login"}
                </Button>
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setStep("login")}
                >
                    Back to Login
                </Button>
            </form>
        </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-card p-8 lg:p-10 font-sans">
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl font-medium text-foreground mb-2">Log in to your account</h2>
        <p className="text-muted-foreground text-sm">Enter your credentials to access your ERP dashboard</p>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-1.5">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                placeholder="Enter your username"
                className="h-12 pl-10 bg-secondary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
              placeholder="Enter your password"
              className="h-12 pl-10 bg-secondary/50 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-foreground">Security Check</label>
            <div className="flex items-center gap-3">
                <div className="relative border border-border rounded-md overflow-hidden bg-muted/20 select-none">
                    <canvas 
                        ref={canvasRef} 
                        width="140" 
                        height="48" 
                        className="cursor-pointer"
                        onClick={fetchCaptcha}
                        title="Click to refresh captcha"
                    />
                </div>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={fetchCaptcha}
                    className="shrink-0 h-12 w-12 border-border"
                    title="Refresh Captcha"
                >
                    <RefreshCw size={18} />
                </Button>
            </div>

            <Input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Type the characters above"
                className="h-12 bg-secondary/50"
            />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" className="border-border" />
            <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base mt-4"
        >
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Signing In...</> : "Sign In"}
        </Button>

        <div className="flex items-center justify-center text-sm pt-4">
            <span className="text-muted-foreground">Don't have an account?</span>
            <a href="#" className="ml-1 text-primary hover:underline font-medium">Register</a>
        </div>

      </form>
    </div>
  );
};

export default LoginForm;