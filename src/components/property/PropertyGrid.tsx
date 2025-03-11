
import { useState } from "react";
import { PropertyCard, PropertyData } from "./PropertyCard";
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

// Mock data
const mockProperties: PropertyData[] = [
  {
    id: "1",
    title: "Modern Apartment with City View",
    description: "Beautiful modern apartment with stunning city views. Recently renovated with high-end finishes and appliances.",
    price: 2500,
    address: "123 Main St, Apt 4B, New York, NY 10001",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    images: ["/placeholder.svg", "/placeholder.svg"],
    type: "Apartment",
    listingDate: "3 days ago",
    features: ["Parking", "Gym", "Swimming Pool"],
  },
  {
    id: "2",
    title: "Cozy Studio in Downtown",
    description: "Charming studio apartment in the heart of downtown. Perfect for young professionals.",
    price: 1800,
    address: "456 Park Ave, Studio 2C, New York, NY 10022",
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    images: ["/placeholder.svg"],
    type: "Studio",
    listingDate: "1 week ago",
    features: ["Furnished", "Utilities Included"],
  },
  {
    id: "3",
    title: "Spacious Family Condo",
    description: "Spacious 3-bedroom condo in a family-friendly neighborhood. Close to schools, parks, and shopping centers.",
    price: 3200,
    address: "789 Oak Rd, Unit 10D, New York, NY 10023",
    bedrooms: 3,
    bathrooms: 2.5,
    area: 1800,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    type: "Condo",
    listingDate: "2 days ago",
    features: ["Parking", "Balcony", "Storage"],
  },
  {
    id: "4",
    title: "Luxury Penthouse with Terrace",
    description: "Stunning penthouse with a private terrace and panoramic views. High ceilings, premium finishes throughout.",
    price: 5500,
    address: "101 Luxury Lane, PH A, New York, NY 10013",
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2500,
    images: ["/placeholder.svg", "/placeholder.svg"],
    type: "Penthouse",
    listingDate: "5 days ago",
    features: ["Doorman", "Gym", "Roof Deck", "Concierge"],
  },
];

interface PropertyGridProps {
  className?: string;
}

export function PropertyGrid({ className }: PropertyGridProps) {
  const [properties, setProperties] = useState<PropertyData[]>(mockProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([1000, 6000]);
  const [propertyType, setPropertyType] = useState<string>("all");
  const [bedrooms, setBedrooms] = useState<string>("any");
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
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms;
  });

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
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Condo">Condo</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
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

      {filteredProperties.length > 0 ? (
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
