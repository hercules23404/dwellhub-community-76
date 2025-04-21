
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { TenantManagement } from "@/components/admin/TenantManagement";

// DEV: No login guards, always render
export default function AdminTenantsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold">Tenant Management</h1>
            <TenantManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
