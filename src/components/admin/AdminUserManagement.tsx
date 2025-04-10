
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Plus, UserPlus, UserCog } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  bio: string | null;
  tenant_status: string | null;
  role: string;
  created_at: string;
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    bio: "",
    tenant_status: "tenant",
    role: "tenant"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (rolesError) throw rolesError;
      
      // Map roles to a user ID lookup
      const rolesMap: Record<string, string> = {};
      userRoles?.forEach(roleEntry => {
        rolesMap[roleEntry.user_id] = roleEntry.role;
      });
      
      // Combine the data
      const usersList = profiles?.map(profile => ({
        id: profile.id,
        email: "", // We don't have access to this from auth.users
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        bio: profile.bio,
        tenant_status: profile.tenant_status,
        role: rolesMap[profile.id] || "tenant",
        created_at: profile.created_at
      })) || [];
      
      setUsers(usersList);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    ((user.first_name || "") + " " + (user.last_name || "")).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async () => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
        user_metadata: {
          first_name: newUser.first_name,
          last_name: newUser.last_name
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) throw new Error("Failed to create user");
      
      // Then update their profile with additional info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: newUser.bio,
          phone_number: newUser.phone_number,
          tenant_status: newUser.tenant_status
        })
        .eq('id', authData.user.id);
        
      if (profileError) throw profileError;
      
      // Add user role if not tenant
      if (newUser.role !== "tenant") {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: newUser.role
          });
          
        if (roleError) throw roleError;
      }
      
      toast.success("User added successfully");
      fetchUsers();
      setShowAddDialog(false);
      resetUserForm();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(error.message || "Failed to add user");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
          phone_number: selectedUser.phone_number,
          bio: selectedUser.bio,
          tenant_status: selectedUser.tenant_status
        })
        .eq('id', selectedUser.id);
        
      if (profileError) throw profileError;
      
      // Check if role changed
      const { data: currentRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', selectedUser.id)
        .maybeSingle();
        
      if (roleCheckError) throw roleCheckError;
      
      if (currentRole?.role !== selectedUser.role) {
        if (currentRole) {
          // Update existing role
          const { error: updateRoleError } = await supabase
            .from('user_roles')
            .update({ role: selectedUser.role })
            .eq('user_id', selectedUser.id);
            
          if (updateRoleError) throw updateRoleError;
        } else if (selectedUser.role !== "tenant") {
          // Insert new role
          const { error: insertRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: selectedUser.id,
              role: selectedUser.role
            });
            
          if (insertRoleError) throw insertRoleError;
        }
      }
      
      toast.success("User updated successfully");
      fetchUsers();
      setIsEditing(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Admin delete user
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const resetUserForm = () => {
    setNewUser({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      bio: "",
      tenant_status: "tenant",
      role: "tenant"
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>User Management</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              className="max-w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new user. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name" 
                        value={newUser.first_name}
                        onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                        placeholder="John" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name" 
                        value={newUser.last_name}
                        onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                        placeholder="Doe" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="johndoe@example.com" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      placeholder="••••••••" 
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input 
                      id="phone_number" 
                      value={newUser.phone_number}
                      onChange={(e) => setNewUser({...newUser, phone_number: e.target.value})}
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value) => setNewUser({...newUser, role: value})}
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="property_manager">Property Manager</SelectItem>
                          <SelectItem value="tenant">Tenant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tenant_status">Status</Label>
                      <Select 
                        value={newUser.tenant_status} 
                        onValueChange={(value) => setNewUser({...newUser, tenant_status: value})}
                      >
                        <SelectTrigger id="tenant_status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant">Tenant</SelectItem>
                          <SelectItem value="landlord">Landlord</SelectItem>
                          <SelectItem value="property_manager">Property Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={newUser.bio}
                      onChange={(e) => setNewUser({...newUser, bio: e.target.value})}
                      placeholder="Tell us about this user..." 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    resetUserForm();
                    setShowAddDialog(false);
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {(user.first_name || '') + ' ' + (user.last_name || '')}
                    </TableCell>
                    <TableCell>{user.email || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className={
                        user.tenant_status === 'landlord' 
                          ? 'bg-blue-100 text-blue-800' 
                          : user.tenant_status === 'property_manager'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                      }>
                        {user.tenant_status || 'Tenant'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                        {user.role || 'Tenant'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <UserCog className="h-4 w-4 mr-2" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setIsEditing(true);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit dialog */}
      {selectedUser && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Edit the details for this user. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_first_name">First Name</Label>
                  <Input 
                    id="edit_first_name" 
                    value={selectedUser.first_name || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_last_name">Last Name</Label>
                  <Input 
                    id="edit_last_name" 
                    value={selectedUser.last_name || ''}
                    onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_phone_number">Phone Number</Label>
                <Input 
                  id="edit_phone_number" 
                  value={selectedUser.phone_number || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, phone_number: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_role">Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                  >
                    <SelectTrigger id="edit_role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_tenant_status">Status</Label>
                  <Select 
                    value={selectedUser.tenant_status || 'tenant'} 
                    onValueChange={(value) => setSelectedUser({...selectedUser, tenant_status: value})}
                  >
                    <SelectTrigger id="edit_tenant_status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="landlord">Landlord</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_bio">Bio</Label>
                <Textarea 
                  id="edit_bio" 
                  value={selectedUser.bio || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, bio: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSelectedUser(null);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
