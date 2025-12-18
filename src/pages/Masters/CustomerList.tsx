import { useState } from "react";
import { Plus, Search, Upload, MoreHorizontal, Pencil, Trash2, Ruler, ChevronLeft, ChevronRight, RefreshCw, Phone, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// IMPORT TYPE AND HOOK
import { useCustomers, Customer } from "@/hooks/useCustomers"; // <--- Import Customer here
import CustomerFormPanel from "@/components/CustomerFormPanel";
import CustomerMeasurementPanel from "@/components/CustomerMeasurementPanel";

const CustomerList = () => {
  const { customers, isLoading, addCustomer, updateCustomer, deleteCustomer, saveMeasurements } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMeasureOpen, setIsMeasureOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null); // <--- Use the Type here

  // Safe filtering with Type Check
  const filteredData = customers?.filter((c: Customer) => {
    const searchLower = searchTerm.toLowerCase();
    const name = c.personName?.toLowerCase() || "";
    const mobile = c.contactNo || "";
    return name.includes(searchLower) || mobile.includes(searchLower);
  }) || [];

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // ACTIONS
  const handleAdd = () => { setSelectedCustomer(null); setIsFormOpen(true); };
  
  const handleEdit = (row: Customer) => { // <--- Type the row
      setSelectedCustomer(row); 
      setIsFormOpen(true); 
  };
  
  const handleMeasurements = (row: Customer) => { 
      setSelectedCustomer(row); 
      setIsMeasureOpen(true); 
  };
  
  const handleSaveForm = async (data: any) => {
    if (selectedCustomer) await updateCustomer(selectedCustomer.contactId, data);
    else await addCustomer(data);
  };

  const handleSaveMeasurements = async (id: number, data: any[]) => {
    await saveMeasurements(id, data);
  };

  return (
    <div className="space-y-6">
      {/* Header code remains the same... */}
      
      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Contact Details</th>
                        <th className="px-6 py-4">Company</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {/* ... Loading and Empty states ... */}
                    
                    {currentData.map((row: Customer) => ( // <--- Explicitly type row as Customer
                        <tr key={row.contactId} className="hover:bg-orange-50/30 transition-colors group">
                             {/* ... Columns remain the same, accessing row.personName etc ... */}
                             {/* Example Column 1 */}
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10 border bg-white">
                                        <AvatarFallback>{row.personName?.substring(0,1) || "C"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900">{row.personName}</p>
                                        <p className="text-[10px] text-gray-400">ID: {row.contactId}</p>
                                    </div>
                                </div>
                             </td>
                             
                             {/* Rest of the columns... */}
                             
                             <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(row)}>
                                            <Pencil className="w-4 h-4 mr-2" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleMeasurements(row)}>
                                            <Ruler className="w-4 h-4 mr-2" /> Measurements
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => deleteCustomer(row.contactId)} className="text-red-600">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/* Pagination code remains the same... */}
      </div>

      {/* PANELS */}
      <CustomerFormPanel 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedCustomer}
        onSave={handleSaveForm}
      />
      <CustomerMeasurementPanel
        isOpen={isMeasureOpen}
        onClose={() => setIsMeasureOpen(false)}
        customer={selectedCustomer}
        onSave={handleSaveMeasurements}
      />
    </div>
  );
};

export default CustomerList;