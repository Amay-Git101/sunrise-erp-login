import { useState, useEffect } from "react";
import { Bell, Search, AlertCircle, LogOut } from "lucide-react"; 
import { useUsers, Company } from "@/hooks/useUsers";
import { useNavigate } from "react-router-dom"; // <--- 1. Import Navigate
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TopBar = () => {
  const navigate = useNavigate(); // <--- 2. Initialize Hook
  const { fetchCompanies } = useUsers();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(true);

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    // 1. Clear the token
    localStorage.removeItem("authToken");
    // 2. Redirect to Login Page
    navigate("/login");
  };

  useEffect(() => {
    const load = async () => {
        setIsLoading(true);
        try {
            const data = await fetchCompanies();
            if (Array.isArray(data) && data.length > 0) {
                setCompanies(data);
                setSelectedCompanyId(data[0].cId);
            } else {
                setCompanies([]);
            }
        } catch (e) {
            console.error("Failed to load companies", e);
            setCompanies([]);
        } finally {
            setIsLoading(false);
        }
    };
    load();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      
      {/* Left: Global Search */}
      <div className="flex items-center w-full max-w-md text-gray-400">
        <Search className="w-4 h-4 mr-2" />
        <input 
          type="text" 
          placeholder="Global Search..." 
          className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        
        {/* Financial Year */}
        <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
          <span className="text-[10px] text-gray-500 mr-2 uppercase font-bold tracking-wider">Year</span>
          <select className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer">
            <option>2025 - 2026</option>
            <option>2024 - 2025</option>
          </select>
        </div>

        {/* Company Selector */}
        <div className={`hidden md:flex items-center px-3 py-1.5 rounded-md border min-w-[180px] transition-colors ${companies.length === 0 ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
          <span className={`text-[10px] mr-2 uppercase font-bold tracking-wider ${companies.length === 0 ? "text-red-500" : "text-amber-600"}`}>
            Company
          </span>
          
          {isLoading ? (
             <span className="text-sm font-medium text-amber-800 animate-pulse">Loading...</span>
          ) : companies.length > 0 ? (
            <select 
                value={selectedCompanyId} 
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="bg-transparent text-sm font-bold text-amber-900 focus:outline-none cursor-pointer w-full max-w-[200px]"
            >
                {companies.map(c => (
                    <option key={c.cId} value={c.cId}>{c.companyName}</option>
                ))}
            </select>
          ) : (
            <div className="flex items-center text-red-600 text-sm font-bold cursor-not-allowed">
                <AlertCircle className="w-3 h-3 mr-1" />
                <span>No Access</span>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-amber-600">
          <Bell className="w-5 h-5" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-amber-100">
                <AvatarImage src="" alt="@user" />
                <AvatarFallback className="bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-medium">
                  AD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            
            {/* LOGOUT BUTTON */}
            <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
            
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;