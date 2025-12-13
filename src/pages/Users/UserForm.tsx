import { useState, useEffect } from "react";
import { User, Company, useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

const UserForm = ({ isOpen, onClose, userToEdit }: UserFormProps) => {
  const { saveUser, fetchCompanies, isSaving } = useUsers();
  
  const [formData, setFormData] = useState<Partial<User>>({
    userName: "",
    userPassword: "",
    firstName: "",
    lastName: "",
    emailId: "",
    mobileNo: "",
    cId: 0,
    active: true,
    whatsappOTP: false,
    emailOTP: false
  });

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // --- 1. SMART FETCH LOGIC ---
  useEffect(() => {
    if (isOpen) {
      setLoadingCompanies(true);
      fetchCompanies()
        .then((data) => {
            setCompanies(data);
            
            // ✅ THE LOGIC YOU REQUESTED: 
            // If the user has only 1 company registered, Auto-Select it.
            // Only do this if we are CREATING a user (userToEdit is null)
            // or if the current user doesn't have a company set yet.
            if (data.length === 1 && (!userToEdit || !userToEdit.cId)) {
                setFormData(prev => ({ ...prev, cId: data[0].cId }));
            }
        })
        .catch(console.error)
        .finally(() => setLoadingCompanies(false));
    }
  }, [isOpen]);

  // --- 2. POPULATE ON EDIT ---
  useEffect(() => {
    if (userToEdit) {
      setFormData({
        ...userToEdit,
        userPassword: "", // Security: Wipe password field on edit
      });
    } else {
      // Reset form, but keep cId if we auto-selected it previously
      setFormData(prev => ({
        userName: "",
        userPassword: "",
        firstName: "",
        lastName: "",
        emailId: "",
        mobileNo: "",
        cId: prev.cId || 0, // Keep auto-selected ID if it exists
        active: true,
        whatsappOTP: false,
        emailOTP: false
      }));
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveUser(formData);
      onClose();
    } catch (error) {
      // Toast is handled in the hook
    }
  };

  const updateField = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{userToEdit ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          
          {/* Row 1: Credentials */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username <span className="text-red-500">*</span></Label>
              <Input 
                value={formData.userName} 
                onChange={e => updateField("userName", e.target.value)}
                required
                disabled={!!userToEdit} // Username cannot be changed
              />
            </div>
            <div className="space-y-2">
              <Label>Password {userToEdit && <span className="text-xs text-muted-foreground">(Optional)</span>}</Label>
              <Input 
                type="password"
                value={formData.userPassword} 
                onChange={e => updateField("userPassword", e.target.value)}
                required={!userToEdit}
                placeholder={userToEdit ? "Unchanged" : ""}
              />
            </div>
          </div>

          {/* Row 2: Personal */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name <span className="text-red-500">*</span></Label>
              <Input 
                value={formData.firstName} 
                onChange={e => updateField("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name <span className="text-red-500">*</span></Label>
              <Input 
                value={formData.lastName} 
                onChange={e => updateField("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 3: Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input 
                type="email"
                value={formData.emailId} 
                onChange={e => updateField("emailId", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Mobile No <span className="text-red-500">*</span></Label>
              <Input 
                value={formData.mobileNo} 
                onChange={e => updateField("mobileNo", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 4: Company - DYNAMIC & MULTI-TENANT AWARE */}
          <div className="space-y-2">
            <Label>Assign Company <span className="text-red-500">*</span></Label>
            <Select 
              value={formData.cId?.toString()} 
              onValueChange={(val) => updateField("cId", parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCompanies ? "Loading Companies..." : "Select Company"} />
              </SelectTrigger>
              <SelectContent>
                {companies.map(comp => (
                  <SelectItem key={comp.cId} value={comp.cId.toString()}>
                    {comp.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Helper text for user clarity */}
            {companies.length > 1 && (
                <p className="text-[10px] text-muted-foreground">
                    Note: You have access to {companies.length} companies. Please select the correct one.
                </p>
            )}
          </div>

          {/* Row 5: Toggles */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center space-x-2">
              <Switch checked={formData.active} onCheckedChange={val => updateField("active", val)} />
              <Label>Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={formData.whatsappOTP} onCheckedChange={val => updateField("whatsappOTP", val)} />
              <Label>WhatsApp OTP</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={formData.emailOTP} onCheckedChange={val => updateField("emailOTP", val)} />
              <Label>Email OTP</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {userToEdit ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;