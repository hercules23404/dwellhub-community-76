
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { WireframeAuthProvider } from "@/contexts/WireframeAuthContext";
import { AdminLayout } from "@/layouts/AdminLayout";
import { TenantLayout } from "@/layouts/TenantLayout";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "@/pages/Index";

// Import tenant pages
import TenantLoginPage from "@/pages/tenant/LoginPage";
import TenantDashboardPage from "@/pages/tenant/DashboardPage";
import TenantNoticesPage from "@/pages/tenant/NoticesPage";
import TenantRequestsPage from "@/pages/tenant/RequestsPage";
import TenantLeasePage from "@/pages/tenant/LeasePage";

// Import admin pages
import AdminLoginPage from "@/pages/admin/LoginPage";
import AdminSignupPage from "@/pages/admin/SignupPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminSocietyPage from "@/pages/admin/SocietyPage";
import AdminTenantsPage from "@/pages/admin/TenantsPage";
import AdminNoticesPage from "@/pages/admin/AdminNoticesPage";
import AdminRequestsPage from "@/pages/admin/RequestsPage";
import AdminPropertiesPage from "@/pages/admin/AdminPropertiesPage";
import LoginPage from "@/pages/LoginPage";
import { Toaster } from "sonner";

export default function App() {
  return (
    <WireframeAuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Main landing page */}
          <Route path="/" element={<Index />} />
          
          {/* General auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth" element={<LoginPage />} />
          
          {/* Tenant routes */}
          <Route path="/tenant/login" element={<TenantLoginPage />} />
          <Route path="/tenant/dashboard" element={
            <TenantLayout><TenantDashboardPage /></TenantLayout>
          } />
          <Route path="/tenant/notices" element={
            <TenantLayout><TenantNoticesPage /></TenantLayout>
          } />
          <Route path="/tenant/requests" element={
            <TenantLayout><TenantRequestsPage /></TenantLayout>
          } />
          <Route path="/tenant/lease" element={
            <TenantLayout><TenantLeasePage /></TenantLayout>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />
          <Route path="/admin/dashboard" element={
            <AdminProvider>
              <AdminLayout><AdminDashboardPage /></AdminLayout>
            </AdminProvider>
          } />
          <Route path="/admin/society" element={
            <AdminProvider>
              <AdminLayout><AdminSocietyPage /></AdminLayout>
            </AdminProvider>
          } />
          <Route path="/admin/tenants" element={
            <AdminProvider>
              <AdminLayout><AdminTenantsPage /></AdminLayout>
            </AdminProvider>
          } />
          <Route path="/admin/notices" element={
            <AdminProvider>
              <AdminLayout><AdminNoticesPage /></AdminLayout>
            </AdminProvider>
          } />
          <Route path="/admin/requests" element={
            <AdminProvider>
              <AdminLayout><AdminRequestsPage /></AdminLayout>
            </AdminProvider>
          } />
          <Route path="/admin/properties" element={
            <AdminProvider>
              <AdminLayout><AdminPropertiesPage /></AdminLayout>
            </AdminProvider>
          } />
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </WireframeAuthProvider>
  );
}
