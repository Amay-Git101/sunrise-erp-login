import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";

export const useDashboard = () => {
  
  // FETCH CUSTOMER COUNT (By fetching list and counting length)
  const fetchStats = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return { totalCustomers: 0 };

    try {
        const response = await fetch(`${API_BASE_URL}/api/Contact`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!response.ok) return { totalCustomers: 0 };
        
        const result = await response.json();
        const list = result.data || result || [];
        
        // COUNTING LOGIC
        return {
            totalCustomers: list.length,
            // We can add more logic here later if we fetch Orders
            totalOrders: 0, 
            pendingOrders: 0,
            monthlyRevenue: 0 
        };
    } catch (e) {
        return { totalCustomers: 0 };
    }
  };

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchStats,
    initialData: { totalCustomers: 0, totalOrders: 0, pendingOrders: 0, monthlyRevenue: 0 }
  });

  return { stats, isLoading };
};