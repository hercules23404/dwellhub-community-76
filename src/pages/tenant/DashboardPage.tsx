
import { NoticeList } from "@/components/notice/NoticeList";

export default function TenantDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tenant Dashboard</h1>
      <ul>
        <li>📢 <a href="/tenant/notices" className="text-blue-600 underline">Notices Board</a></li>
        <li>🛠️ <a href="/tenant/requests" className="text-blue-600 underline">Service Requests</a></li>
        <li>👤 <span>Profile Section (Coming soon)</span></li>
        <li>🏢 <span>Society Overview (read-only)</span></li>
      </ul>
      {/* Only add the NoticeList if not already present */}
      <div className="mt-8">
        <NoticeList />
      </div>
    </div>
  );
}
