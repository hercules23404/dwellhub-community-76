
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const serviceSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  category: z.string({ required_error: "Please select a category" }),
  priority: z.string({ required_error: "Please select a priority" }),
  propertyId: z.string({ required_error: "Please select a property" }),
  unitNumber: z.string().min(1, "Unit number is required"),
  scheduledDate: z.date().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export const categories = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "appliance", label: "Appliance" },
  { value: "structural", label: "Structural" },
  { value: "landscaping", label: "Landscaping" },
  { value: "pest", label: "Pest Control" },
  { value: "cleaning", label: "Cleaning" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

export function useServiceRequest() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<{ value: string; label: string }[]>([
    { value: "prop1", label: "Sunset Apartments" },
    { value: "prop2", label: "Mountain View Condos" },
    { value: "prop3", label: "Garden Villas" },
  ]);
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      unitNumber: "",
    },
  });

  useEffect(() => {
    // Fetch properties from Supabase
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, name');
        
        if (error) throw error;
        
        if (data) {
          const formattedProperties = data.map(property => ({
            value: property.id,
            label: property.name,
          }));
          setProperties(formattedProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    
    fetchProperties();
  }, []);

  const onSubmit = async (values: ServiceFormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a service request");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique service ID
      const serviceId = `SRV-${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase
        .from('services')
        .insert({
          service_id: serviceId,
          title: values.title,
          description: values.description,
          category: values.category,
          priority: values.priority,
          property_id: values.propertyId,
          unit_number: values.unitNumber,
          scheduled_date: values.scheduledDate?.toISOString(),
          status: "pending",
          user_id: user.id,
        });
      
      if (error) throw error;
      
      toast.success("Service request submitted successfully", {
        description: "We'll get back to you shortly",
      });
      
      form.reset();
    } catch (error: any) {
      console.error('Error submitting service request:', error);
      toast.error("Failed to submit service request", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
    properties
  };
}
