import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";
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

// Mock Data Interface
interface Company {
  cId: number;
  companyName: string;
}

const TopBar = () => {
  // We skip the API hook for now to focus on UI
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | string>("");

  useEffect(() => {
    // Force Mock Data immediately
    const mockData = [
      { cId: 1, companyName: "Sunrise Head Office" },
      { cId: 2, companyName: "Sunrise Branch 1" }
    ];
    setCompanies(mockData);
    setSelectedCompanyId(mockData[0].cId);
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
        
        {/* Financial Year Selector */}
        <div className="hidden md:flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
          <span className="text-[10px] text-gray-500 mr-2 uppercase font-bold tracking-wider">Year</span>
          <select className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer">
            <option>2025 - 2026</option>
            <option>2024 - 2025</option>
          </select>
        </div>

        {/* Company Selector (Mocked) */}
        <div className="hidden md:flex items-center bg-amber-50 px-3 py-1.5 rounded-md border border-amber-100 min-w-[180px]">
          <span className="text-[10px] text-amber-600 mr-2 uppercase font-bold tracking-wider">Company</span>
          <select 
              value={selectedCompanyId} 
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="bg-transparent text-sm font-bold text-amber-900 focus:outline-none cursor-pointer w-full max-w-[200px]"
          >
              {companies.map(c => (
                  <option key={c.cId} value={c.cId}>{c.companyName}</option>
              ))}
          </select>
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
            <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;