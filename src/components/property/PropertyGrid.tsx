
import { useState, useEffect } from "react";
import { PropertyCard, PropertyData, PropertyStatus } from "./PropertyCard";
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
  Slider
} from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Filter, Plus, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PropertyGrid({ className }: { className?: string }) {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 6000]);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [propertyStatus, setPropertyStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

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

      // Transform Supabase data to match PropertyData format
      const transformedData: PropertyData[] = data.map(property => {
        // Extract numeric value from rent string (e.g., "$1200" => 1200)
        const numericRent = parseInt(property.rent.replace(/[^0-9]/g, ''));
        
        return {
          id: property.id,
          title: property.name,
          description: `Property in ${property.address}`,
          price: numericRent,
          address: property.address,
          bedrooms: Math.floor(Math.random() * 3) + 1, // Example: random between 1-3
          bathrooms: Math.floor(Math.random() * 2) + 1, // Example: random between 1-2
          area: Math.floor(Math.random() * 1000) + 500, // Example: random between 500-1500
          images: [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800",
          ],
          type: property.type,
          listingDate: formatDate(property.created_at),
          features: ["Parking", "Utilities Included"],
          status: property.status as PropertyStatus,
        };
      });

      setProperties(transformedData);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Just listed';
    } else if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
  };

  const filteredProperties = properties.filter((property) => {
    // Filter by search query
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by price range
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    // Filter by property type
    const matchesType = propertyType === "all" || property.type === propertyType;
    
    // Filter by bedrooms
    const matchesBedrooms = bedrooms === "any" || 
                           (bedrooms === "3+" && property.bedrooms >= 3) ||
                           property.bedrooms.toString() === bedrooms;
    
    // Filter by status
    const matchesStatus = propertyStatus === "all" || property.status === propertyStatus;
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesStatus;
  });

  // Get unique property types from data
  const propertyTypes = [...new Set(properties.map(property => property.type))];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Available Properties</h2>
        <Button className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          List Property
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location or property name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className={cn(
            "items-center gap-2",
            showFilters ? "flex flex-wrap" : "hidden md:flex"
          )}>
            <Select 
              value={propertyType} 
              onValueChange={setPropertyType}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={bedrooms} 
              onValueChange={setBedrooms}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Bedrooms</SelectItem>
                <SelectItem value="1">1 Bedroom</SelectItem>
                <SelectItem value="2">2 Bedrooms</SelectItem>
                <SelectItem value="3+">3+ Bedrooms</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={propertyStatus} 
              onValueChange={setPropertyStatus}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="vacant">Vacant</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-4 border rounded-lg bg-background/50 backdrop-blur-sm mb-4">
          <h3 className="font-medium mb-3">Price Range</h3>
          <Slider
            defaultValue={[1000, 6000]}
            min={500}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading properties...</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No properties found</p>
        </div>
      )}
    </div>
  );
}
