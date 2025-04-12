
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Container } from "@/components/ui/Container";
import { SocietySetupForm } from "@/components/admin/SocietySetupForm";
import { toast } from "sonner";
import { Building } from "lucide-react";

export default function AdminSetupPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSetupComplete = async () => {
    toast.success("Society setup complete!");
    
    // Sign out the user and redirect to login page after setup
    await signOut();
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="lg" className="py-10 px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Society Setup</h1>
            <p className="text-muted-foreground">
              Set up your society details
            </p>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <SocietySetupForm onSubmit={handleSetupComplete} />
        </div>
      </Container>
    </div>
  );
}
