
import { useState } from "react";
import { PropertyCard, PropertyData, PropertyStatus } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { PropertySearchBar } from "./PropertySearchBar";
import { PropertyFilters } from "./PropertyFilters";
import { useProperties } from "./useProperties";

export function PropertyGrid({ className }: { className?: string }) {
  const { properties, loading } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 6000]);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [propertyStatus, setPropertyStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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
        <PropertySearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
        />
        
        <PropertyFilters
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          bedrooms={bedrooms}
          setBedrooms={setBedrooms}
          propertyStatus={propertyStatus}
          setPropertyStatus={setPropertyStatus}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          propertyTypes={propertyTypes}
        />
      </div>
      
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
