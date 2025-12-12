// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard"; // NEW IMPORT
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute"; // NEW IMPORT
import Layout from "./components/Layout"; // Import the new Layout

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Wrap Protected Routes in the Layout */}
          <Route element={<ProtectedRoute />}>
             <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Future routes go here (e.g., /users, /company) */}
             </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;