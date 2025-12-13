import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

// --- INTERFACES ---
export interface User {
  userId: number;
  userName: string;
  userPassword?: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNo: string;
  active: boolean;
  cId: number;
  whatsappOTP?: boolean;
  emailOTP?: boolean;
  createdDate?: string;
}

export interface Company {
  cId: number;
  companyName: string;
}

interface UserFilters {
  pageIndex: number;
  pageCount: number;
  search?: string;
  active?: string;
}

export const useUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // --- A. GET USERS ---
  const fetchUsers = async (filters: UserFilters) => {
    const params = new URLSearchParams({
      pageIndex: filters.pageIndex.toString(),
      pageCount: filters.pageCount.toString(),
    });
    if (filters.search) params.append("search", filters.search);
    if (filters.active) params.append("active", filters.active);

    const response = await fetch(`${API_BASE_URL}/api/user?${params}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  };

  // --- B. GET COMPANIES ---
  const fetchCompanies = async () => {
    const response = await fetch(`${API_BASE_URL}/api/company`, { headers });
    if (!response.ok) throw new Error("Failed to fetch companies");
    const result = await response.json();
    return result.data || [];
  };

  // --- C. SAVE USER ---
  const saveUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const isEdit = !!userData.userId;
      const url = isEdit 
        ? `${API_BASE_URL}/api/user/${userData.userId}` 
        : `${API_BASE_URL}/api/user`;
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Success", description: "User record saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // --- D. DELETE USER ---
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: "DELETE",
        headers,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({ title: "Deleted", description: "User removed successfully." });
    },
  });

  // --- E. GET USER RIGHTS (New) ---
  const fetchUserRights = async (userId: number) => {
    // Calling the API endpoint for rights
    const response = await fetch(`${API_BASE_URL}/api/user/rights/${userId}`, { headers });
    if (!response.ok) throw new Error("Failed to fetch user rights");
    const result = await response.json();
    return result.data || [];
  };

  // --- F. SAVE USER RIGHTS (New) ---
  const saveUserRightsMutation = useMutation({
    mutationFn: async (data: { userId: number, rights: any[] }) => {
      const response = await fetch(`${API_BASE_URL}/api/user/save-rights`, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "User permissions updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // --- RETURN EVERYTHING ---
  return {
    fetchUsers,
    fetchCompanies,
    saveUser: saveUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    isSaving: saveUserMutation.isPending,
    // Exporting the new functions below:
    fetchUserRights,
    saveUserRights: saveUserRightsMutation.mutateAsync,
    isSavingRights: saveUserRightsMutation.isPending
  };
};