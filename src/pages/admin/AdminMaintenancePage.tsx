
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MaintenanceRequestManagement } from "@/components/admin/MaintenanceRequestManagement";
import { WorkerManagement } from "@/components/admin/WorkerManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminMaintenancePage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Mock society ID - in a real app, this would come from admin's profile
  const societyId = "123e4567-e89b-12d3-a456-426614174000";

  useEffect(() => {
    if (!isAdmin) {
      toast.error("You don't have access to the admin area");
      navigate("/login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">Maintenance Management</h1>
            
            <Tabs defaultValue="requests" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
                <TabsTrigger value="workers">Utility Workers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requests">
                <MaintenanceRequestManagement />
              </TabsContent>
              
              <TabsContent value="workers">
                <WorkerManagement societyId={societyId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
