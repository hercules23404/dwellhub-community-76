
import TenantServiceRequests from "@/components/tenant/TenantServiceRequests";
// DEV: No login guard, always show
export default function TenantRequestsPage() {
  return (
    <div className="animate-fade-in py-8">
      <TenantServiceRequests />
    </div>
  );
}
