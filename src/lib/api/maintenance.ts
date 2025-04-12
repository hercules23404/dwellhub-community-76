
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceRequest, MaintenanceRequestStatus, UtilityWorker } from "@/types/maintenance";

// Create a new maintenance request
export const createMaintenanceRequest = async ({
  society_id,
  issue_type,
  description,
}: {
  society_id: string;
  issue_type: string;
  description: string;
}) => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("maintenance_requests")
    .insert({
      society_id,
      tenant_id: user.user.id,
      issue_type,
      description,
      status: "Pending" as MaintenanceRequestStatus,
    })
    .select()
    .single();

  if (error) throw error;
  return data as MaintenanceRequest;
};

// Get maintenance requests for the current user
export const getUserMaintenanceRequests = async () => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(`
      *,
      profiles:tenant_id (first_name, last_name)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Format the data to include tenant name
  return (data || []).map(request => ({
    ...request,
    tenant_name: request.profiles ? 
      `${request.profiles.first_name} ${request.profiles.last_name}` : 
      'Unknown User'
  })) as MaintenanceRequest[];
};

// Get all workers
export const getUtilityWorkers = async (society_id: string) => {
  const { data, error } = await supabase
    .from("utility_workers")
    .select("*")
    .eq("society_id", society_id)
    .order("name", { ascending: true });

  if (error) throw error;
  return data as UtilityWorker[];
};

// Update a maintenance request (admin only)
export const updateMaintenanceRequest = async (
  requestId: string,
  updates: {
    status?: MaintenanceRequestStatus;
    assigned_worker_id?: string | null;
    cost?: number | null;
  }
) => {
  const { data, error } = await supabase
    .from("maintenance_requests")
    .update(updates)
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data as MaintenanceRequest;
};

// Add a new utility worker (admin only)
export const addUtilityWorker = async (worker: Omit<UtilityWorker, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from("utility_workers")
    .insert(worker)
    .select()
    .single();

  if (error) throw error;
  return data as UtilityWorker;
};

// Get maintenance request by ID
export const getMaintenanceRequestById = async (id: string) => {
  const { data, error } = await supabase
    .from("maintenance_requests")
    .select(`
      *,
      profiles:tenant_id (first_name, last_name)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  
  return {
    ...data,
    tenant_name: data.profiles ? 
      `${data.profiles.first_name} ${data.profiles.last_name}` : 
      'Unknown User'
  } as MaintenanceRequest;
};
