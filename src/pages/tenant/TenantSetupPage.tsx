
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
import { Check, Loader2, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

interface Society {
  id: string;
  name: string;
}

export default function TenantSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [societies, setSocieties] = useState<Society[]>([]);
  const [fetchingSocieties, setFetchingSocieties] = useState(true);
  
  const [formData, setFormData] = useState({
    societyId: "",
    flatNumber: "",
    phone: ""
  });

  useEffect(() => {
    // First check if tenant already has a society assigned
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
          // User already has completed setup
          toast.info("Your profile is already set up.");
          navigate("/home");
          return;
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
      
      // Fetch societies for selection
      fetchSocieties();
    };
    
    checkExistingProfile();
  }, [user, navigate]);

  // Fetch available societies
  const fetchSocieties = async () => {
    try {
      const { data, error } = await supabase
        .from('societies')
        .select('id, name')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to complete your profile");
      return;
    }
    
    if (!formData.societyId || !formData.flatNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update user profile
      const { error } = await supabase
        .from('user_profiles')
        .update({
          society_id: formData.societyId,
          flat_number: formData.flatNumber,
          phone_number: formData.phone || null
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success("Profile has been successfully set up!");
      navigate("/home");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="lg" className="py-10 px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Complete Your Profile</h1>
            <p className="text-muted-foreground">Select your society and flat number</p>
          </div>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary">Tenant</Badge>
                <CardTitle>Select Your Society</CardTitle>
              </div>
              <CardDescription>
                Choose the society where you live and provide your flat number
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
                          {society.name}
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
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || societies.length === 0 || !formData.societyId}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing profile...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Complete Setup
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Container>
    </div>
  );
}
