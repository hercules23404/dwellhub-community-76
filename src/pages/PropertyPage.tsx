
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProperties } from "@/components/property/useProperties";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyStatus } from "@/components/property/PropertyCard";

export default function PropertyPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { addProperty } = useProperties();
  const { user } = useAuth();
  
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    bedrooms: "2",
    bathrooms: "1",
    area: "1000",
    type: "Apartment",
    status: "vacant" as PropertyStatus,
    features: [""],
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800"]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setPropertyData({
      ...propertyData,
      [id]: value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    if (field === "status") {
      // Ensure status is cast as PropertyStatus
      setPropertyData({
        ...propertyData,
        [field]: value as PropertyStatus
      });
    } else {
      setPropertyData({
        ...propertyData,
        [field]: value
      });
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!propertyData.title || !propertyData.address || !propertyData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Convert price string to number
      const numericPrice = parseInt(propertyData.price);
      if (isNaN(numericPrice)) {
        toast.error("Please enter a valid price");
        return;
      }

      // Add property
      await addProperty({
        ...propertyData,
        price: numericPrice,
        bedrooms: parseInt(propertyData.bedrooms),
        bathrooms: parseInt(propertyData.bathrooms),
        area: parseInt(propertyData.area),
        features: ["Furnished", "Parking", "Pet Friendly"]  // Default features for now
      });

      toast.success("Property listed successfully");

      // Reset form and close dialog
      setPropertyData({
        title: "",
        description: "",
        price: "",
        address: "",
        bedrooms: "2",
        bathrooms: "1",
        area: "1000",
        type: "Apartment",
        status: "vacant" as PropertyStatus,
        features: [""],
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800"]
      });
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Failed to list property");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <div className="pt-20 pb-16 px-4 lg:pr-72 lg:pl-8 max-w-screen-2xl mx-auto">
        <Container maxWidth="full" padding="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Available Properties</h1>
            
            {user && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    List Your Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>
                      Enter the details for your property listing. Click submit when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Property Name</Label>
                        <Input 
                          id="title" 
                          value={propertyData.title}
                          onChange={handleChange}
                          placeholder="Enter property name" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Property Type</Label>
                        <Select 
                          value={propertyData.type} 
                          onValueChange={(value) => handleSelectChange("type", value)}
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
                        value={propertyData.address}
                        onChange={handleChange}
                        placeholder="Enter full address" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={propertyData.description}
                        onChange={handleChange}
                        placeholder="Describe your property" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="price">Monthly Rent ($)</Label>
                        <Input 
                          id="price" 
                          type="number"
                          value={propertyData.price}
                          onChange={handleChange}
                          placeholder="1200" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          value={propertyData.status} 
                          onValueChange={(value) => handleSelectChange("status", value)}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vacant">Vacant</SelectItem>
                            <SelectItem value="occupied">Occupied</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input 
                          id="bedrooms" 
                          type="number"
                          min="0"
                          value={propertyData.bedrooms}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input 
                          id="bathrooms" 
                          type="number"
                          min="0"
                          step="0.5"
                          value={propertyData.bathrooms}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="area">Area (sq ft)</Label>
                        <Input 
                          id="area" 
                          type="number"
                          min="1"
                          value={propertyData.area}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                      Add Property
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <PropertyGrid />
        </Container>
      </div>
    </div>
  );
}
