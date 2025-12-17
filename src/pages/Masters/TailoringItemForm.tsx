import { useState, useEffect } from "react";
import { TailoringItem, useTailoringItems } from "@/hooks/useTailoringItems";
import { useMeasurements, Measurement } from "@/hooks/useMeasurements"; // We need this to list options
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
import { Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: TailoringItem | null;
}

const TailoringItemForm = ({ isOpen, onClose, itemToEdit }: FormProps) => {
  const { saveItem, isSaving } = useTailoringItems();
  const { fetchMeasurements } = useMeasurements(); // Load the ingredients

  // State for available measurements
  const [allMeasurements, setAllMeasurements] = useState<Measurement[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<TailoringItem>>({
    itemName: "",
    itemCode: "",
    displayOrder: 0,
    isActive: true,
    measurementIds: [] // This stores the IDs selected by the user
  });

  // 1. Load the "Ingredients" (Measurements) when modal opens
  useEffect(() => {
    const loadIngredients = async () => {
        try {
            const m = await fetchMeasurements();
            // Sort by their display order so it looks clean
            const sorted = (m || []).sort((a:Measurement, b:Measurement) => a.displayOrder - b.displayOrder);
            setAllMeasurements(sorted);
        } catch (e) {
            console.error("Could not load measurements", e);
        }
    };
    if (isOpen) loadIngredients();
  }, [isOpen]);

  // 2. Populate form if editing
  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
    } else {
      // Reset for new item
      setFormData({
        itemName: "",
        itemCode: "",
        displayOrder: 0,
        isActive: true,
        measurementIds: [] 
      });
    }
  }, [itemToEdit, isOpen]);

  // Toggle Logic: Click a measurement to add/remove it
  const toggleMeasurement = (mId: number) => {
    setFormData(prev => {
        const currentIds = prev.measurementIds || [];
        if (currentIds.includes(mId)) {
            // Remove it
            return { ...prev, measurementIds: currentIds.filter(id => id !== mId) };
        } else {
            // Add it
            return { ...prev, measurementIds: [...currentIds, mId] };
        }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveItem(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{itemToEdit ? "Edit Item Definition" : "Define New Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Item Name <span className="text-red-500">*</span></Label>
                <Input 
                  required
                  placeholder="e.g. Shirt"
                  value={formData.itemName} 
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <Label>Short Code</Label>
                <Input 
                  placeholder="e.g. SHT"
                  value={formData.itemCode} 
                  onChange={(e) => setFormData({...formData, itemCode: e.target.value.toUpperCase()})}
                />
            </div>
          </div>

          {/* THE CORE LOGIC: Link Measurements */}
          <div className="space-y-3 border p-4 rounded-lg bg-slate-50">
            <Label className="text-base font-semibold text-slate-800">
                What do you measure for this?
            </Label>
            <p className="text-xs text-muted-foreground">
                Select the measurements needed when stitching a <b>{formData.itemName || "new item"}</b>.
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
                {allMeasurements.length === 0 ? (
                    <span className="text-sm text-red-400">No measurements found. Please go to Measurement Master first.</span>
                ) : (
                    allMeasurements.map(m => {
                        const isSelected = (formData.measurementIds || []).includes(m.measurementId);
                        return (
                            <div 
                                key={m.measurementId}
                                onClick={() => toggleMeasurement(m.measurementId)}
                                className={`
                                    cursor-pointer px-3 py-1.5 rounded-full border text-sm font-medium transition-all select-none flex items-center gap-2
                                    ${isSelected 
                                        ? "bg-amber-100 border-amber-300 text-amber-900 shadow-sm" 
                                        : "bg-white border-gray-200 text-gray-500 hover:border-amber-200"
                                    }
                                `}
                            >
                                {isSelected && <Check className="w-3 h-3 text-amber-600" />}
                                {m.measurementName}
                            </div>
                        )
                    })
                )}
            </div>
          </div>

          {/* Status & Order */}
          <div className="flex items-center justify-between">
             <div className="flex items-center space-x-2">
                <Switch 
                    checked={formData.isActive} 
                    onCheckedChange={(val) => setFormData({...formData, isActive: val})} 
                />
                <Label>{formData.isActive ? "Active" : "Inactive"}</Label>
             </div>
             
             <div className="flex items-center gap-2">
                <Label>Display Order:</Label>
                <Input 
                    type="number" 
                    className="w-20"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})} 
                />
             </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Item
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TailoringItemForm;