import { useState, useEffect } from "react";
import { useMeasurements, Measurement } from "@/hooks/useMeasurements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, GripVertical, Search, Loader2 } from "lucide-react";
import MeasurementForm from "./MeasurementForm";

const MeasurementList = () => {
  const { fetchMeasurements, deleteMeasurement } = useMeasurements();
  
  const [data, setData] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Measurement | null>(null);

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
        const result = await fetchMeasurements();
        // Sort by Display Order locally
        const sorted = (result || []).sort((a: Measurement, b: Measurement) => a.displayOrder - b.displayOrder);
        setData(sorted);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filteredData = data.filter(item => 
    item.measurementName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this measurement?")) {
        await deleteMeasurement(id);
        loadData();
    }
  };

  const openCreate = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Measurement) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Measurements</h1>
          <p className="text-muted-foreground text-sm">Manage your measurement units and standard sizes.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search measurements..."
                    className="pl-9 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Add Button */}
            <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
        </div>
      </div>

      {/* TABLE STRUCTURE */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead> {/* Drag Handle */}
              <TableHead className="w-[60px]">SR</TableHead>
              <TableHead>Measurement Name</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow>
                 <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center gap-2 text-muted-foreground">
                        <Loader2 className="animate-spin h-5 w-5" /> Loading...
                    </div>
                 </TableCell>
               </TableRow>
            ) : filteredData.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No measurements found.
                    </TableCell>
                </TableRow>
            ) : (
                filteredData.map((item, index) => (
                    <TableRow key={item.measurementId} className="hover:bg-gray-50/50 group">
                        
                        {/* Drag Handle */}
                        <TableCell>
                            <GripVertical className="text-gray-400 cursor-move h-4 w-4" />
                        </TableCell>

                        {/* Serial Number */}
                        <TableCell className="font-mono text-xs text-gray-500">
                            {(index + 1).toString().padStart(2, '0')}
                        </TableCell>

                        {/* Name + Icon */}
                        <TableCell>
                            <span className="font-medium text-gray-900">{item.measurementName}</span>
                        </TableCell>

                        {/* Display Order */}
                        <TableCell className="text-gray-500 text-sm">
                            {item.displayOrder}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                            <Badge variant="outline" className={item.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                                {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                                    onClick={() => openEdit(item)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleDelete(item.measurementId)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* EDIT MODAL */}
      <MeasurementForm 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        itemToEdit={itemToEdit} 
      />
    </div>
  );
};

export default MeasurementList;