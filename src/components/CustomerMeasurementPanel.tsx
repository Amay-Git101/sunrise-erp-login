import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Ruler } from "lucide-react";
// IMPORT THE CORRECT TYPE
import { Customer } from "@/hooks/useCustomers"; 

// Mock "Measurement Master" data
const MEASUREMENT_MASTER = [
  { id: "m1", name: "Length", type: "Body" },
  { id: "m2", name: "Waist", type: "Body" },
  { id: "m3", name: "Shoulder", type: "Body" },
  { id: "m4", name: "Sleeve Length", type: "Body" },
  { id: "m5", name: "Collar", type: "Body" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (customerId: number, data: any[]) => Promise<void>;
}

const CustomerMeasurementPanel = ({ isOpen, onClose, customer, onSave }: Props) => {
  const [isSaving, setIsSaving] = useState(false);
  const [filterItem, setFilterItem] = useState("All Measurements");
  
  // Local state to store input values
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleSave = async () => {
    if (!customer) return;
    setIsSaving(true);
    // Combine master data with entered values
    const payload = MEASUREMENT_MASTER.map(m => ({
        id: m.id,
        name: m.name,
        value: values[m.id] || "",
        notes: notes[m.id] || ""
    })).filter(m => m.value !== ""); 
    
    // FIX: Use .contactId instead of .id
    await onSave(customer.contactId, payload);
    setIsSaving(false);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[600px] w-full bg-white p-0 flex flex-col h-full">
        <div className="p-6 border-b bg-gray-50/50">
            <SheetHeader>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-100 rounded-lg"><Ruler className="w-5 h-5 text-orange-600"/></div>
                    <div>
                        <SheetTitle>Measurements</SheetTitle>
                        <p className="text-sm text-gray-500 font-normal">For: <span className="font-bold text-gray-800">
                            {/* FIX: Use .personName instead of .name */}
                            {customer?.personName}
                        </span></p>
                    </div>
                </div>
            </SheetHeader>
            
            {/* Filter */}
            <div className="mt-4">
                <Select value={filterItem} onValueChange={setFilterItem}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All Measurements">All Measurements</SelectItem>
                        <SelectItem value="Shirt">Shirt</SelectItem>
                        <SelectItem value="Pant">Pant</SelectItem>
                        <SelectItem value="Suit">Suit</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6">
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left">Measurement</th>
                            <th className="px-4 py-3 text-left w-24">Value</th>
                            <th className="px-4 py-3 text-left">Notes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {MEASUREMENT_MASTER.map((m) => (
                            <tr key={m.id} className="group hover:bg-blue-50/30">
                                <td className="px-4 py-3 font-medium text-gray-700">{m.name}</td>
                                <td className="px-4 py-2">
                                    <Input 
                                        className="h-8 w-20 bg-gray-50 focus:bg-white text-center font-bold text-gray-900" 
                                        placeholder="0.00"
                                        value={values[m.id] || ""}
                                        onChange={(e) => setValues({...values, [m.id]: e.target.value})}
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    <Input 
                                        className="h-8 bg-transparent border-transparent hover:border-gray-200 focus:bg-white" 
                                        placeholder="Add note..."
                                        value={notes[m.id] || ""}
                                        onChange={(e) => setNotes({...notes, [m.id]: e.target.value})}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
            <Button onClick={handleSave} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 text-base" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save All Measurements"}
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerMeasurementPanel;