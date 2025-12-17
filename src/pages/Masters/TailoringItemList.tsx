import { useState, useEffect } from "react";
import { useTailoringItems, TailoringItem } from "@/hooks/useTailoringItems";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Scissors, Search, Loader2 } from "lucide-react";
import TailoringItemForm from "./TailoringItemForm";

const TailoringItemList = () => {
  const { fetchItems, deleteItem } = useTailoringItems();
  
  const [data, setData] = useState<TailoringItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<TailoringItem | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
        const result = await fetchItems();
        const sorted = (result || []).sort((a: TailoringItem, b: TailoringItem) => a.displayOrder - b.displayOrder);
        setData(sorted);
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Delete this item?")) {
        await deleteItem(id);
        loadData();
    }
  };

  const openCreate = () => { setItemToEdit(null); setIsModalOpen(true); };
  const openEdit = (item: TailoringItem) => { setItemToEdit(item); setIsModalOpen(true); };
  const handleModalClose = () => { setIsModalOpen(false); loadData(); };

  const filtered = data.filter(d => d.itemName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tailoring Items</h1>
          <p className="text-muted-foreground text-sm">Define what you stitch (Shirts, Pants) and their measurements.</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search items..." className="pl-9 bg-white" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Button onClick={openCreate} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="w-[60px]">SR</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Measurements</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No items defined yet.</TableCell></TableRow>
            ) : (
                filtered.map((item, index) => (
                    <TableRow key={item.itemId} className="hover:bg-gray-50/50">
                        <TableCell className="font-mono text-xs text-gray-500">{(index + 1).toString().padStart(2, '0')}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Scissors className="h-4 w-4 text-amber-600" />
                                <span className="font-medium text-gray-900">{item.itemName}</span>
                            </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{item.itemCode || "-"}</Badge></TableCell>
                        
                        {/* Show count of linked measurements */}
                        <TableCell className="text-xs text-gray-500">
                            {item.measurementIds?.length || 0} measurements linked
                        </TableCell>

                        <TableCell>
                            <Badge variant="outline" className={item.isActive ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                                {item.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => openEdit(item)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDelete(item.itemId)}>
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

      <TailoringItemForm isOpen={isModalOpen} onClose={handleModalClose} itemToEdit={itemToEdit} />
    </div>
  );
};

export default TailoringItemList;