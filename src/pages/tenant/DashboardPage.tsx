
import { useNavigate } from "react-router-dom";

export default function TenantDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-extrabold mb-6 text-purple-800">Welcome, Tenant!</h1>
      <section className="bg-white rounded-lg shadow mb-6 p-5">
        <h2 className="text-xl font-bold mb-2">📢 Society Notices</h2>
        <ul className="space-y-3">
          <li className="border-l-4 border-purple-400 pl-3">
            <strong>Water Maintenance:</strong> Water supply will be off from 10am–2pm on Sat.
            <div className="text-xs text-gray-500 mt-1">Apr 21, 2025</div>
          </li>
          <li className="border-l-4 border-indigo-400 pl-3">
            <strong>Event:</strong> Society Annual Gathering this Sunday 6pm. All are welcome!
            <div className="text-xs text-gray-500 mt-1">Apr 20, 2025</div>
          </li>
        </ul>
      </section>
      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg py-3 px-4 shadow hover:from-purple-600 hover:to-indigo-600 transition"
          onClick={() => navigate("/tenant/requests")}
        >
          🛠️ Submit Service Request
        </button>
        <button
          className="flex-1 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold rounded-lg py-3 px-4 shadow hover:from-indigo-500 hover:to-purple-500 transition"
          onClick={() => navigate("/tenant/lease")}
        >
          📄 View Lease Info
        </button>
      </div>
    </div>
  );
}
