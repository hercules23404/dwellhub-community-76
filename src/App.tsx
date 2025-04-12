
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import NoticePage from "./pages/NoticePage";
import PropertyPage from "./pages/PropertyPage";
import ServicePage from "./pages/ServicePage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import MaintenancePage from "./pages/MaintenancePage"; // Add import
import NotFound from "./pages/NotFound";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPropertiesPage from "./pages/admin/AdminPropertiesPage";
import AdminTenantsPage from "./pages/admin/AdminTenantsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminNoticesPage from "./pages/admin/AdminNoticesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSetupPage from "./pages/admin/AdminSetupPage";
import AdminMaintenancePage from "./pages/admin/AdminMaintenancePage"; // Add import
import TenantSetupPage from "./pages/tenant/TenantSetupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              
              {/* Setup Routes */}
              <Route path="/admin/setup" element={
                <RequireAuth>
                  <AdminSetupPage />
                </RequireAuth>
              } />
              <Route path="/tenant/setup" element={
                <RequireAuth>
                  <TenantSetupPage />
                </RequireAuth>
              } />
              
              {/* Protected Routes */}
              <Route path="/home" element={
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              } />
              <Route path="/notices" element={
                <RequireAuth>
                  <NoticePage />
                </RequireAuth>
              } />
              <Route path="/properties" element={
                <RequireAuth>
                  <PropertyPage />
                </RequireAuth>
              } />
              <Route path="/services" element={
                <RequireAuth>
                  <ServicePage />
                </RequireAuth>
              } />
              <Route path="/payments" element={
                <RequireAuth>
                  <PaymentPage />
                </RequireAuth>
              } />
              <Route path="/maintenance" element={
                <RequireAuth>
                  <MaintenancePage />
                </RequireAuth>
              } />
              <Route path="/profile" element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <RequireAuth requireAdmin={true}>
                  <AdminDashboardPage />
                </RequireAuth>
              } />
              <Route path="/admin/properties" element={
                <RequireAuth requireAdmin={true}>
                  <AdminPropertiesPage />
                </RequireAuth>
              } />
              <Route path="/admin/tenants" element={
                <RequireAuth requireAdmin={true}>
                  <AdminTenantsPage />
                </RequireAuth>
              } />
              <Route path="/admin/services" element={
                <RequireAuth requireAdmin={true}>
                  <AdminServicesPage />
                </RequireAuth>
              } />
              <Route path="/admin/notices" element={
                <RequireAuth requireAdmin={true}>
                  <AdminNoticesPage />
                </RequireAuth>
              } />
              <Route path="/admin/maintenance" element={
                <RequireAuth requireAdmin={true}>
                  <AdminMaintenancePage />
                </RequireAuth>
              } />
              <Route path="/admin/users" element={
                <RequireAuth requireAdmin={true}>
                  <AdminUsersPage />
                </RequireAuth>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
