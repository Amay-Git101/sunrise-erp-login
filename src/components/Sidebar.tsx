import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sun, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  Files,
  Users,
  Building2,
  Mail,
  Menu as MenuIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  user: any;
  userRights: any[];
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const Sidebar = ({ user, userRights, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Helper to map API page names to Icons
  const getIconForMenu = (menuName: string) => {
    const name = menuName?.toLowerCase() || "";
    if (name.includes("dashboard")) return <LayoutDashboard size={20} />;
    if (name.includes("user")) return <Users size={20} />;
    if (name.includes("company")) return <Building2 size={20} />;
    if (name.includes("email")) return <Mail size={20} />;
    return <Files size={20} />;
  };

  const handleLogout = () => {
    // We'll handle the actual logout logic in the parent or a hook
    navigate("/dashboard"); // Just close menu for now, parent handles logout
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:static",
          isCollapsed ? "w-[70px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header - Gradient Background like Legacy App */}
        <div className={cn(
          "flex items-center px-4 h-16 bg-gradient-to-r from-amber-500 to-orange-500 text-white transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center min-w-8 w-8 h-8 bg-white/20 rounded-lg">
              <Sun className="text-white" size={20} />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col leading-none">
                <span className="font-bold text-lg">Sunrise</span>
                <span className="text-xs text-amber-100 font-medium">ERP Solutions</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 hover:bg-white/20 rounded-md transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {/* Dashboard Link (Always Visible) */}
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors group"
            >
              <LayoutDashboard size={20} className="group-hover:text-amber-600 text-gray-400" />
              {!isCollapsed && <span className="font-medium text-sm">Dashboard</span>}
            </Link>

            {/* Dynamic Items from API Rights */}
            {userRights.filter(r => r.allowAccess).map((right, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-colors group cursor-pointer"
              >
                <div className="group-hover:text-amber-600 text-gray-400">
                    {getIconForMenu(right.pageName)}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-medium text-sm truncate">{right.pageName}</span>
                    <span className="text-[10px] text-gray-400 uppercase">{right.menuName}</span>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User Footer - Gradient Background */}
        <div className="border-t border-gray-200 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-left",
                isCollapsed ? "justify-center" : "gap-3"
              )}>
                <div className="flex items-center justify-center min-w-8 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm">
                  <User size={16} />
                </div>
                
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.fullName || "User Account"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.companyName || "Sunrise ERP"}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => window.location.href = "/"}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;