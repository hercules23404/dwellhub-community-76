
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function SupportSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Support request sent successfully", {
      description: "Our team will get back to you within 24 hours.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Need help? Our support team is here to assist you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select defaultValue="general">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="account">Account Issues</SelectItem>
                    <SelectItem value="billing">Billing Questions</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">How do I update my payment method?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to the Payments section and select "Manage Payment Methods"
                </p>
              </div>
              <div>
                <h4 className="font-medium">What if I'm going to be late on rent?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Contact your property manager as soon as possible through the messaging system
                </p>
              </div>
              <div>
                <h4 className="font-medium">How do I request maintenance?</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Navigate to the Services page and click "Create Service Request"
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> support@avaproperties.com
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> (555) 123-4567
              </p>
              <p className="text-sm">
                <span className="font-medium">Hours:</span> Mon-Fri, 9am-5pm PT
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
