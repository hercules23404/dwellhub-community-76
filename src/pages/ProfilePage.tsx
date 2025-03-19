
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Container } from "@/components/ui/Container";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  useEffect(() => {
    toast.success("Profile loaded successfully", {
      description: "You can manage your personal information here",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <Container maxWidth="full" padding="pt-6">
            <div className="space-y-8">
              <ProfileHeader />
              <ProfileSettings />
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
