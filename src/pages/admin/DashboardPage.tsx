import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminOverview } from "@/components/admin/AdminOverview";

export default function AdminDashboardPage() {
  // For this step, just show the hardcoded society name
  const societyName = "Malabar Heights"; // hardcoded for now
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // First check if user is logged in
    if (!user) {
      toast.error("You must be logged in to access the admin area");
      navigate("/auth?redirect=/admin/dashboard");
      return;
    }
    
    // Then check if user is admin
    if (!isAdmin) {
      toast.error("You don't have access to the admin area");
      navigate("/home");
      return;
    }

    // Welcome toast for admins
    toast.success("Welcome to the admin dashboard", {
      description: "You can manage properties, tenants, services and notices here",
    });
  }, [user, isAdmin, navigate]);

  // Don't render anything if not authorized
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <AdminOverview />
          </div>
        </div>
      </div>
    </div>
  );
}
