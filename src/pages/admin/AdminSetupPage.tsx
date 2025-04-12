
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminSetupPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [existingSociety, setExistingSociety] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    amenities: "",
    utilityWorkers: "",
    numFlats: 0
  });

  // Check if admin has already created a society
  useEffect(() => {
    const checkExistingSociety = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('societies')
          .select('*')
          .eq('created_by', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setExistingSociety(data);
          toast.info("You've already created a society. You can manage it from your dashboard.");
          navigate("/admin/dashboard");
        }
      } catch (error: any) {
        console.error("Error checking existing society:", error);
      }
    };
    
    checkExistingSociety();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === "numFlats" ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to set up a society");
      return;
    }
    
    if (!formData.name || !formData.address || formData.numFlats <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Parse amenities and utility workers into arrays
      const amenitiesArray = formData.amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
        
      const workersArray = formData.utilityWorkers
        .split(',')
        .map(item => item.trim())
        .filter(item => item);
      
      // Insert society data
      const { data, error } = await supabase
        .from('societies')
        .insert({
          name: formData.name,
          address: formData.address,
          amenities: amenitiesArray,
          utility_workers: workersArray,
          num_flats: formData.numFlats,
          created_by: user.id
        })
        .select();
      
      if (error) throw error;
      
      // Update user profile with society
      if (data && data.length > 0) {
        const societyId = data[0].id;
        
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            society_id: societyId
          })
          .eq('id', user.id);
        
        if (profileError) {
          console.error("Error updating profile:", profileError);
          toast.error("Failed to update your profile with society information");
        }
      }
      
      toast.success("Society has been successfully set up!");
      navigate("/admin/dashboard");
      
    } catch (error: any) {
      toast.error(error.message || "Failed to create society");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // If already redirecting to dashboard due to existing society, don't render the form
  if (existingSociety) return null;

  return (
    <div className="min-h-screen bg-background">
      <Container maxWidth="lg" className="py-10 px-4">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Society Setup</h1>
            <p className="text-muted-foreground">Create your society profile</p>
          </div>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-primary">Admin</Badge>
                <CardTitle>Create Your Society</CardTitle>
              </div>
              <CardDescription>
                Fill in the details below to set up your society in the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Society Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="Enter society name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                <Textarea 
                  id="address"
                  name="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                <Input 
                  id="amenities"
                  name="amenities"
                  placeholder="Swimming Pool, Gym, Garden, etc."
                  value={formData.amenities}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">List amenities separated by commas</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="utilityWorkers">Utility Workers (comma separated)</Label>
                <Input 
                  id="utilityWorkers"
                  name="utilityWorkers"
                  placeholder="Plumber, Electrician, Gardener, etc."
                  value={formData.utilityWorkers}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">List available utility workers separated by commas</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numFlats">Number of Flats <span className="text-destructive">*</span></Label>
                <Input 
                  id="numFlats"
                  name="numFlats"
                  type="number"
                  min="1"
                  placeholder="Enter number of flats"
                  value={formData.numFlats || ""}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up society...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Create Society
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
