import { useState, useEffect } from "react";
import { useUsers, User } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Shield, Plus, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import UserForm from "./UserForm";
import UserRightsModal from "./UserRightsModal"; // <--- 1. NEW IMPORT

const UserList = () => {
  // --- STATE ---
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- MODAL STATE (Create/Edit) ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // --- MODAL STATE (User Rights) ---  <--- 2. NEW STATE VARIABLES
  const [isRightsOpen, setIsRightsOpen] = useState(false);
  const [rightsUserId, setRightsUserId] = useState<number | null>(null);
  const [rightsUserName, setRightsUserName] = useState("");

  // --- API HOOK ---
  const { fetchUsers, deleteUser } = useUsers();

  // --- LOAD DATA ---
  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const activeFilter = status === "all" ? "" : status;
      const result = await fetchUsers({ 
        pageIndex: page, 
        pageCount: 10, 
        search, 
        active: activeFilter 
      });
      
      if (result.success || result.data) {
         setUsers(Array.isArray(result.data) ? result.data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, status]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") loadData();
  };

  // --- ACTIONS ---
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      loadData();
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  // Open Rights Modal (The Blue Shield Button)
  const handleRights = (user: User) => {
    // 3. NEW HANDLER LOGIC
    setRightsUserId(user.userId);
    setRightsUserName(user.userName);
    setIsRightsOpen(true);
  };

  const handleModalClose = () => {
    setIsFormOpen(false);
    loadData(); 
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-muted-foreground text-sm">Manage system access and permissions.</p>
        </div>
        <Button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, username or mobile..."
            className="pl-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-gray-50 border-gray-200">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="true">Active Only</SelectItem>
              <SelectItem value="false">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="secondary" onClick={loadData} className="bg-gray-100 hover:bg-gray-200 text-gray-900">
            Search
        </Button>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>User Profile</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingData ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                    <span className="text-sm">Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId} className="hover:bg-gray-50/50 transition-colors group">
                  <TableCell className="font-mono text-xs text-gray-500">#{user.userId}</TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                      <span className="text-xs text-gray-500 font-mono">@{user.userName}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-700">{user.emailId}</span>
                      <span className="text-xs text-gray-400">{user.mobileNo}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                        variant="outline"
                        className={
                          user.active 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                    >
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="text-gray-500 text-sm">
                    {user.createdDate ? format(new Date(user.createdDate), "dd MMM yyyy") : "-"}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        
                        {/* EDIT BUTTON */}
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 shadow-sm" 
                          title="Edit User"
                          onClick={() => openEditModal(user)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        
                        {/* RIGHTS BUTTON (NOW CONNECTED) */}
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 shadow-sm" 
                          title="Manage Rights"
                          onClick={() => handleRights(user)}
                        >
                            <Shield className="h-4 w-4" />
                        </Button>
                        
                        {/* DELETE BUTTON */}
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 shadow-sm" 
                            title="Delete User"
                            onClick={() => handleDelete(user.userId)}
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

      {/* --- FORM MODAL (Create/Edit) --- */}
      <UserForm 
        isOpen={isFormOpen} 
        onClose={handleModalClose} 
        userToEdit={userToEdit} 
      />

      {/* --- RIGHTS MODAL (New Permissions Table) --- */}
      {/* 4. NEW MODAL COMPONENT */}
      <UserRightsModal 
         isOpen={isRightsOpen} 
         onClose={() => setIsRightsOpen(false)} 
         userId={rightsUserId} 
         userName={rightsUserName}
      />

    </div>
  );
};

export default UserList;