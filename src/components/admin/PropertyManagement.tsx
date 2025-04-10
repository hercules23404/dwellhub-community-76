
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
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

// Define property interface
interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  rent: string;
  status: string;
  featured: boolean;
  bedrooms?: number;
  bathrooms?: number;
  size_sqft?: number;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
}

export function PropertyManagement() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({
    name: "",
    address: "",
    type: "Apartment",
    units: 1,
    rent: "",
    status: "available",
    featured: false,
    bedrooms: 2,
    bathrooms: 1,
    size_sqft: 1000,
    description: "",
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800"
  });

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) throw error;
      
      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast.error(error.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => 
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: newProperty.name,
          address: newProperty.address,
          type: newProperty.type,
          units: newProperty.units,
          rent: newProperty.rent,
          status: newProperty.status,
          featured: newProperty.featured,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          size_sqft: newProperty.size_sqft,
          description: newProperty.description,
          image_url: newProperty.image_url
        })
        .select();
      
      if (error) throw error;
      
      fetchProperties();
      resetPropertyForm();
      setShowAddDialog(false);
      toast.success("Property added successfully");
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast.error(error.message || "Failed to add property");
    }
  };

  const handleEditProperty = async () => {
    if (!selectedProperty) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          name: selectedProperty.name,
          address: selectedProperty.address,
          type: selectedProperty.type,
          units: selectedProperty.units,
          rent: selectedProperty.rent,
          status: selectedProperty.status,
          featured: selectedProperty.featured,
          bedrooms: selectedProperty.bedrooms,
          bathrooms: selectedProperty.bathrooms,
          size_sqft: selectedProperty.size_sqft,
          description: selectedProperty.description,
          image_url: selectedProperty.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProperty.id);
      
      if (error) throw error;
      
      fetchProperties();
      setIsEditing(false);
      setSelectedProperty(null);
      toast.success("Property updated successfully");
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast.error(error.message || "Failed to update property");
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchProperties();
      toast.success("Property deleted successfully");
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast.error(error.message || "Failed to delete property");
    }
  };

  const resetPropertyForm = () => {
    setNewProperty({
      name: "",
      address: "",
      type: "Apartment",
      units: 1,
      rent: "",
      status: "available",
      featured: false,
      bedrooms: 2,
      bathrooms: 1,
      size_sqft: 1000,
      description: "",
      image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
      case "occupied":
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
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={newProperty.description}
                      onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                      placeholder="Enter property description" 
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
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input 
                        id="bedrooms" 
                        type="number"
                        min="0"
                        value={newProperty.bedrooms}
                        onChange={(e) => setNewProperty({...newProperty, bedrooms: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input 
                        id="bathrooms" 
                        type="number"
                        min="0"
                        step="0.5"
                        value={newProperty.bathrooms}
                        onChange={(e) => setNewProperty({...newProperty, bathrooms: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="size_sqft">Area (sq ft)</Label>
                      <Input 
                        id="size_sqft" 
                        type="number"
                        min="1"
                        value={newProperty.size_sqft}
                        onChange={(e) => setNewProperty({...newProperty, size_sqft: parseInt(e.target.value)})}
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
                    <Label htmlFor="image_url">Property Image URL</Label>
                    <Input 
                      id="image_url" 
                      value={newProperty.image_url}
                      onChange={(e) => setNewProperty({...newProperty, image_url: e.target.value})}
                      placeholder="Enter image URL" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    resetPropertyForm();
                    setShowAddDialog(false);
                  }}>
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
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        <div className="flex justify-center">
                          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-medium">{property.id.substring(0, 8)}...</TableCell>
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
                              <DropdownMenuItem onClick={() => {
                                setSelectedProperty(property);
                                setIsEditing(true);
                              }}>
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
                          <TableCell className="font-medium">{property.id.substring(0, 8)}...</TableCell>
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
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProperty(property);
                                  setIsEditing(true);
                                }}>
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
          
          {/* Similar structure for "rented" and "maintenance" tabs */}
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
                          <TableCell className="font-medium">{property.id.substring(0, 8)}...</TableCell>
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
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProperty(property);
                                  setIsEditing(true);
                                }}>
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
                          <TableCell className="font-medium">{property.id.substring(0, 8)}...</TableCell>
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
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProperty(property);
                                  setIsEditing(true);
                                }}>
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

      {/* Edit dialog */}
      {selectedProperty && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Property</DialogTitle>
              <DialogDescription>
                Edit the details for this property. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Property Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedProperty.name}
                    onChange={(e) => setSelectedProperty({...selectedProperty, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-type">Property Type</Label>
                  <Select 
                    value={selectedProperty.type} 
                    onValueChange={(value) => setSelectedProperty({...selectedProperty, type: value})}
                  >
                    <SelectTrigger id="edit-type">
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
                <Label htmlFor="edit-address">Address</Label>
                <Input 
                  id="edit-address" 
                  value={selectedProperty.address}
                  onChange={(e) => setSelectedProperty({...selectedProperty, address: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={selectedProperty.description || ''}
                  onChange={(e) => setSelectedProperty({...selectedProperty, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-units">Units</Label>
                  <Input 
                    id="edit-units" 
                    type="number"
                    min="1"
                    value={selectedProperty.units}
                    onChange={(e) => setSelectedProperty({...selectedProperty, units: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-rent">Monthly Rent</Label>
                  <Input 
                    id="edit-rent" 
                    value={selectedProperty.rent}
                    onChange={(e) => setSelectedProperty({...selectedProperty, rent: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                  <Input 
                    id="edit-bedrooms" 
                    type="number"
                    min="0"
                    value={selectedProperty.bedrooms || 1}
                    onChange={(e) => setSelectedProperty({...selectedProperty, bedrooms: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                  <Input 
                    id="edit-bathrooms" 
                    type="number"
                    min="0"
                    step="0.5"
                    value={selectedProperty.bathrooms || 1}
                    onChange={(e) => setSelectedProperty({...selectedProperty, bathrooms: parseInt(e.target.value)})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-size_sqft">Area (sq ft)</Label>
                  <Input 
                    id="edit-size_sqft" 
                    type="number"
                    min="1"
                    value={selectedProperty.size_sqft || 1000}
                    onChange={(e) => setSelectedProperty({...selectedProperty, size_sqft: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={selectedProperty.status} 
                    onValueChange={(value) => setSelectedProperty({...selectedProperty, status: value})}
                  >
                    <SelectTrigger id="edit-status">
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
                  <Label htmlFor="edit-featured" className="cursor-pointer flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-featured"
                      checked={selectedProperty.featured}
                      onChange={(e) => setSelectedProperty({...selectedProperty, featured: e.target.checked})}
                      className="h-4 w-4"
                    />
                    Featured Listing
                  </Label>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-image_url">Property Image URL</Label>
                <Input 
                  id="edit-image_url" 
                  value={selectedProperty.image_url || ''}
                  onChange={(e) => setSelectedProperty({...selectedProperty, image_url: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSelectedProperty(null);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditProperty}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
