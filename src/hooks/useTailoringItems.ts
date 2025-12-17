import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

// The "Recipe" for an Item
export interface TailoringItem {
  itemId: number;
  itemName: string;
  itemCode?: string; // e.g. "SHIRT"
  displayOrder: number;
  isActive: boolean;
  // This is the Magic Link: Which measurements does this item need?
  measurementIds: number[]; 
}

export const useTailoringItems = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };

  // --- GET ITEMS ---
  const fetchItems = async () => {
    // In real life, this will return items AND their linked measurement IDs
    const response = await fetch(`${API_BASE_URL}/api/tailoring-items`, { headers });
    if (!response.ok) throw new Error("Failed to fetch items");
    const result = await response.json();
    return result.data || [];
  };

  // --- SAVE (CREATE / UPDATE) ---
  const saveItemMutation = useMutation({
    mutationFn: async (data: Partial<TailoringItem>) => {
      const isEdit = !!data.itemId;
      const url = isEdit 
        ? `${API_BASE_URL}/api/tailoring-items/${data.itemId}` 
        : `${API_BASE_URL}/api/tailoring-items`;
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tailoringItems"] });
      toast({ title: "Saved", description: "Item definition updated." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // --- DELETE ---
  const deleteItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/api/tailoring-items/${id}`, {
        method: "DELETE",
        headers,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tailoringItems"] });
      toast({ title: "Deleted", description: "Item removed." });
    },
  });

  return {
    fetchItems,
    saveItem: saveItemMutation.mutateAsync,
    deleteItem: deleteItemMutation.mutateAsync,
    isSaving: saveItemMutation.isPending,
  };
};