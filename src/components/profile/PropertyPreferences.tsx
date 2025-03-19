
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function PropertyPreferences() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Property preferences updated successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Current Property</h3>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-primary/10 rounded-md flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">A</span>
                </div>
                <div>
                  <h4 className="font-medium">Apartment 302, Maple Heights</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Main Street, Anytown, CA 12345
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Access Preferences</h3>
          
          <div className="space-y-2">
            <Label>Property Entry Notification</Label>
            <RadioGroup defaultValue="48hours">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="48hours" id="48hours" />
                <Label htmlFor="48hours" className="font-normal">48 hours notice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24hours" id="24hours" />
                <Label htmlFor="24hours" className="font-normal">24 hours notice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sameday" id="sameday" />
                <Label htmlFor="sameday" className="font-normal">Same day is fine (emergencies only)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Amenities</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="pool" defaultChecked />
              <Label htmlFor="pool" className="font-normal">Pool access</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="gym" defaultChecked />
              <Label htmlFor="gym" className="font-normal">Gym access</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="garage" defaultChecked />
              <Label htmlFor="garage" className="font-normal">Garage parking</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="guest" />
              <Label htmlFor="guest" className="font-normal">Guest suite access</Label>
            </div>
          </div>
        </div>
      </div>
      
      <Button type="submit">Save Preferences</Button>
    </form>
  );
}
