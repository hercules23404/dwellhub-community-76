
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Building } from "lucide-react";
import { SocietySetupForm, SocietyFormData } from "@/components/admin/SocietySetupForm";
import { toast } from "sonner";

// Define session storage keys
const SOCIETY_FORM_DATA_KEY = "ava_presignup_society_data";

export default function PreSignupSocietySetupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Try to load any previously saved form data from sessionStorage
  const [initialFormData, setInitialFormData] = useState<Partial<SocietyFormData> | undefined>(() => {
    const savedData = sessionStorage.getItem(SOCIETY_FORM_DATA_KEY);
    return savedData ? JSON.parse(savedData) : undefined;
  });

  const handleSocietyFormSubmit = (formData: SocietyFormData) => {
    setIsLoading(true);
    
    try {
      // Save form data to session storage for retrieval after auth
      sessionStorage.setItem(SOCIETY_FORM_DATA_KEY, JSON.stringify(formData));
      
      // Navigate to the auth page with admin type parameter
      navigate("/auth?type=admin&presignup=true");
    } catch (error) {
      console.error("Error saving society data:", error);
      toast.error("Failed to save society data. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="lg" className="py-10 px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Society Setup</h1>
            <p className="text-muted-foreground">Step 1: Create your society profile</p>
          </div>
        </div>
        
        <SocietySetupForm 
          onSubmit={handleSocietyFormSubmit} 
          isLoading={isLoading} 
          initialData={initialFormData}
          submitButtonText="Continue to Sign Up"
        />
      </Container>
    </div>
  );
}
