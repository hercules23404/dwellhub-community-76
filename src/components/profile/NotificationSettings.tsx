
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function NotificationSettings() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification preferences updated");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Email Notifications</h3>
          
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailRentReminders">Rent Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about upcoming rent payments
                </p>
              </div>
              <Switch id="emailRentReminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailMaintenance">Maintenance Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about maintenance request updates
                </p>
              </div>
              <Switch id="emailMaintenance" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailCommunity">Community Notices</Label>
                <p className="text-sm text-muted-foreground">
                  Receive community announcements and notices
                </p>
              </div>
              <Switch id="emailCommunity" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailMarketing">Marketing & Offers</Label>
                <p className="text-sm text-muted-foreground">
                  Receive special offers and promotions
                </p>
              </div>
              <Switch id="emailMarketing" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">SMS Notifications</h3>
          
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsRentReminders">Rent Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Receive SMS notifications about upcoming rent payments
                </p>
              </div>
              <Switch id="smsRentReminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsMaintenance">Maintenance Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get SMS alerts for maintenance request updates
                </p>
              </div>
              <Switch id="smsMaintenance" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="smsEmergency">Emergency Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get SMS notifications for urgent property information
                </p>
              </div>
              <Switch id="smsEmergency" defaultChecked />
            </div>
          </div>
        </div>
      </div>
      
      <Button type="submit">Save Preferences</Button>
    </form>
  );
}
