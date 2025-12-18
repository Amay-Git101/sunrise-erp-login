import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSave: (data: any) => Promise<void>;
}

const CustomerFormPanel = ({ isOpen, onClose, initialData, onSave }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // MATCH THE API FIELDS EXACTLY
  const [formData, setFormData] = useState({
    personName: "",
    contactNo: "",
    emailId: "",
    companyName: "",
    designation: "",
    contactType: "Customer", // Default
    isActive: true,
    // Add these if you want to support them via Remarks for now
    addressPlaceholder: "" 
  });

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({
                personName: initialData.personName || "",
                contactNo: initialData.contactNo || "",
                emailId: initialData.emailId || "",
                companyName: initialData.companyName || "",
                designation: initialData.designation || "",
                contactType: initialData.contactType || "Customer",
                isActive: initialData.isActive ?? true,
                addressPlaceholder: ""
            });
        } else {
            // Reset for new
            setFormData({
                personName: "", contactNo: "", emailId: "", companyName: "",
                designation: "", contactType: "Customer", isActive: true, addressPlaceholder: ""
            });
        }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // PREPARE PAYLOAD
    const payload = {
        contactId: initialData?.contactId || 0,
        personName: formData.personName,
        contactNo: formData.contactNo,
        emailId: formData.emailId,
        companyName: formData.companyName,
        designation: formData.designation,
        contactType: formData.contactType,
        isActive: true,
        
        // Audit Fields (Required by your previous error logs)
        createdOn: new Date().toISOString(),
        createdBy: "WebUser",
        createdFrom: "WebPanel"
    };

    try {
        await onSave(payload);
        onClose();
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[500px] w-full bg-white p-6 overflow-y-auto">
        <SheetHeader className="mb-6">
            <SheetTitle>{initialData ? "Edit Customer" : "Add New Customer"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* CORE INFO */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Customer Name <span className="text-red-500">*</span></Label>
                    <Input required value={formData.personName} onChange={e => setFormData({...formData, personName: e.target.value})} />
                </div>
                
                <div className="space-y-2">
                    <Label>Mobile Number <span className="text-red-500">*</span></Label>
                    <Input required value={formData.contactNo} onChange={e => setFormData({...formData, contactNo: e.target.value})} />
                </div>

                <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" value={formData.emailId} onChange={e => setFormData({...formData, emailId: e.target.value})} />
                </div>
            </div>

            {/* COMPANY INFO */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                </div>
                <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
                </div>
            </div>

            {/* SETTINGS */}
            <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.contactType} onValueChange={v => setFormData({...formData, contactType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Customer">Customer</SelectItem>
                        <SelectItem value="Supplier">Supplier</SelectItem>
                        <SelectItem value="Vendor">Vendor</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 pt-6 border-t mt-auto">
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : "Save Record"}
                </Button>
            </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerFormPanel;