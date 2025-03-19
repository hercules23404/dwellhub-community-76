
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { SecurityForm } from "./SecurityForm";
import { NotificationSettings } from "./NotificationSettings";
import { PropertyPreferences } from "./PropertyPreferences";
import { SupportSection } from "./SupportSection";
import { User, Shield, Bell, Building, HelpCircle } from "lucide-react";

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden md:inline">Properties</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden md:inline">Support</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <PersonalInfoForm />
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <SecurityForm />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="properties" className="mt-6">
            <PropertyPreferences />
          </TabsContent>
          
          <TabsContent value="support" className="mt-6">
            <SupportSection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
