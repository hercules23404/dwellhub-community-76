import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

// Remove all backend Context Providers and any query client
// Just keep simple routing and static page rendering

import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NoticePage from "./pages/NoticePage";
import PropertyPage from "./pages/PropertyPage";
import ServicePage from "./pages/ServicePage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import DocumentsPage from "./pages/DocumentsPage";
import MaintenancePage from "./pages/MaintenancePage";
import NotFound from "./pages/NotFound";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminPropertiesPage from "./pages/admin/AdminPropertiesPage";
import AdminTenantsPage from "./pages/admin/AdminTenantsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminNoticesPage from "./pages/admin/AdminNoticesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSetupPage from "./pages/admin/AdminSetupPage";
import PreSignupSocietySetupPage from "./pages/admin/PreSignupSocietySetupPage";
import AdminMaintenancePage from "./pages/admin/AdminMaintenancePage";
import TenantSetupPage from "./pages/tenant/TenantSetupPage";

// Simulates static "role" for demo UI navigation purposes only.
const userRole = "tenant"; // change to "admin" as needed for static demo
const isLoggedIn = true;   // fake login for navigation wireframe

const App = () => (
  <TooltipProvider>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/admin/presignup-setup" element={<PreSignupSocietySetupPage />} />
        {/* Setup Routes */}
        <Route path="/admin/setup" element={<AdminSetupPage />} />
        <Route path="/tenant/setup" element={<TenantSetupPage />} />
        {/* Tenant Dashboard */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/notices" element={<NoticePage />} />
        <Route path="/properties" element={<PropertyPage />} />
        <Route path="/services" element={<ServicePage />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/properties" element={<AdminPropertiesPage />} />
        <Route path="/admin/tenants" element={<AdminTenantsPage />} />
        <Route path="/admin/services" element={<AdminServicesPage />} />
        <Route path="/admin/notices" element={<AdminNoticesPage />} />
        <Route path="/admin/maintenance" element={<AdminMaintenancePage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
