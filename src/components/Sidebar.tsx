import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Ruler, 
  Scissors, 
  Shirt, 
  FileText, 
  Settings, 
  ChevronRight 
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Helper to check active state
  const isActive = (path: string) => pathname === path;

  // Menu Configuration
  const menuGroups = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      title: "Masters",
      items: [
        { name: "User Management", path: "/users", icon: Users },
        { name: "Measurements", path: "/measurements", icon: Ruler }, // <--- NEW LINK
        { name: "Tailoring Items", path: "/tailoring-items", icon: Scissors },
        { name: "Customers", path: "/customers", icon: Shirt },
      ]
    },
    {
      title: "Entry",
      items: [
        { name: "New Booking", path: "/booking/new", icon: FileText },
        { name: "Order Status", path: "/orders", icon: FileText },
      ]
    },
    {
      title: "System",
      items: [
        { name: "Settings", path: "/settings", icon: Settings },
      ]
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0">
      
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="h-8 w-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-md flex items-center justify-center mr-3 shadow-sm">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div>
          <h1 className="font-bold text-gray-800 text-lg leading-tight">Sunrise</h1>
          <p className="text-[10px] text-gray-400 font-medium tracking-wider">ERP SOLUTIONS</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            
            {/* Group Title */}
            <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              {group.title}
            </h3>

            {/* Links */}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group
                      ${active 
                        ? "bg-amber-50 text-amber-700 shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <Icon 
                        className={`mr-3 h-4 w-4 transition-colors ${active ? "text-amber-600" : "text-gray-400 group-hover:text-gray-600"}`} 
                      />
                      {item.name}
                    </div>
                    
                    {active && <ChevronRight className="h-4 w-4 text-amber-500 opacity-50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Version */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
             <p className="text-xs text-gray-400 font-medium">v1.0.2 Beta</p>
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;