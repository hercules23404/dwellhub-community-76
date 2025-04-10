
import { useState, useEffect } from "react";
import { PropertyData, PropertyStatus } from "./PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useProperties() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
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
          description: property.description || `Property in ${property.address}`,
          price: numericRent,
          address: property.address,
          bedrooms: property.bedrooms || Math.floor(Math.random() * 3) + 1,
          bathrooms: property.bathrooms || Math.floor(Math.random() * 2) + 1,
          area: property.size_sqft || Math.floor(Math.random() * 1000) + 500,
          images: [
            property.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800",
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

  // Add function to create a new property
  const addProperty = async (propertyData: Omit<PropertyData, 'id' | 'listingDate'>) => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add a property");
        return null;
      }
      
      // Format the property data for Supabase
      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: propertyData.title,
          address: propertyData.address,
          type: propertyData.type,
          rent: `$${propertyData.price}`,
          status: propertyData.status || 'available',
          owner_id: user.id,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          size_sqft: propertyData.area,
          description: propertyData.description,
          image_url: propertyData.images[0]
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the properties list
      await fetchProperties();
      
      toast.success("Property added successfully");
      return data;
    } catch (error: any) {
      console.error('Error adding property:', error);
      toast.error(error.message || "Failed to add property");
      return null;
    }
  };

  return {
    properties,
    loading,
    fetchProperties,
    addProperty
  };
}
