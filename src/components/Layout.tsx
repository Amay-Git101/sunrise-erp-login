import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* 1. Sidebar (Left) */}
      <div className="hidden md:flex flex-col w-64 fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* 2. Main Content Wrapper (Right) */}
      <div className="flex-1 flex flex-col md:pl-64 h-full">
        
        {/* Top Header */}
        <TopBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;