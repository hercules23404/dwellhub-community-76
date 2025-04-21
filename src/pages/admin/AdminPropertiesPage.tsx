
import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building, Plus } from "lucide-react";

// Property type definition
interface Property {
  id: string;
  name: string;
  flatNumber: string;
  type: string;
  rent: number;
  isAvailable: boolean;
}

export default function AdminPropertiesPage() {
  // Form state
  const [name, setName] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [type, setType] = useState("2BHK");
  const [rent, setRent] = useState("");
  const [isAvailable, setIsAvailable] = useState("yes");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Properties list state
  const [properties, setProperties] = useState<Property[]>([
    { id: "1", name: "Seaside Apartment", flatNumber: "204", type: "2BHK", rent: 15000, isAvailable: true },
    { id: "2", name: "Mountain View", flatNumber: "501", type: "3BHK", rent: 22000, isAvailable: false },
    { id: "3", name: "Garden Court", flatNumber: "102", type: "1BHK", rent: 10000, isAvailable: true },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !flatNumber || !type || !rent) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new property
    const newProperty: Property = {
      id: Date.now().toString(),
      name,
      flatNumber,
      type,
      rent: parseFloat(rent),
      isAvailable: isAvailable === "yes",
    };
    
    // Simulate API call delay
    setTimeout(() => {
      setProperties(prev => [newProperty, ...prev]);
      
      // Reset form
      setName("");
      setFlatNumber("");
      setType("2BHK");
      setRent("");
      setIsAvailable("yes");
      
      setIsSubmitting(false);
      toast.success("Property listing created successfully!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold">Property Listings</h1>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Plus size={18} />
                  Create New Property
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Property Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Seaside Apartment"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="flatNumber">Flat Number</Label>
                      <Input
                        id="flatNumber"
                        value={flatNumber}
                        onChange={(e) => setFlatNumber(e.target.value)}
                        placeholder="e.g. 101"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select 
                        value={type} 
                        onValueChange={setType}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1BHK">1BHK</SelectItem>
                          <SelectItem value="2BHK">2BHK</SelectItem>
                          <SelectItem value="3BHK">3BHK</SelectItem>
                          <SelectItem value="4BHK">4BHK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rent">Rent Amount (₹)</Label>
                      <Input
                        id="rent"
                        value={rent}
                        onChange={(e) => setRent(e.target.value)}
                        type="number"
                        placeholder="e.g. 15000"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Select 
                        value={isAvailable} 
                        onValueChange={setIsAvailable}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger id="availability">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Available</SelectItem>
                          <SelectItem value="no">Rented</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Property Listing"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-semibold mt-8">Current Properties</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className={property.isAvailable ? "border-l-4 border-l-green-500" : "border-l-4 border-l-orange-500"}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-medium">{property.name}</h3>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${property.isAvailable ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                        {property.isAvailable ? "Available" : "Rented"}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">Flat {property.flatNumber}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{property.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rent:</span>
                        <span className="font-medium">₹{property.rent.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
