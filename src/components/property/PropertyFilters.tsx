
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PropertyFiltersProps {
  propertyType: string;
  setPropertyType: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  propertyStatus: string;
  setPropertyStatus: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  propertyTypes: string[];
}

export function PropertyFilters({
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  propertyStatus,
  setPropertyStatus,
  showFilters,
  setShowFilters,
  priceRange,
  setPriceRange,
  propertyTypes
}: PropertyFiltersProps) {
  return (
    <>
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
    </>
  );
}
