
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminOverview } from "@/components/admin/AdminOverview";

export default function AdminDashboardPage() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      toast.error("You don't have access to the admin area");
      navigate("/login");
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    toast.success("Welcome to the admin dashboard", {
      description: "You can manage properties, tenants, services and notices here",
    });
  }, []);

  if (!isAdmin) return null;

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
