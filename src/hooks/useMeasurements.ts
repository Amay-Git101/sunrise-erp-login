import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

export interface Measurement {
  measurementId: number;
  measurementName: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string; // Optional image URL
}

export const useMeasurements = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("authToken");

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // --- GET MEASUREMENTS ---
  const fetchMeasurements = async () => {
    // Assuming endpoint GET /api/measurement
    const response = await fetch(`${API_BASE_URL}/api/measurement`, { headers });
    if (!response.ok) throw new Error("Failed to fetch measurements");
    const result = await response.json();
    return result.data || [];
  };

  // --- SAVE (CREATE / UPDATE) ---
  const saveMeasurementMutation = useMutation({
    mutationFn: async (data: Partial<Measurement>) => {
      const isEdit = !!data.measurementId;
      const url = isEdit 
        ? `${API_BASE_URL}/api/measurement/${data.measurementId}` 
        : `${API_BASE_URL}/api/measurement`;
      
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
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      toast({ title: "Success", description: "Measurement saved successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // --- DELETE ---
  const deleteMeasurementMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/api/measurement/${id}`, {
        method: "DELETE",
        headers,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["measurements"] });
      toast({ title: "Deleted", description: "Measurement removed." });
    },
  });

  return {
    fetchMeasurements,
    saveMeasurement: saveMeasurementMutation.mutateAsync,
    deleteMeasurement: deleteMeasurementMutation.mutateAsync,
    isSaving: saveMeasurementMutation.isPending,
  };
};