import { useState, useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Save } from "lucide-react";

interface UserRightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  userName: string;
}

// Define the shape of a Right (Permission)
interface PageRight {
  pageId: number;
  pageName: string;
  allowAccess: boolean;
  allowInsert: boolean;
  allowUpdate: boolean;
  allowDelete: boolean;
  allowPrint: boolean;
  allowExport: boolean;
}

const UserRightsModal = ({ isOpen, onClose, userId, userName }: UserRightsModalProps) => {
  const { fetchUserRights, saveUserRights, isSavingRights } = useUsers();
  const [rights, setRights] = useState<PageRight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load rights when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      fetchUserRights(userId)
        .then(setRights)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, userId]);

  // Helper to toggle a specific checkbox
  const toggleRight = (index: number, field: keyof PageRight) => {
    const newRights = [...rights];
    // @ts-ignore - Dynamic key access
    newRights[index][field] = !newRights[index][field];
    
    // Logic: If you give Insert/Update/Delete, you probably want Access too
    if (field !== 'allowAccess' && newRights[index][field]) {
        newRights[index].allowAccess = true;
    }

    setRights(newRights);
  };

  // Toggle Entire Row (Select All for a page)
  const toggleRow = (index: number, val: boolean) => {
    const newRights = [...rights];
    newRights[index] = {
        ...newRights[index],
        allowAccess: val,
        allowInsert: val,
        allowUpdate: val,
        allowDelete: val,
        allowPrint: val,
        allowExport: val
    };
    setRights(newRights);
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      await saveUserRights({ userId, rights });
      onClose();
    } catch (err) {
      // Toast handled in hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Permissions: <span className="text-amber-600">{userName}</span></DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-[300px] border rounded-md">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-gray-100 z-10">
                <TableRow>
                  <TableHead className="w-[200px]">Page Name</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                  <TableHead className="text-center">Print</TableHead>
                  <TableHead className="text-center">Export</TableHead>
                  <TableHead className="text-center text-xs">All</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rights.map((right, idx) => (
                  <TableRow key={right.pageId} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-700">
                      {right.pageName}
                    </TableCell>
                    
                    {/* Checkboxes */}
                    <TableCell className="text-center">
                      <Checkbox checked={right.allowAccess} onCheckedChange={() => toggleRight(idx, 'allowAccess')} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={right.allowInsert} onCheckedChange={() => toggleRight(idx, 'allowInsert')} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={right.allowUpdate} onCheckedChange={() => toggleRight(idx, 'allowUpdate')} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={right.allowDelete} onCheckedChange={() => toggleRight(idx, 'allowDelete')} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={right.allowPrint} onCheckedChange={() => toggleRight(idx, 'allowPrint')} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={right.allowExport} onCheckedChange={() => toggleRight(idx, 'allowExport')} />
                    </TableCell>
                    
                    {/* Row Select All */}
                    <TableCell className="text-center">
                        <Checkbox 
                            checked={right.allowAccess && right.allowInsert && right.allowDelete} // Simplified check
                            onCheckedChange={(val) => toggleRow(idx, !!val)} 
                            className="data-[state=checked]:bg-amber-600 border-amber-300"
                        />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSavingRights} className="bg-blue-600 hover:bg-blue-700">
            {isSavingRights && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserRightsModal;