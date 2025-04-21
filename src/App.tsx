
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { WireframeAuthProvider } from "@/contexts/WireframeAuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TenantLayout } from "@/layouts/TenantLayout";
import { AdminProvider } from "@/contexts/AdminContext";
import { Sparkles } from "lucide-react";

// Landing & CTA
function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-300 via-purple-200 to-indigo-300 px-6">
      {/* Background blur circles */}
      <div className="absolute top-[-10%] left-[-20%] w-[40rem] h-[40rem] bg-gradient-to-tr from-purple-500 to-indigo-400 rounded-full blur-3xl opacity-70 animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50rem] h-[50rem] bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-70 animate-float pointer-events-none" />

      <h1 className="text-5xl md:text-6xl font-extrabold mb-8 cursor-default bg-gradient-to-b from-purple-700 via-indigo-600 to-purple-900 bg-clip-text text-transparent select-none">
        AVA Property Management
      </h1>

      <div className="flex gap-10 z-10">
        {/* Tenant Login */}
        <Link
          to="/tenant/login"
          className="px-10 py-5 rounded-lg text-white text-xl font-semibold shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Login as Tenant
        </Link>

        {/* Admin Login & Signup */}
        <div className="flex flex-col gap-4">
          <Link
            to="/admin/login"
            className="px-10 py-4 rounded-lg text-white text-lg font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
          >
            Admin Login
          </Link>
          <Link
            to="/admin/signup"
            className="px-10 py-4 rounded-lg text-white text-lg font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600"
          >
            Admin Signup
          </Link>
        </div>
      </div>

      {/* Sparkles icon near bottom right */}
      <Sparkles className="absolute bottom-10 right-10 h-8 w-8 text-purple-600 animate-pulse" />
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

