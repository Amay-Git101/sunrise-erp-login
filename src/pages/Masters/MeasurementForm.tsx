import { useState, useEffect } from "react";
import { Measurement, useMeasurements } from "@/hooks/useMeasurements";
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
import { Loader2, Upload, ImageIcon } from "lucide-react";

interface MeasurementFormProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: Measurement | null;
}

const MeasurementForm = ({ isOpen, onClose, itemToEdit }: MeasurementFormProps) => {
  const { saveMeasurement, isSaving } = useMeasurements();

  // Form State
  const [formData, setFormData] = useState<Partial<Measurement>>({
    measurementName: "",
    displayOrder: 0,
    isActive: true,
    imageUrl: ""
  });

  // Populate on Edit
  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
    } else {
      setFormData({
        measurementName: "",
        displayOrder: 0,
        isActive: true,
        imageUrl: ""
      });
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveMeasurement(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{itemToEdit ? "Edit Measurement" : "Add Measurement"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          
          {/* SECTION A: Unit Information */}
          <div className="space-y-2">
            <Label>Measurement Name <span className="text-red-500">*</span></Label>
            <Input 
              required
              placeholder="e.g. Shoulder"
              value={formData.measurementName} 
              onChange={(e) => setFormData({...formData, measurementName: e.target.value})}
            />
          </div>

          {/* SECTION B: Measurement Image */}
          <div className="flex items-center gap-4 border p-3 rounded-md bg-gray-50/50">
            {/* Image Preview / Placeholder */}
            <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center border border-gray-300">
               {formData.imageUrl ? (
                   <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover rounded-md" />
               ) : (
                   <ImageIcon className="text-gray-400 h-8 w-8" />
               )}
            </div>
            
            <div className="flex-1 space-y-1">
                <p className="text-xs text-muted-foreground mb-2">
                    Accepted formats: JPG, PNG, WEBP (Max 5MB)
                </p>
                <Button type="button" variant="outline" size="sm" className="h-8">
                    <Upload className="mr-2 h-3 w-3" /> Upload Image
                </Button>
            </div>
          </div>

          {/* SECTION C: Display Order + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Display Order</Label>
                <Input 
                    type="number"
                    min={0}
                    value={formData.displayOrder} 
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value)})}
                />
            </div>

            <div className="space-y-2 flex flex-col justify-end pb-2">
                 <div className="flex items-center space-x-2 border p-2 rounded-md bg-white">
                    <Switch 
                        checked={formData.isActive} 
                        onCheckedChange={(val) => setFormData({...formData, isActive: val})} 
                    />
                    <Label className="cursor-pointer">
                        {formData.isActive ? "Active" : "Inactive"}
                    </Label>
                 </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {itemToEdit ? "Update Measurement" : "Save Measurement"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeasurementForm;