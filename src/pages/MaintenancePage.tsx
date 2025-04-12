
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Container } from "@/components/ui/Container";
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { MaintenanceRequestList } from "@/components/maintenance/MaintenanceRequestList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MaintenancePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Mock society ID - in a real app, this would come from user's profile
  const societyId = "123e4567-e89b-12d3-a456-426614174000";
  
  const handleRequestSuccess = () => {
    // Increment trigger to refresh the list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <div className="pt-20 pb-16 px-4 lg:pr-72 lg:pl-8 max-w-screen-2xl mx-auto">
        <Container maxWidth="full" padding="pt-6">
          <h1 className="text-3xl font-bold mb-6">Maintenance Requests</h1>
          
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="new">New Request</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <MaintenanceRequestList refreshTrigger={refreshTrigger} />
            </TabsContent>
            
            <TabsContent value="new">
              <div className="max-w-2xl mx-auto">
                <MaintenanceRequestForm 
                  societyId={societyId} 
                  onSuccess={handleRequestSuccess} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
    </div>
  );
}
