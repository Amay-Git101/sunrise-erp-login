import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- REMOVED IMPORT FROM CONFIG ---
// import { API_BASE_URL } from "@/config"; 

interface UserInfo {
  userName: string;
  fullName: string;
  companyName: string;
  userLoginId: string;
}

interface UserRight {
  pageName: string;
  menuName: string;
  allowAccess: boolean;
}

const Dashboard = () => {
  // --- HARDCODED URL FIX ---
  const API_BASE_URL = "http://localhost:5162"; 

  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [rights, setRights] = useState<UserRight[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    const storedRights = localStorage.getItem("userRights");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/"); 
    }
    
    if (storedRights) {
      setRights(JSON.parse(storedRights));
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (user?.userLoginId && token) {
        // Uses the hardcoded API_BASE_URL
        await fetch(`${API_BASE_URL}/api/Auth/logout`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userLoginId: user.userLoginId })
        });
      }
    } catch (error) {
      console.error("Logout notification failed", error);
    } finally {
      localStorage.clear();
      toast({ title: "Logged Out", description: "See you next time!" });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-primary">{user?.fullName || "User"}</span>
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors">
          <LogOut size={16} />
          Sign Out
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{user?.userName}</div>
                <div className="text-xs text-muted-foreground mt-1">
                   Company: {user?.companyName || "No Company Assigned"}
                </div>
            </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Access Rights
                </CardTitle>
            </CardHeader>
            <CardContent>
                {rights.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {rights.filter(r => r.allowAccess).map((right, index) => (
                            <div key={index} className="flex items-center p-3 bg-secondary/20 rounded-md border border-border/50">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-3 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{right.pageName}</span>
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{right.menuName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No specific page rights found.
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;