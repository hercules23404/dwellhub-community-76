
import { supabase } from "@/integrations/supabase/client";
import { SocietyFormData } from "@/components/admin/SocietySetupForm";
import { toast } from "sonner";

// Define session storage keys
export const SOCIETY_FORM_DATA_KEY = "ava_presignup_society_data";

// Save society form data to session storage
export const saveSocietyFormData = (data: SocietyFormData): boolean => {
  try {
    sessionStorage.setItem(SOCIETY_FORM_DATA_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving society data to session storage:", error);
    return false;
  }
};

// Get society form data from session storage
export const getSocietyFormData = (): SocietyFormData | null => {
  try {
    const data = sessionStorage.getItem(SOCIETY_FORM_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting society data from session storage:", error);
    return null;
  }
};

// Clear society form data from session storage
export const clearSocietyFormData = (): void => {
  try {
    sessionStorage.removeItem(SOCIETY_FORM_DATA_KEY);
  } catch (error) {
    console.error("Error clearing society data from session storage:", error);
  }
};

// Create society in Supabase
export const createSocietyForUser = async (
  userId: string,
  societyData: SocietyFormData
): Promise<string | null> => {
  try {
    // Convert utility workers to string array format expected by the database
    const utilityWorkersArray = societyData.utilityWorkers.map(worker => {
      if (worker.contact) {
        return `${worker.name} (${worker.contact})`;
      }
      return worker.name;
    });

    // Create the society in Supabase
    const { data, error } = await supabase
      .from('societies')
      .insert({
        name: societyData.name,
        address: societyData.address,
        amenities: societyData.amenities,
        utility_workers: utilityWorkersArray,
        num_flats: societyData.numFlats,
        created_by: userId
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error("No society data returned after insertion");
    }

    // Store detailed utility worker information if provided
    if (societyData.utilityWorkers.length > 0) {
      // Create utility worker entries in the database
      const workersWithDetails = societyData.utilityWorkers.filter(w => w.contact);
      
      if (workersWithDetails.length > 0) {
        const workerRecords = workersWithDetails.map(worker => ({
          society_id: data[0].id,
          name: worker.name,
          specialty: "General",  // Default value, could be extended in the future
          phone_number: worker.contact
        }));
        
        const { error: workersError } = await supabase
          .from('utility_workers')
          .insert(workerRecords);
          
        if (workersError) {
          console.error("Failed to add utility worker details:", workersError);
          // Non-critical error, don't throw
        }
      }
    }

    // Return the society ID
    return data[0].id;
  } catch (error: any) {
    console.error("Error creating society:", error);
    toast.error(`Failed to create society: ${error.message || "Unknown error"}`);
    return null;
  }
};

// Link society to user profile
export const linkSocietyToUserProfile = async (
  userId: string,
  societyId: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ society_id: societyId })
      .eq('id', userId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error("Error linking society to user profile:", error);
    return false;
  }
};
