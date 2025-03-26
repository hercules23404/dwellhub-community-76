
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
import { Edit, Trash, Plus, Image } from "lucide-react";
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

// Mock property data
const mockProperties = [
  {
    id: "PRO-101",
    name: "Sunset Apartments",
    address: "123 Maple Street, Springfield",
    type: "Apartment",
    units: 12,
    rent: "$1200",
    status: "available",
    featured: true,
  },
  {
    id: "PRO-102",
    name: "Mountain View Condos",
    address: "456 Oak Avenue, Riverdale",
    type: "Condo",
    units: 8,
    rent: "$1500",
    status: "rented",
    featured: false,
  },
  {
    id: "PRO-103",
    name: "Garden Villas",
    address: "789 Pine Road, Westfield",
    type: "House",
    units: 6,
    rent: "$2200",
    status: "maintenance",
    featured: true,
  },
  {
    id: "PRO-104",
    name: "City Center Lofts",
    address: "101 Downtown Blvd, Metro City",
    type: "Loft",
    units: 10,
    rent: "$1800",
    status: "available",
    featured: false,
  },
];

export function PropertyManagement() {
  const [properties, setProperties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: "",
    address: "",
    type: "Apartment",
    units: 1,
    rent: "",
    status: "available",
    featured: false
  });

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = () => {
    const property = {
      ...newProperty,
      id: `PRO-${100 + properties.length + 1}`,
    };
    
    setProperties([...properties, property]);
    setNewProperty({
      name: "",
      address: "",
      type: "Apartment",
      units: 1,
      rent: "",
      status: "available",
      featured: false
    });
    
    setShowAddDialog(false);
    toast.success("Property added successfully");
  };

  const handleDeleteProperty = (id: string) => {
    setProperties(properties.filter(property => property.id !== id));
    toast.success("Property deleted successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Property Listings</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search properties..."
              className="max-w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Property</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new property listing. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Property Name</Label>
                      <Input 
                        id="name" 
                        value={newProperty.name}
                        onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                        placeholder="Enter property name" 
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Property Type</Label>
                      <Select 
                        value={newProperty.type} 
                        onValueChange={(value) => setNewProperty({...newProperty, type: value})}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="Condo">Condo</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Loft">Loft</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={newProperty.address}
                      onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                      placeholder="Enter full address" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="units">Units</Label>
                      <Input 
                        id="units" 
                        type="number"
                        min="1"
                        value={newProperty.units}
                        onChange={(e) => setNewProperty({...newProperty, units: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rent">Monthly Rent</Label>
                      <Input 
                        id="rent" 
                        value={newProperty.rent}
                        onChange={(e) => setNewProperty({...newProperty, rent: e.target.value})}
                        placeholder="$0.00" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={newProperty.status} 
                        onValueChange={(value) => setNewProperty({...newProperty, status: value})}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 h-full pt-8">
                      <Label htmlFor="featured" className="cursor-pointer flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newProperty.featured}
                          onChange={(e) => setNewProperty({...newProperty, featured: e.target.checked})}
                          className="h-4 w-4"
                        />
                        Featured Listing
                      </Label>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Property Images</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center text-center">
                      <Image className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop images here or click to browse
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Upload Images
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddProperty}>
                    Save Property
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
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="rented">Rented</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Address</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Units</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.id}</TableCell>
                        <TableCell>
                          {property.name}
                          {property.featured && (
                            <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                              Featured
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{property.address}</TableCell>
                        <TableCell className="hidden md:table-cell">{property.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{property.units}</TableCell>
                        <TableCell>{property.rent}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(property.status)}>
                            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
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
                              <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        No properties found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="available" className="mt-0">
            <div className="rounded-md border">
              <Table>
                {/* Similar structure as "all" tab but filtered for available properties */}
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Address</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Units</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.filter(p => p.status === "available").length > 0 ? (
                    filteredProperties
                      .filter(p => p.status === "available")
                      .map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.id}</TableCell>
                          <TableCell>
                            {property.name}
                            {property.featured && (
                              <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                Featured
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{property.address}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.units}</TableCell>
                          <TableCell>{property.rent}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(property.status)}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
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
                                <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        No available properties found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Repeat similar structure for "rented" and "maintenance" tabs */}
          <TabsContent value="rented" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Address</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Units</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.filter(p => p.status === "rented").length > 0 ? (
                    filteredProperties
                      .filter(p => p.status === "rented")
                      .map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.id}</TableCell>
                          <TableCell>{property.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.address}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.units}</TableCell>
                          <TableCell>{property.rent}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(property.status)}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
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
                                <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        No rented properties found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="maintenance" className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Address</TableHead>
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Units</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProperties.filter(p => p.status === "maintenance").length > 0 ? (
                    filteredProperties
                      .filter(p => p.status === "maintenance")
                      .map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.id}</TableCell>
                          <TableCell>{property.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.address}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{property.units}</TableCell>
                          <TableCell>{property.rent}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(property.status)}>
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
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
                                <DropdownMenuItem onClick={() => handleDeleteProperty(property.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        No properties in maintenance found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
