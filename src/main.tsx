import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // <--- 1. IMPORT THIS
import App from "./App.tsx";
import "./index.css";

// 2. CREATE THE CLIENT
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // 3. WRAP EVERYTHING IN BOTH PROVIDERS
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);