
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function SecurityForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Security settings updated successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" />
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth">Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch id="twoFactorAuth" />
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <h3 className="font-medium mb-4">Login Sessions</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="rememberSessions">Remember login sessions</Label>
              <p className="text-sm text-muted-foreground">
                Stay logged in on this device for 30 days
              </p>
            </div>
            <Switch id="rememberSessions" defaultChecked />
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => toast.info("All other sessions have been logged out")}
            type="button"
          >
            Log out from all other devices
          </Button>
        </div>
      </div>
      
      <Button type="submit">Update Security Settings</Button>
    </form>
  );
}
