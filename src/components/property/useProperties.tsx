
// Pure dummy/static wireframe: just use fake properties for display.
import { useState, useEffect } from "react";
import { PropertyData, PropertyStatus } from "./PropertyCard";

const DUMMY_PROPERTIES: PropertyData[] = [
  {
    id: "1",
    title: "Sample Apartment",
    description: "A well-lit sample property in Main City",
    price: 1450,
    address: "101 Main St, City",
    bedrooms: 2,
    bathrooms: 1,
    area: 950,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800",
    ],
    type: "apartment",
    listingDate: "Just listed",
    features: ["Parking", "Utilities Included"],
    status: "available" as PropertyStatus,
  },
];

export function useProperties() {
  const [properties, setProperties] = useState<PropertyData[]>([]);

  useEffect(() => { setProperties(DUMMY_PROPERTIES); }, []);

  // No backend API, only return static demo data.
  return {
    properties,
    loading: false,
    fetchProperties: () => setProperties(DUMMY_PROPERTIES),
    addProperty: async () => null,
  };
}
