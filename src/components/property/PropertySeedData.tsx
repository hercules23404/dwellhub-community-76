
import { supabase } from "@/integrations/supabase/client";

const propertyData = [
  {
    name: "Sunset Apartments",
    address: "123 Maple Street, Springfield",
    type: "Apartment",
    units: 12,
    rent: "$1200",
    status: "available",
    featured: true,
    bedrooms: 2,
    bathrooms: 1,
    size_sqft: 950,
    description: "Beautiful apartments with a view of the sunset, located in a peaceful neighborhood. Features modern amenities and spacious living areas.",
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800"
  },
  {
    name: "Mountain View Condos",
    address: "456 Oak Avenue, Riverdale",
    type: "Condo",
    units: 8,
    rent: "$1500",
    status: "rented",
    featured: false,
    bedrooms: 2,
    bathrooms: 2,
    size_sqft: 1100,
    description: "Luxurious condos with stunning mountain views. Each unit features high-end finishes, open concept layouts, and private balconies.",
    image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800"
  },
  {
    name: "Garden Villas",
    address: "789 Pine Road, Westfield",
    type: "House",
    units: 6,
    rent: "$2200",
    status: "maintenance",
    featured: true,
    bedrooms: 3,
    bathrooms: 2,
    size_sqft: 1600,
    description: "Spacious villas surrounded by beautiful gardens. Perfect for families, with large yards, modern kitchens, and proximity to schools.",
    image_url: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800"
  },
  {
    name: "City Center Lofts",
    address: "101 Downtown Blvd, Metro City",
    type: "Loft",
    units: 10,
    rent: "$1800",
    status: "available",
    featured: false,
    bedrooms: 1,
    bathrooms: 1,
    size_sqft: 850,
    description: "Modern lofts in the heart of the city. Industrial design with high ceilings, exposed brick, and large windows with city views.",
    image_url: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800"
  },
  {
    name: "Riverside Apartments",
    address: "222 Water Street, Lakeside",
    type: "Apartment",
    units: 15,
    rent: "$1400",
    status: "available",
    featured: true,
    bedrooms: 2,
    bathrooms: 1,
    size_sqft: 980,
    description: "Peaceful apartments with river views. Enjoy waterfront living with walking paths, fishing docks, and beautiful sunsets.",
    image_url: "https://images.unsplash.com/photo-1622015663084-307d19eabca2?auto=format&fit=crop&w=800"
  },
  {
    name: "Heritage Homes",
    address: "333 Historic Lane, Oldtown",
    type: "House",
    units: 4,
    rent: "$2500",
    status: "available",
    featured: false,
    bedrooms: 4,
    bathrooms: 2.5,
    size_sqft: 2200,
    description: "Restored historic homes with modern conveniences. Charming architecture, original details, and updated systems throughout.",
    image_url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800"
  },
  {
    name: "The Urban Studios",
    address: "444 Main Street, Downtown",
    type: "Studio",
    units: 20,
    rent: "$950",
    status: "available",
    featured: true,
    bedrooms: 0,
    bathrooms: 1,
    size_sqft: 550,
    description: "Compact and efficient studios in the bustling downtown area. Perfect for young professionals seeking convenience and city living.",
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800"
  },
  {
    name: "Lakeside Townhomes",
    address: "555 Shore Drive, Lakeside",
    type: "Condo",
    units: 10,
    rent: "$1950",
    status: "rented",
    featured: false,
    bedrooms: 3,
    bathrooms: 2.5,
    size_sqft: 1650,
    description: "Elegant townhomes overlooking the lake. Enjoy water views, community dock access, and high-end fixtures throughout.",
    image_url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800"
  }
];

export async function seedProperties() {
  try {
    // First, check if we already have properties
    const { data: existingProperties, error: checkError } = await supabase
      .from('properties')
      .select('id')
      .limit(1);
    
    if (checkError) throw checkError;
    
    // Only seed if there are no properties
    if (existingProperties && existingProperties.length === 0) {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select();
      
      if (error) throw error;
      
      console.log("Successfully seeded properties:", data);
      return true;
    } else {
      console.log("Properties already exist, skipping seed");
      return false;
    }
  } catch (error) {
    console.error("Error seeding properties:", error);
    return false;
  }
}
