import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [rights, setRights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data for the sidebar
    const storedUser = localStorage.getItem("userInfo");
    const storedRights = localStorage.getItem("userRights");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRights) setRights(JSON.parse(storedRights));
    
    // Redirect if not logged in
    if (!localStorage.getItem("authToken")) {
        navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Component */}
      <Sidebar 
        user={user} 
        userRights={rights} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 lg:w-full">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b flex items-center px-4 sticky top-0 z-30">
            <button 
                onClick={() => setIsMobileOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
                <Menu size={24} />
            </button>
            <span className="ml-3 font-semibold text-gray-900">Sunrise ERP</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;