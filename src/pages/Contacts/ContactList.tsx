import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Phone, Briefcase, MoreHorizontal, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useContacts, Contact } from "@/hooks/useContacts";
import ContactForm from "./ContactForm";

const ContactList = () => {
  const { contacts, isLoading, addContact, updateContact, deleteContact } = useContacts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Safe Filtering (Handling potential nulls from API)
  const filteredData = contacts?.filter(c => 
    c.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contactNo?.includes(searchTerm)
  ) || [];

  // --- HANDLERS ---
  const handleAddNew = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: Contact) => {
    setEditingContact(row);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingContact) {
        // FIX: Passing a single object { id, data } to match the Hook
        await updateContact({ 
            id: editingContact.contactId, 
            data: formData 
        });
      } else {
        await addContact(formData);
      }
      setIsModalOpen(false); // Close only on success
    } catch (error) {
      console.error("Failed to save", error);
      // Toast is already handled in the hook
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Contact Master</h1>
           <p className="text-gray-500 text-sm">Manage customers, suppliers, and staff</p>
        </div>
        <Button onClick={handleAddNew} className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Add New Contact
        </Button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm max-w-md">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
                placeholder="Search by Name, Company, or Phone..." 
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[300px]">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-orange-500" />
                <p>Loading contacts...</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Company Info</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    No contacts found. Click "Add New Contact" to create one.
                                </td>
                            </tr>
                        ) : filteredData.map((row) => (
                            <tr key={row.contactId} className="hover:bg-orange-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs border border-orange-200">
                                            {row.personName?.substring(0,2).toUpperCase() || "NA"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{row.personName}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">ID: #{row.contactId}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <p className="text-gray-900 font-medium flex items-center gap-2">
                                            <Briefcase className="w-3.5 h-3.5 text-gray-400"/> 
                                            {row.companyName || <span className="text-gray-400 italic">No Company</span>}
                                        </p>
                                        <p className="text-xs text-gray-500 pl-5.5">{row.designation}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <p className="text-gray-700 flex items-center gap-2">
                                            <Phone className="w-3.5 h-3.5 text-gray-400"/> {row.contactNo}
                                        </p>
                                        {row.emailId && (
                                            <p className="text-xs text-blue-500 flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-blue-300"/> {row.emailId}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                                        {row.contactType || "General"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-white">
                                            <DropdownMenuItem onClick={() => handleEdit(row)} className="cursor-pointer">
                                                <Pencil className="w-4 h-4 mr-2 text-blue-500" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => deleteContact(row.contactId)} className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
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
        )}
      </div>

      {/* MODAL FORM */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
                <DialogTitle>{editingContact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
            </DialogHeader>
            <ContactForm 
                initialData={editingContact} 
                onSave={handleSave} 
                onCancel={() => setIsModalOpen(false)} 
            />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactList;