
import TenantServiceRequests from "@/components/tenant/TenantServiceRequests";

// Remove any login guard—now always accessible
export default function TenantRequestsPage() {
  return (
    <div className="animate-fade-in py-8">
      <TenantServiceRequests />
    </div>
  );
}
