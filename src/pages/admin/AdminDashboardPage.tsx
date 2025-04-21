import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { AdminDashboardCards } from "@/components/admin/AdminDashboardCards";
import { AdminRentChart } from "@/components/admin/AdminRentChart";

export default function AdminDashboardPage() {
  // DEV: Show dashboard unconditionally, no guards
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <AdminDashboardCards />
            <AdminRentChart />
          </div>
        </div>
      </div>
    </div>
  );
}
