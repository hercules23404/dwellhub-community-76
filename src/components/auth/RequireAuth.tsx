
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      // If no user is logged in, redirect to auth page
      if (!user) {
        const authPath = `/auth?redirect=${encodeURIComponent(location.pathname)}`;
        navigate(authPath, { replace: true });
        return;
      }

      // If admin access is required but user is not admin
      if (requireAdmin && !isAdmin) {
        toast.error("You don't have permission to access this area");
        navigate('/home', { replace: true });
        return;
      }

      // Skip profile setup checks for certain pages
      if (location.pathname.includes('/auth') || 
          location.pathname.includes('/setup') ||
          location.pathname === '/' ||
          location.pathname === '/login') {
        return;
      }
      
      // Check if user needs to complete profile or society setup
      const checkProfileSetup = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('society_id, flat_number')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error("Error checking profile:", error);
            throw error;
          }
          
          // If profile data is missing, redirect to setup
          if (!data || !data.society_id || !data.flat_number) {
            // Redirect to appropriate setup page based on role
            const setupPath = isAdmin ? '/admin/setup' : '/tenant/setup';
            console.log(`Profile incomplete, redirecting to ${setupPath}`);
            navigate(setupPath, { replace: true });
            return;
          }
          
          // If user is on a setup page but already has a complete profile, redirect to dashboard
          if (location.pathname.includes('/setup')) {
            const dashboardPath = isAdmin ? '/admin/dashboard' : '/home';
            console.log(`Profile complete, redirecting from setup to ${dashboardPath}`);
            navigate(dashboardPath, { replace: true });
          }
          
          // If user is an admin and trying to access tenant routes, redirect to admin dashboard
          if (isAdmin && !location.pathname.includes('/admin') && !location.pathname.includes('/setup')) {
            navigate('/admin/dashboard', { replace: true });
          }
          
          // If user is a tenant and trying to access admin routes, redirect to home
          if (!isAdmin && location.pathname.includes('/admin')) {
            toast.error("You don't have permission to access admin pages");
            navigate('/home', { replace: true });
          }
          
        } catch (error) {
          console.error("Error checking profile setup:", error);
          const setupPath = isAdmin ? '/admin/setup' : '/tenant/setup';
          navigate(setupPath, { replace: true });
        }
      };
      
      checkProfileSetup();
    }
  }, [user, loading, isAdmin, navigate, location.pathname, requireAdmin]);

  // Don't render children while loading or if authentication requirements aren't met
  if (loading || !user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
