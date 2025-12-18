import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, RefreshCw, User, Lock, KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config"; // <--- IMPORT CONFIG

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"login" | "otp">("login");

  // Form Fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpDetails, setOtpDetails] = useState<{ userId: number; userLoginId: string; message: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- CAPTCHA LOGIC ---
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
        drawCaptcha(result.data.captchaText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f3f4f6"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "bold 24px monospace"; ctx.fillStyle = "#374151"; 
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        for(let i=0; i<5; i++) {
            ctx.strokeStyle = '#d1d5db';
            ctx.beginPath();
            ctx.moveTo(Math.random()*140, Math.random()*48);
            ctx.lineTo(Math.random()*140, Math.random()*48);
            ctx.stroke();
        }
      }
    }
  };

  useEffect(() => { fetchCaptcha(); }, []);

  // --- LOGIN LOGIC ---
  const loginUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userName: username, 
            password: password, 
            captchaId: captchaId, 
            captchaCode: captchaInput // This will be uppercase now
        })
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        if (result.message?.toLowerCase().includes("captcha") || result.errorType === "captcha_invalid") {
            fetchCaptcha();
            toast({ title: "Security Check Failed", description: "Please try the captcha again.", variant: "destructive" });
        } else {
            toast({ title: "Login Failed", description: result.message || "Invalid credentials", variant: "destructive" });
        }
        throw new Error(result.message);
      }

      if (result.data?.requiresOTP) {
        setOtpDetails({
          userId: result.data.userId,
          userLoginId: result.data.userLoginId,
          message: result.message || "Enter OTP sent to your mobile"
        });
        setStep("otp");
        toast({ title: "OTP Sent", description: "Please check your mobile/email." });
      } else {
        handleLoginSuccess(result);
      }
    } catch (error) {
       // handled above
    } finally {
      setIsLoading(false);
    }
  };

  // --- OTP LOGIC ---
  const verifyOtp = async () => {
    if (!otpDetails) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: otpDetails.userId, otp: parseInt(otp), userLoginId: otpDetails.userLoginId })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Invalid OTP");
      handleLoginSuccess(result);
    } catch (error: any) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // --- FIXED: ROBUST TOKEN SAVING ---
  const handleLoginSuccess = (result: any) => {
    console.log("Login Response Debug:", result); // <--- Check Console for this!

    // 1. Check all possible locations for the token
    const token = result.token || result.data?.token || result.data?.jwt;

    if (!token) {
        console.error("CRITICAL ERROR: No token found in response", result);
        toast({ 
            title: "Login Error", 
            description: "Server did not return an authentication token.", 
            variant: "destructive" 
        });
        return;
    }

    // 2. Save Valid Token
    localStorage.setItem("authToken", token);
    
    // 3. Save User Info
    const userData = result.data || result.user || {};
    localStorage.setItem("userInfo", JSON.stringify(userData));

    toast({ title: "Welcome back!", description: "Redirecting to dashboard..." });
    navigate("/dashboard");
  };

  // --- UI ---
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8 w-full">
        
        {step === "otp" ? (
            <div className="animate-in fade-in slide-in-from-right-4">
                <div className="text-center mb-6">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <KeyRound className="w-6 h-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Verification Required</h2>
                    <p className="text-gray-500 text-sm mt-1">{otpDetails?.message}</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if(otp) verifyOtp(); }} className="space-y-4">
                    <Input 
                        type="number" 
                        placeholder="Enter OTP" 
                        value={otp} 
                        onChange={e => setOtp(e.target.value)} 
                        className="text-center text-lg tracking-widest h-12 bg-gray-50" 
                        autoFocus 
                    />
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Verify & Login"}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("login")}>Back to Login</Button>
                </form>
            </div>
        ) : (
            <div className="animate-in fade-in slide-in-from-left-4">
                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl font-medium text-gray-900 mb-2">Log in to your account</h2>
                    <p className="text-gray-500 text-sm">Enter your credentials to access your ERP dashboard</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); loginUser(); }} className="space-y-5">
                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username" 
                                className="pl-10 h-11 bg-gray-50" 
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input 
                                type={showPassword ? "text" : "password"} 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password" 
                                className="pl-10 pr-10 h-11 bg-gray-50" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Captcha - NOW AUTO UPPERCASE */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Security Check</label>
                        <div className="flex gap-2">
                            <canvas 
                                ref={canvasRef} 
                                width="140" 
                                height="44" 
                                className="border border-gray-300 rounded bg-gray-100 cursor-pointer" 
                                onClick={fetchCaptcha} 
                                title="Click to refresh"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={fetchCaptcha} className="h-11 w-11 shrink-0">
                                <RefreshCw size={18} />
                            </Button>
                        </div>
                        <Input 
                            value={captchaInput}
                            // THE FIX: .toUpperCase() added here
                            onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                            placeholder="Type the characters above" 
                            className="h-11 bg-gray-50" 
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
                        </div>
                        <a href="#" className="text-sm text-orange-600 font-medium hover:underline">Forgot Password?</a>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-base mt-2 shadow-sm">
                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Signing In...</> : "Sign In"}
                    </Button>

                    <div className="flex justify-between text-sm mt-4 text-orange-600 font-medium">
                        <a href="#" className="hover:underline">Create Account</a>
                        <a href="#" className="hover:underline">Need Help?</a>
                    </div>
                </form>
            </div>
        )}
    </div>
  );
};

export default LoginForm;