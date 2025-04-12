
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
      if (!user) {
        // Redirect to auth page if not logged in
        const authPath = `/auth?redirect=${encodeURIComponent(location.pathname)}`;
        navigate(authPath, { replace: true });
      } else if (requireAdmin && !isAdmin) {
        // Unauthorized access attempt - redirect to tenant home
        toast.error("You don't have permission to access this area");
        navigate('/home', { replace: true });
      } else {
        // Skip profile setup checks for auth, setup pages, and root landing page
        if (location.pathname.includes('/auth') || 
            location.pathname.includes('/setup') ||
            location.pathname === '/' ||
            location.pathname === '/login') {
          return;
        }
        
        // Check if user needs to complete profile or society setup
        const checkProfileSetup = async () => {
          try {
            const { supabase } = await import('@/integrations/supabase/client');
            const { data, error } = await supabase
              .from('user_profiles')
              .select('society_id, flat_number')
              .eq('id', user.id)
              .maybeSingle();
            
            if (error || !data?.society_id || !data?.flat_number) {
              // Redirect to appropriate setup page based on role
              navigate(isAdmin ? '/admin/setup' : '/tenant/setup', { replace: true });
              return;
            }
            
            // If everything is set up and user is on a setup page, redirect to home
            if (location.pathname.includes('/setup')) {
              navigate('/login', { replace: true });
            }
            
          } catch (error) {
            console.error("Error checking profile setup:", error);
            navigate(isAdmin ? '/admin/setup' : '/tenant/setup', { replace: true });
          }
        };
        
        checkProfileSetup();
      }
    }
  }, [user, loading, isAdmin, navigate, location.pathname, requireAdmin]);

  if (loading || !user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
