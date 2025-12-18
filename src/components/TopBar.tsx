import { useState } from "react";
import { 
  Bell, Search, Menu, User, LogOut, Settings, 
  ChevronDown, Building2, Calendar
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const TopBar = ({ toggleSidebar }: TopBarProps) => {
  const navigate = useNavigate();
  
  const companies = [
    { cId: 1, name: "Sunrise ERP (Demo)" },
    { cId: 2, name: "Tailor Shop A" }
  ];
  const years = ["2025 - 2026", "2024 - 2025"];

  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    // z-50 ensures dropdowns appear ABOVE everything else
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 fixed top-0 right-0 left-0 z-50 lg:left-64 transition-all duration-300">
      
      {/* LEFT */}
      <div className="flex items-center gap-4 flex-1">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-100 rounded-md">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="relative hidden md:block w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white h-9"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Year Dropdown */}
        <div className="hidden sm:block">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-gray-200 bg-gray-50 text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-gray-500"/>
                        <span className="text-xs font-semibold">{selectedYear}</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Fiscal Year</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {years.map(year => (
                        <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>
                            {year}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* Company Dropdown */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100">
                    <Building2 className="w-3.5 h-3.5"/>
                    <span className="text-xs font-bold truncate max-w-[120px] md:max-w-none">
                        {selectedCompany.name}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Select Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {companies.map(comp => (
                    <DropdownMenuItem key={comp.cId} onClick={() => setSelectedCompany(comp)}>
                        {comp.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-900 text-white w-8 h-8 md:w-9 md:h-9">
              <span className="font-bold text-xs md:text-sm">AD</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;