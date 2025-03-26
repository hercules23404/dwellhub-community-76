
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import Index from "./pages/Index";
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
    <AdminProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/notices" element={<NoticePage />} />
            <Route path="/properties" element={<PropertyPage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/properties" element={<AdminPropertiesPage />} />
            <Route path="/admin/tenants" element={<AdminTenantsPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/notices" element={<AdminNoticesPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
