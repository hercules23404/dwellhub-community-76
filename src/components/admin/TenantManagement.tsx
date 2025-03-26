
import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Plus, User, Mail, Phone, Home } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock tenant data
const mockTenants = [
  {
    id: "TEN-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    property: "Sunset Apartments",
    unit: "101",
    status: "active",
    leaseEnd: "2023-12-31",
    paymentStatus: "paid",
  },
  {
    id: "TEN-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "(555) 987-6543",
    property: "Mountain View Condos",
    unit: "205",
    status: "active",
    leaseEnd: "2024-05-15",
    paymentStatus: "overdue",
  },
  {
    id: "TEN-003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "(555) 456-7890",
    property: "Garden Villas",
    unit: "302",
    status: "inactive",
    leaseEnd: "2023-03-10",
    paymentStatus: "paid",
  },
  {
    id: "TEN-004",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "(555) 789-0123",
    property: "City Center Lofts",
    unit: "408",
    status: "active",
    leaseEnd: "2024-08-22",
    paymentStatus: "pending",
  },
];

// Mock property data for dropdown
const properties = [
  { id: "PRO-101", name: "Sunset Apartments", units: ["101", "102", "103", "104"] },
  { id: "PRO-102", name: "Mountain View Condos", units: ["201", "202", "203", "204", "205"] },
  { id: "PRO-103", name: "Garden Villas", units: ["301", "302", "303"] },
  { id: "PRO-104", name: "City Center Lofts", units: ["401", "402", "403", "404", "405", "406", "407", "408"] },
];

export function TenantManagement() {
  const [tenants, setTenants] = useState(mockTenants);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [newTenant, setNewTenant] = useState({
    name: "",
    email: "",
    phone: "",
    property: "",
    unit: "",
    leaseEnd: "",
    status: "active",
    paymentStatus: "pending"
  });

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePropertyChange = (propertyName: string) => {
    setSelectedProperty(propertyName);
    setNewTenant({...newTenant, property: propertyName, unit: ""});
    
    // Find the corresponding property and get its units
    const property = properties.find(p => p.name === propertyName);
    if (property) {
      setAvailableUnits(property.units);
    } else {
      setAvailableUnits([]);
    }
  };

  const handleAddTenant = () => {
    const tenant = {
      ...newTenant,
      id: `TEN-${tenants.length + 1}`.padStart(6, '0'),
    };
    
    setTenants([...tenants, tenant]);
    setNewTenant({
      name: "",
      email: "",
      phone: "",
      property: "",
      unit: "",
      leaseEnd: "",
      status: "active",
      paymentStatus: "pending"
    });
    
    setShowAddDialog(false);
    toast.success("Tenant added successfully");
  };

  const handleDeleteTenant = (id: string) => {
    setTenants(tenants.filter(tenant => tenant.id !== id));
    toast.success("Tenant removed successfully");
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Tenant Management</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search tenants..."
              className="max-w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tenant
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Tenant</DialogTitle>
                  <DialogDescription>
                    Enter the tenant's details and assign them to a property unit.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={newTenant.name}
                        onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={newTenant.email}
                        onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                        placeholder="email@example.com" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={newTenant.phone}
                      onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                      placeholder="(555) 123-4567" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="property">Property</Label>
                      <Select 
                        value={newTenant.property} 
                        onValueChange={handlePropertyChange}
                      >
                        <SelectTrigger id="property">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map(property => (
                            <SelectItem key={property.id} value={property.name}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select 
                        value={newTenant.unit} 
                        onValueChange={(value) => setNewTenant({...newTenant, unit: value})}
                        disabled={!selectedProperty}
                      >
                        <SelectTrigger id="unit">
                          <SelectValue placeholder={selectedProperty ? "Select unit" : "Select property first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableUnits.map(unit => (
                            <SelectItem key={unit} value={unit}>
                              Unit {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="leaseEnd">Lease End Date</Label>
                      <Input 
                        id="leaseEnd" 
                        type="date"
                        value={newTenant.leaseEnd}
                        onChange={(e) => setNewTenant({...newTenant, leaseEnd: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newTenant.status} 
                        onValueChange={(value) => setNewTenant({...newTenant, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTenant}>
                    Add Tenant
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tenants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="overdue">Overdue Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead className="hidden md:table-cell">Lease End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.length > 0 ? (
                    filteredTenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src="" alt={tenant.name} />
                              <AvatarFallback>{getInitials(tenant.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{tenant.name}</div>
                              <div className="text-xs text-muted-foreground">{tenant.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {tenant.email}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" /> {tenant.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{tenant.property}</div>
                            <div className="text-xs text-muted-foreground">Unit {tenant.unit}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{tenant.leaseEnd}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(tenant.status)}>
                            {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPaymentStatusColor(tenant.paymentStatus)}>
                            {tenant.paymentStatus.charAt(0).toUpperCase() + tenant.paymentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Home className="mr-2 h-4 w-4" />
                                View Property
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTenant(tenant.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                        No tenants found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Similar structure for other tabs, filtered by tenant status */}
          <TabsContent value="active" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead className="hidden md:table-cell">Lease End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTenants.filter(t => t.status === "active").length > 0 ? (
                    filteredTenants
                      .filter(t => t.status === "active")
                      .map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src="" alt={tenant.name} />
                                <AvatarFallback>{getInitials(tenant.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{tenant.name}</div>
                                <div className="text-xs text-muted-foreground">{tenant.id}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {tenant.email}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Phone className="h-3 w-3" /> {tenant.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{tenant.property}</div>
                              <div className="text-xs text-muted-foreground">Unit {tenant.unit}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{tenant.leaseEnd}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(tenant.status)}>
                              {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getPaymentStatusColor(tenant.paymentStatus)}>
                              {tenant.paymentStatus.charAt(0).toUpperCase() + tenant.paymentStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Home className="mr-2 h-4 w-4" />
                                  View Property
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteTenant(tenant.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                        No active tenants found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Repeat for inactive and overdue tabs */}
        </Tabs>
      </CardContent>
    </Card>
  );
}
