
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2, Home, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Society {
  id: string;
  name: string;
  is_dummy?: boolean;
}

export default function TenantSetupPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [fetchingSocieties, setFetchingSocieties] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    societyId: "",
    flatNumber: "",
    firstName: "",
    lastName: "",
    phone: "",
    bio: ""
  });

  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('society_id, flat_number')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data?.society_id && data?.flat_number) {
          toast.info("Your profile is already set up.");
          navigate("/login");
          return;
        }
        
        if (user.user_metadata) {
          setFormData(prev => ({
            ...prev,
            firstName: user.user_metadata.first_name || "",
            lastName: user.user_metadata.last_name || ""
          }));
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
      
      fetchSocieties();
    };
    
    checkExistingProfile();
  }, [user, navigate]);

  const fetchSocieties = async () => {
    try {
      const { data, error } = await supabase
        .from('societies')
        .select('id, name, is_dummy')
        .order('name');
        
      if (error) throw error;
      
      setSocieties(data || []);
    } catch (error) {
      console.error("Error fetching societies:", error);
      toast.error("Failed to load available societies");
    } finally {
      setFetchingSocieties(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSocietySelect = (value: string) => {
    setFormData({
      ...formData,
      societyId: value
    });
  };

  const handleNextStep = () => {
    if (!formData.societyId) {
      toast.error("Please select a society to continue");
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to complete your profile");
      return;
    }
    
    if (!formData.societyId || !formData.flatNumber || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          bio: formData.bio || null,
          phone_number: formData.phone || null
        }
      });
      
      if (metadataError) throw metadataError;
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          society_id: formData.societyId,
          flat_number: formData.flatNumber,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone || null,
          bio: formData.bio || null
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile has been successfully set up!");
      
      // Sign out the user and redirect to login page after setup
      await signOut();
      navigate("/login");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSocietySelection = () => {
    return (
      <>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-primary">Step 1 of 2</Badge>
            <CardTitle>Select Your Society</CardTitle>
          </div>
          <CardDescription>
            Choose the society where you live from the list below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="society">Society <span className="text-destructive">*</span></Label>
            {fetchingSocieties ? (
              <Skeleton className="h-10 w-full" />
            ) : societies.length > 0 ? (
              <Select 
                value={formData.societyId} 
                onValueChange={handleSocietySelect}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a society" />
                </SelectTrigger>
                <SelectContent>
                  {societies.map((society) => (
                    <SelectItem key={society.id} value={society.id}>
                      {society.name} {society.is_dummy && "(Test)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-4 border rounded-md bg-amber-50 text-amber-800">
                <p>No societies available. Please contact the administrator.</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleNextStep}
            className="w-full" 
            disabled={isLoading || societies.length === 0 || !formData.societyId}
          >
            Continue to Profile Setup
          </Button>
        </CardFooter>
      </>
    );
  };

  const renderProfileSetup = () => {
    return (
      <>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-primary">Step 2 of 2</Badge>
            <CardTitle>Complete Your Profile</CardTitle>
          </div>
          <CardDescription>
            Please provide your personal details and flat information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
              <Input 
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
              <Input 
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="flatNumber">Flat Number <span className="text-destructive">*</span></Label>
            <Input 
              id="flatNumber"
              name="flatNumber"
              placeholder="e.g., A-101"
              value={formData.flatNumber}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between w-full">
          <Button 
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            className="w-full sm:w-auto order-2 sm:order-1"
            disabled={isLoading}
          >
            Back to Society Selection
          </Button>
          <Button 
            type="submit" 
            className="w-full sm:w-auto order-1 sm:order-2" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up profile...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Complete Setup
              </>
            )}
          </Button>
        </CardFooter>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="lg" className="py-10 px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            {currentStep === 1 ? (
              <Home className="h-6 w-6 text-primary" />
            ) : (
              <User className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tenant Profile Setup</h1>
            <p className="text-muted-foreground">
              {currentStep === 1 ? "Select your society" : "Complete your profile"}
            </p>
          </div>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 ? renderSocietySelection() : renderProfileSetup()}
          </form>
        </Card>
      </Container>
    </div>
  );
}
