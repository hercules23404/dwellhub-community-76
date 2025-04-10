
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPropertiesPage from "./pages/admin/AdminPropertiesPage";
import AdminTenantsPage from "./pages/admin/AdminTenantsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminNoticesPage from "./pages/admin/AdminNoticesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              
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
              <Route path="/profile" element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <RequireAuth>
                  <AdminDashboardPage />
                </RequireAuth>
              } />
              <Route path="/admin/properties" element={
                <RequireAuth>
                  <AdminPropertiesPage />
                </RequireAuth>
              } />
              <Route path="/admin/tenants" element={
                <RequireAuth>
                  <AdminTenantsPage />
                </RequireAuth>
              } />
              <Route path="/admin/services" element={
                <RequireAuth>
                  <AdminServicesPage />
                </RequireAuth>
              } />
              <Route path="/admin/notices" element={
                <RequireAuth>
                  <AdminNoticesPage />
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
