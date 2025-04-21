
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { WireframeAuthProvider } from "@/contexts/WireframeAuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TenantLayout } from "@/layouts/TenantLayout";
import { AdminProvider } from "@/contexts/AdminContext";
import { Sparkles, Building, Users, Bell, ShieldCheck, Home } from "lucide-react";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-300 via-purple-200 to-indigo-300 px-4">
      <div className="absolute top-[-10%] left-[-20%] w-[40rem] h-[40rem] bg-gradient-to-tr from-purple-500 to-indigo-400 rounded-full blur-3xl opacity-70 animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50rem] h-[50rem] bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-70 animate-float pointer-events-none" />

      <h1 className="text-5xl md:text-6xl font-extrabold mt-24 mb-4 cursor-default bg-gradient-to-b from-purple-700 via-indigo-600 to-purple-900 bg-clip-text text-transparent select-none text-center">
        AVA Property Management
      </h1>
      <p className="text-xl md:text-2xl text-purple-900/80 mb-10 max-w-xl text-center font-medium">
        Empowering societies and tenants to connect, collaborate, and thrive.<br />
        A comprehensive platform for modern property management.
      </p>

      <div className="flex gap-8 z-10 mb-12 flex-col md:flex-row items-center w-full max-w-xl">
        <a
          href="/tenant/login"
          className="w-full px-10 py-5 mb-2 md:mb-0 rounded-lg text-white text-xl font-semibold shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center justify-center"
        >
          Login as Tenant
        </a>
        <a
          href="/admin/login"
          className="w-full px-10 py-5 rounded-lg text-white text-xl font-semibold shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 flex items-center justify-center"
        >
          Login / Signup as Admin
        </a>
      </div>

      <section className="w-full max-w-5xl mb-12 z-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/90 glass shadow-xl rounded-xl px-7 py-9 flex flex-col items-center text-center border border-purple-200 hover-scale transition-all-200">
            <div className="bg-gradient-to-tr from-purple-200 via-indigo-200 to-purple-100 rounded-full p-5 mb-4">
              <Building className="h-8 w-8 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Society Management
            </h3>
            <p className="text-purple-900/80">
              Efficient admin tools to manage buildings, amenities, notices, and maintenance—streamlined for every society.
            </p>
          </div>
          <div className="bg-white/90 glass shadow-xl rounded-xl px-7 py-9 flex flex-col items-center text-center border border-purple-200 hover-scale transition-all-200">
            <div className="bg-gradient-to-tr from-purple-200 via-indigo-200 to-purple-100 rounded-full p-5 mb-4">
              <Users className="h-8 w-8 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Tenant Portal
            </h3>
            <p className="text-purple-900/80">
              Submit requests, view notices, update profiles, and access society news in a simple, modern portal.
            </p>
          </div>
          <div className="bg-white/90 glass shadow-xl rounded-xl px-7 py-9 flex flex-col items-center text-center border border-purple-200 hover-scale transition-all-200">
            <div className="bg-gradient-to-tr from-purple-200 via-pink-200 to-indigo-100 rounded-full p-5 mb-4">
              <Bell className="h-8 w-8 text-purple-700" />
            </div>
            <h3 className="text-xl font-bold text-purple-800 mb-2">
              Announcements & Alerts
            </h3>
            <p className="text-purple-900/80">
              Stay informed with real-time notices, announcements, and important alerts—always in one place.
            </p>
          </div>
        </div>
      </section>

      <div className="mb-10 z-30">
        <div className="bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 rounded-2xl px-8 py-7 shadow-lg flex flex-col items-center border border-purple-100 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-purple-800">
            Ready to join AVA?
          </h2>
          <p className="text-purple-900/80 mb-6 text-center font-medium">
            Unlock seamless property management, happier tenants, and a smarter community—start today.
          </p>
          <div className="flex gap-6">
            <Link
              to="/tenant/login"
              className="px-8 py-3 rounded-lg text-white text-lg font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex items-center"
            >
              <Home className="mr-2 h-5 w-5" />
              Tenant Access
            </Link>
            <Link
              to="/admin/signup"
              className="px-8 py-3 rounded-lg text-white text-lg font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-1 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 flex items-center"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Register Society
            </Link>
          </div>
        </div>
      </div>

      <Sparkles className="absolute bottom-10 right-10 h-8 w-8 text-purple-600 animate-pulse" />
    </div>
  );
}

import TenantLoginPage from "@/pages/tenant/LoginPage";
import TenantDashboardPage from "@/pages/tenant/DashboardPage";
import TenantNoticesPage from "@/pages/tenant/NoticesPage";
import TenantRequestsPage from "@/pages/tenant/RequestsPage";
import TenantLeasePage from "@/pages/tenant/LeasePage";

// Import admin pages
import AdminLoginPage from "@/pages/admin/LoginPage";
import AdminSignupPage from "@/pages/admin/SignupPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminSocietyPage from "@/pages/admin/SocietyPage";
import AdminTenantsPage from "@/pages/admin/TenantsPage";
import AdminNoticesPage from "@/pages/admin/NoticesPage";
import AdminRequestsPage from "@/pages/admin/RequestsPage";

export default function App() {
  return (
    <WireframeAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tenant/login" element={<TenantLoginPage />} />
          <Route element={<TenantLayout><TenantDashboardPage /></TenantLayout>} path="/tenant/dashboard" />
          <Route element={<TenantLayout><TenantNoticesPage /></TenantLayout>} path="/tenant/notices" />
          <Route element={<TenantLayout><TenantRequestsPage /></TenantLayout>} path="/tenant/requests" />
          <Route element={<TenantLayout><TenantLeasePage /></TenantLayout>} path="/tenant/lease" />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WireframeAuthProvider>
  );
}
