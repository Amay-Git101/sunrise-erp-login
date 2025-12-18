import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Contact } from "@/hooks/useContacts";

interface ContactFormProps {
  initialData?: Contact | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const ContactForm = ({ initialData, onSave, onCancel }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State keeps 'yyyy-MM-dd' for the Input to work correctly
  const [formData, setFormData] = useState<Partial<Contact>>({
    personName: "", 
    contactNo: "", 
    companyName: "", 
    designation: "", 
    emailId: "", 
    workNotes: "", 
    ledgerId: "", 
    birthday: "", 
    remark1: "", 
    remark2: "", 
    contactType: "", 
    broadcast: "", 
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
        setFormData({
            ...initialData,
            // Ensure inputs get strings (yyyy-MM-dd) from API data
            birthday: initialData.birthday ? String(initialData.birthday).split('T')[0] : "",
            ledgerId: initialData.ledgerId ? String(initialData.ledgerId) : "",
        });
    }
  }, [initialData]);

  // --- HELPER: Convert yyyy-MM-dd to dd/MM/yyyy ---
  const formatDateForApi = (isoDateString: string | undefined) => {
    if (!isoDateString) return null;
    const parts = isoDateString.split('-'); // [2025, 12, 17]
    if (parts.length !== 3) return null;
    return `${parts[2]}/${parts[1]}/${parts[0]}`; // Returns "17/12/2025"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const storedUser = localStorage.getItem("userInfo");
        const userInfo = storedUser ? JSON.parse(storedUser) : {};
        const userName = userInfo.userName || "WebUser";

        // Convert the date right before sending
        const formattedBirthday = formatDateForApi(formData.birthday);

        const payload = {
            ...formData,
            contactId: initialData?.contactId || 0,
            
            // USE THE NEW FORMAT: dd/MM/yyyy
            birthday: formattedBirthday, 
            
            // Handle Foreign Key (Send null if "0" or empty)
            ledgerId: (formData.ledgerId && formData.ledgerId !== "0") ? Number(formData.ledgerId) : null,
            
            createdBy: userName,
            createdFrom: userName,
            createdOn: new Date().toISOString(),
            isActive: true
        };

        console.log("Submitting Payload with dd/MM/yyyy:", payload);
        await onSave(payload);
    } catch (error) {
        console.error("Form submission error:", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      
      {/* 1. Personal Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-500 border-b pb-2">Personal Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Person Name <span className="text-red-500">*</span></Label>
                <Input required value={formData.personName} onChange={e => setFormData({...formData, personName: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Contact No <span className="text-red-500">*</span></Label>
                <Input required value={formData.contactNo} onChange={e => setFormData({...formData, contactNo: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Email ID</Label>
                <Input type="email" value={formData.emailId || ""} onChange={e => setFormData({...formData, emailId: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Birthday</Label>
                {/* Input still needs yyyy-MM-dd to display correctly */}
                <Input type="date" value={formData.birthday || ""} onChange={e => setFormData({...formData, birthday: e.target.value})} />
            </div>
        </div>
      </div>

      {/* 2. Business Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-500 border-b pb-2">Business Info</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={formData.companyName || ""} onChange={e => setFormData({...formData, companyName: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label>Designation</Label>
                <Input value={formData.designation || ""} onChange={e => setFormData({...formData, designation: e.target.value})} />
            </div>
            
            <div className="space-y-2">
                <Label>Contact Type</Label>
                <Select value={formData.contactType || ""} onValueChange={(val) => setFormData({...formData, contactType: val})}>
                    <SelectTrigger className="bg-white"><SelectValue placeholder="Select Type" /></SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Supplier">Supplier</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Ledger Account</Label>
                <Select value={formData.ledgerId ? String(formData.ledgerId) : ""} onValueChange={(val) => setFormData({...formData, ledgerId: val})}>
                    <SelectTrigger className="bg-white"><SelectValue placeholder="Select Ledger" /></SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="0">-- None --</SelectItem>
                        <SelectItem value="101">General Account</SelectItem>
                        <SelectItem value="102">Cash Account</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-[10px] text-gray-400">Select "None" if 101/102 don't exist in DB</p>
            </div>
        </div>
      </div>

      {/* 3. Notes */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Broadcast Name (Whatsapp)</Label>
                <Input value={formData.broadcast || ""} onChange={e => setFormData({...formData, broadcast: e.target.value})} />
             </div>
             <div className="space-y-2">
                <Label>Work Notes</Label>
                <Input value={formData.workNotes || ""} onChange={e => setFormData({...formData, workNotes: e.target.value})} />
             </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2"><Label>Remark 1</Label><Input value={formData.remark1 || ""} onChange={e => setFormData({...formData, remark1: e.target.value})} /></div>
             <div className="space-y-2"><Label>Remark 2</Label><Input value={formData.remark2 || ""} onChange={e => setFormData({...formData, remark2: e.target.value})} /></div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save Record"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;