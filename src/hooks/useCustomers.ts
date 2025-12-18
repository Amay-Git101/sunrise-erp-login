import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

// --- FIX: Export this interface correctly ---
export interface Customer {
  contactId: number;
  personName: string;
  contactNo: string;
  emailId: string;
  companyName: string;
  designation: string;
  contactType: string;
  isActive: boolean;
  // Add optional fields if your UI needs them, even if API doesn't send them yet
  image?: string;
  city?: string;
  state?: string;
  taxType?: string;
}

export const useCustomers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const getHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

  const fetchContacts = async () => {
    const response = await fetch(`${API_BASE_URL}/api/Contact`, { headers: getHeaders() });
    if (!response.ok) throw new Error("Failed to fetch contacts");
    const result = await response.json();
    return result.data || result || []; 
  };

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: !!localStorage.getItem("authToken"),
  });

  // ... (Keep your add/update/delete mutations the same) ...

  const addMutation = useMutation({
    mutationFn: async (newContact: any) => {
      const response = await fetch(`${API_BASE_URL}/api/Contact`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newContact),
      });
      if (!response.ok) throw new Error("Failed to add");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({ title: "Success", description: "Customer added" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
        const response = await fetch(`${API_BASE_URL}/api/Contact/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update");
        return response.json();
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        toast({ title: "Updated", description: "Customer updated" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/api/Contact/${id}`, {
            method: "DELETE",
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error("Failed to delete");
        return id;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        toast({ title: "Deleted", description: "Customer removed" });
    }
  });

  const measurementMutation = useMutation({
    mutationFn: async ({ id, measurements }: { id: number; measurements: any[] }) => {
       // Placeholder until you have a real measurement API
       console.log("Saving measurements for", id, measurements);
       return true;
    },
    onSuccess: () => toast({ title: "Saved", description: "Measurements saved locally" })
  });

  return {
    customers,
    isLoading,
    addCustomer: addMutation.mutateAsync,
    updateCustomer: (id: number, data: any) => updateMutation.mutateAsync({ id, data }),
    deleteCustomer: deleteMutation.mutateAsync,
    saveMeasurements: (id: number, data: any[]) => measurementMutation.mutateAsync({ id, measurements: data }),
  };
};