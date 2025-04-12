
export type MaintenanceRequestStatus = 'Pending' | 'In Progress' | 'Completed';

export type MaintenanceRequest = {
  id: string;
  society_id: string;
  tenant_id: string;
  assigned_worker_id: string | null;
  issue_type: string;
  description: string;
  status: MaintenanceRequestStatus;
  cost: number | null;
  created_at: string;
  updated_at: string;
  tenant_name?: string; // Joined from profiles
};

export type UtilityWorker = {
  id: string;
  society_id: string;
  name: string;
  specialty: string;
  phone_number: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
};

export type MaintenanceRequestFormValues = {
  issue_type: string;
  description: string;
};

export type MaintenanceRequestUpdateFormValues = {
  status: MaintenanceRequestStatus;
  assigned_worker_id: string | null;
  cost: number | null;
};
