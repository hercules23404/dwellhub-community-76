
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { WireframeAuthProvider } from "@/contexts/WireframeAuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TenantLayout } from "@/layouts/TenantLayout";
import { AdminProvider } from "@/contexts/AdminContext";

// Landing & CTA
function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <h1 className="text-4xl font-extrabold mb-6">AVA Property Management</h1>
      <div className="flex gap-6">
        {/* Fix: use Link for SPA navigation */}
        <Link to="/tenant/login" className="px-8 py-4 bg-primary rounded text-white text-lg hover:scale-105 transition">Login as Tenant</Link>
        <div className="flex flex-col gap-2">
          <Link to="/admin/login" className="px-8 py-4 bg-red-500 rounded text-white text-lg hover:scale-105 transition">Admin Login</Link>
          <Link to="/admin/signup" className="px-8 py-4 bg-red-400 rounded text-white text-lg hover:scale-105 transition">Admin Signup</Link>
        </div>
      </div>
    </div>
  );
}

// Wireframe static app structure with layouts/routes
export default function App() {
  return (
    <WireframeAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<LandingPage />} />
          {/* Tenant Flow */}
          <Route path="/tenant/login" element={<TenantLoginPage />} />
          <Route element={<TenantLayout><TenantDashboardPage /></TenantLayout>} path="/tenant/dashboard" />
          <Route element={<TenantLayout><TenantNoticesPage /></TenantLayout>} path="/tenant/notices" />
          <Route element={<TenantLayout><TenantRequestsPage /></TenantLayout>} path="/tenant/requests" />
          {/* Admin Auth Flow */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
          {/* Admin Dashboard/Pages (all protected by AdminLayout) */}
          <Route element={
            <AdminProvider>
              <AdminLayout><AdminDashboardPage /></AdminLayout>
            </AdminProvider>
          } path="/admin/dashboard" />
          <Route element={
            <AdminProvider>
              <AdminLayout><AdminSocietyPage /></AdminLayout>
            </AdminProvider>
          } path="/admin/society" />
          <Route element={
            <AdminProvider>
              <AdminLayout><AdminTenantsPage /></AdminLayout>
            </AdminProvider>
          } path="/admin/tenants" />
          <Route element={
            <AdminProvider>
              <AdminLayout><AdminNoticesPage /></AdminLayout>
            </AdminProvider>
          } path="/admin/notices" />
          <Route element={
            <AdminProvider>
              <AdminLayout><AdminRequestsPage /></AdminLayout>
            </AdminProvider>
          } path="/admin/requests" />
          {/* Fallback: */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WireframeAuthProvider>
  );
}

// Page components
import TenantLoginPage from "@/pages/tenant/LoginPage";
import TenantDashboardPage from "@/pages/tenant/DashboardPage";
import TenantNoticesPage from "@/pages/tenant/NoticesPage";
import TenantRequestsPage from "@/pages/tenant/RequestsPage";
import AdminLoginPage from "@/pages/admin/LoginPage";
import AdminSignupPage from "@/pages/admin/SignupPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminSocietyPage from "@/pages/admin/SocietyPage";
import AdminTenantsPage from "@/pages/admin/TenantsPage";
import AdminNoticesPage from "@/pages/admin/NoticesPage";
import AdminRequestsPage from "@/pages/admin/RequestsPage";
