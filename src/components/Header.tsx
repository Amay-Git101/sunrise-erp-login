import { useState } from "react";
import { 
  Bell, 
  Search, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

// --- PROPS INTERFACE ---
interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate();
  
  // Dummy Companies (Since we deleted the API hook)
  const companies = [
    { cId: 1, companyName: "Sunrise ERP (Demo)" },
    { cId: 2, companyName: "Tailor Shop A" }
  ];
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 right-0 left-0 z-30 lg:left-64 transition-all duration-300">
      
      {/* LEFT: Search & Toggle */}
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="relative hidden md:block w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Global Search..." 
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Company Dropdown */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
             <span className="text-xs font-bold text-gray-500 uppercase">Year</span>
             <span className="text-sm font-medium text-gray-900">2025 - 2026</span>
             <div className="h-4 w-px bg-gray-300 mx-2" />
             
             <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 outline-none">
                   {selectedCompany.companyName}
                   <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                   {companies.map((comp) => (
                      <DropdownMenuItem key={comp.cId} onClick={() => setSelectedCompany(comp)}>
                         {comp.companyName}
                      </DropdownMenuItem>
                   ))}
                </DropdownMenuContent>
             </DropdownMenu>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 w-9 h-9">
              <span className="font-bold text-sm">AD</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;