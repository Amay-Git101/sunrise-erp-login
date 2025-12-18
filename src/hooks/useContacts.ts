import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/config";
import { useToast } from "@/components/ui/use-toast";

export interface Contact {
  contactId: number;
  contactNo: string;
  personName: string;
  companyName: string;
  designation: string;
  emailId: string;
  workNotes: string;
  ledgerId: string;
  birthday: string;
  remark1: string;
  remark2: string;
  contactType: string;
  broadcast: string;
  isActive: boolean;
}

export const useContacts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // 1. GET TOKEN
  const token = localStorage.getItem("authToken");
  
  // 2. PREPARE HEADERS
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // --- GET ALL CONTACTS ---
  const fetchContacts = async () => {
    if (!token) return []; // Security check

    const response = await fetch(`${API_BASE_URL}/api/Contact`, { headers });
    
    if (!response.ok) {
        throw new Error("Failed to fetch contacts");
    }
    
    const result = await response.json();
    return result.data || result || [];
  };

  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchContacts,
    enabled: !!token, // Only run if logged in
  });

  // --- ADD CONTACT ---
  const addMutation = useMutation({
    mutationFn: async (newContact: Omit<Contact, "contactId">) => {
      const response = await fetch(`${API_BASE_URL}/api/Contact`, {
        method: "POST",
        headers,
        body: JSON.stringify(newContact),
      });
      if (!response.ok) throw new Error("Failed to add contact");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({ title: "Success", description: "Contact saved to database" });
    },
    onError: () => toast({ title: "Error", description: "Could not save contact", variant: "destructive" }),
  });

  // --- UPDATE CONTACT ---
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Contact> }) => {
      const response = await fetch(`${API_BASE_URL}/api/Contact/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update contact");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({ title: "Success", description: "Contact updated" });
    },
    onError: () => toast({ title: "Error", description: "Update failed", variant: "destructive" }),
  });

  // --- DELETE CONTACT ---
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/api/Contact/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Failed to delete contact");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({ title: "Deleted", description: "Contact removed" });
    },
    onError: () => toast({ title: "Error", description: "Delete failed", variant: "destructive" }),
  });

  return {
    contacts,
    isLoading,
    isError: !!error,
    addContact: addMutation.mutateAsync,
    updateContact: updateMutation.mutateAsync,
    deleteContact: deleteMutation.mutateAsync,
  };
};