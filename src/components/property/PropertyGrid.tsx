
import { useState, useEffect } from "react";
import { PropertyCard, PropertyData, PropertyStatus } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { PropertySearchBar } from "./PropertySearchBar";
import { PropertyFilters } from "./PropertyFilters";
import { useProperties } from "./useProperties";
import { seedProperties } from "./PropertySeedData";

export function PropertyGrid({ className }: { className?: string }) {
  const { properties, loading, fetchProperties } = useProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 6000]);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("any");
  const [propertyStatus, setPropertyStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Seed properties if needed when the component mounts
    seedProperties().then(seeded => {
      if (seeded) {
        // Refetch properties if we seeded
        fetchProperties();
      }
    });
  }, []);

  const filteredProperties = properties.filter((property) => {
    // Filter by search query (case insensitive)
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by price range
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    
    // Filter by property type
    const matchesType = propertyType === "all" || property.type.toLowerCase() === propertyType.toLowerCase();
    
    // Filter by bedrooms
    const matchesBedrooms = 
      bedrooms === "any" || 
      (bedrooms === "3+" && property.bedrooms >= 3) ||
      property.bedrooms.toString() === bedrooms;
    
    // Filter by status - handle different status values
    const matchesStatus = 
      propertyStatus === "all" || 
      (property.status && property.status.toLowerCase() === propertyStatus.toLowerCase()) ||
      // Map available to vacant for compatibility
      (propertyStatus === "vacant" && property.status === "available") ||
      (propertyStatus === "available" && property.status === "vacant") ||
      // Map rented to occupied for compatibility
      (propertyStatus === "occupied" && property.status === "rented") ||
      (propertyStatus === "rented" && property.status === "occupied");
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms && matchesStatus;
  });

  // Get unique property types from data
  const propertyTypes = [...new Set(properties.map(property => property.type))];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Available Properties</h2>
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
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Loading properties...</p>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No properties found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
