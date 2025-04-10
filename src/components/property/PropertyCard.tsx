
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart,
  MessageSquare,
  Home,
  User,
  Construction
} from "lucide-react";

export type PropertyStatus = "vacant" | "occupied" | "maintenance" | "available" | "rented";

export interface PropertyData {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  type: string;
  listingDate: string;
  features: string[];
  status?: PropertyStatus;
}

interface PropertyCardProps {
  property: PropertyData;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle image navigation
  const goToNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Get status badge color and icon
  const getStatusBadge = () => {
    if (!property.status) return null;
    
    let icon = null;
    let color = "";
    let label = property.status.charAt(0).toUpperCase() + property.status.slice(1);
    
    switch (property.status) {
      case "vacant":
      case "available":
        icon = <Home className="h-3 w-3 mr-1 flex-shrink-0" />;
        color = "bg-emerald-500 hover:bg-emerald-500";
        break;
      case "occupied":
      case "rented":
        icon = <User className="h-3 w-3 mr-1 flex-shrink-0" />;
        color = "bg-blue-500 hover:bg-blue-500";
        break;
      case "maintenance":
        icon = <Construction className="h-3 w-3 mr-1 flex-shrink-0" />;
        color = "bg-amber-500 hover:bg-amber-500";
        break;
    }
    
    return (
      <Badge
        className={`absolute left-2 bottom-2 ${color} text-white flex items-center`}
      >
        {icon}{label}
      </Badge>
    );
  };

  return (
    <Card className={cn("overflow-hidden hover-scale transition-transform hover:shadow-md", className)}>
      <CardHeader className="p-0">
        <div className="relative">
          <AspectRatio ratio={4/3}>
            <img
              src={property.images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="object-cover w-full h-full rounded-t-lg"
            />
          </AspectRatio>
          
          {/* Navigation buttons */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1.5 text-white transition-colors"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1.5 text-white transition-colors"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}
          
          {/* Image pagination */}
          {property.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    index === currentImageIndex
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/60"
                  )}
                />
              ))}
            </div>
          )}
          
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute right-2 top-2 bg-black/30 hover:bg-black/50 rounded-full p-1.5 text-white transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn(
              "h-4 w-4 flex-shrink-0",
              isFavorite && "fill-white"
            )} />
          </button>
          
          {/* Property type badge */}
          <Badge
            className="absolute left-2 top-2 bg-black/60 hover:bg-black/60"
          >
            {property.type}
          </Badge>
          
          {/* Property status badge */}
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1 overflow-hidden">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">{property.address}</span>
            </div>
          </div>
          <div className="text-right ml-2 flex-shrink-0">
            <div className="text-lg font-bold">${property.price.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">per month</div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-1 sm:gap-2">
          <div className="flex flex-col items-center sm:flex-row sm:items-center text-xs sm:text-sm">
            <Bed className="h-4 w-4 mb-1 sm:mb-0 sm:mr-1 text-muted-foreground flex-shrink-0" />
            <span className="text-center sm:text-left">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:items-center text-xs sm:text-sm">
            <Bath className="h-4 w-4 mb-1 sm:mb-0 sm:mr-1 text-muted-foreground flex-shrink-0" />
            <span className="text-center sm:text-left">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:items-center text-xs sm:text-sm">
            <Square className="h-4 w-4 mb-1 sm:mb-0 sm:mr-1 text-muted-foreground flex-shrink-0" />
            <span className="text-center sm:text-left">{property.area} ft²</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <div className="flex items-center text-sm text-muted-foreground">
          <div>{property.listingDate}</div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 px-3"
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1 flex-shrink-0" /> Contact
          </Button>
          <Button 
            size="sm" 
            className="text-xs h-8 px-3"
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
