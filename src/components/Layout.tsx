import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Toaster } from "@/components/ui/toaster";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50/30">
      {/* 1. SIDEBAR (Hidden on mobile, togglable) */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* 2. OVERLAY for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        <TopBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        {/* FIX: pt-16 ensures content starts AFTER the 64px header */}
        <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-24 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Layout;