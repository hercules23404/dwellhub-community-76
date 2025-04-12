
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function PersonalInfoForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phone: "",
    bio: ""
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch user profile data from Supabase
      const fetchProfileData = async () => {
        try {
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            // Fallback to profiles table if user_profiles doesn't have data
            const { data: oldProfileData, error: oldProfileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
              
            if (oldProfileError) throw oldProfileError;
            
            // Use old profiles data
            setFormData({
              firstName: oldProfileData?.first_name || user?.user_metadata?.first_name || "",
              lastName: oldProfileData?.last_name || user?.user_metadata?.last_name || "",
              displayName: `${oldProfileData?.first_name || user?.user_metadata?.first_name || ""} ${oldProfileData?.last_name || user?.user_metadata?.last_name || ""}`,
              email: user.email || "",
              phone: oldProfileData?.phone_number || user?.user_metadata?.phone_number || "",
              bio: oldProfileData?.bio || user?.user_metadata?.bio || ""
            });
            return;
          }

          setFormData({
            firstName: profileData?.first_name || user?.user_metadata?.first_name || "",
            lastName: profileData?.last_name || user?.user_metadata?.last_name || "",
            displayName: `${profileData?.first_name || user?.user_metadata?.first_name || ""} ${profileData?.last_name || user?.user_metadata?.last_name || ""}`,
            email: user.email || "",
            phone: profileData?.phone_number || user?.user_metadata?.phone_number || "",
            bio: profileData?.bio || user?.user_metadata?.bio || ""
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      fetchProfileData();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    if (id === 'firstName' || id === 'lastName') {
      // Update display name when first or last name changes
      const updatedFirstName = id === 'firstName' ? value : formData.firstName;
      const updatedLastName = id === 'lastName' ? value : formData.lastName;
      
      setFormData({
        ...formData,
        [id]: value,
        displayName: `${updatedFirstName} ${updatedLastName}`.trim()
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update the profile in user_profiles table
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phone,
          bio: formData.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        // Try to update the old profiles table as fallback
        const { error: oldError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phone,
            bio: formData.bio,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (oldError) throw oldError;
      }
      
      // Also update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          bio: formData.bio,
          phone_number: formData.phone
        }
      });
      
      if (metadataError) throw metadataError;
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input 
            id="displayName" 
            value={formData.displayName}
            onChange={handleChange}
          />
          <p className="text-sm text-muted-foreground">
            This is the name that will be visible to other users
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            disabled
            className="bg-muted"
          />
          <p className="text-sm text-muted-foreground">
            Email cannot be changed
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us a bit about yourself"
            value={formData.bio}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
