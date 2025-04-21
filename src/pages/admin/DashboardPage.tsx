
export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <ul>
        <li>🏢 Society Name: <strong>Sunrise Apartments</strong></li>
        <li>👥 Total Tenants: <strong>12</strong></li>
        <li>📢 Active Notices: <strong>3</strong></li>
        <li>🛠️ Pending Service Requests: <strong>2</strong></li>
      </ul>
      <div className="mt-8 flex gap-4">
        <button className="px-4 py-2 bg-primary rounded text-white">Add Tenant</button>
        <button className="px-4 py-2 bg-primary rounded text-white">Create Notice</button>
      </div>
    </div>
  );
}
