
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
        navigate(`/auth?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
      } else if (requireAdmin && !isAdmin) {
        // Redirect to home if admin access is required but user is not admin
        navigate('/home', { replace: true });
      } else {
        // Skip profile setup checks for auth and setup pages
        if (location.pathname.includes('/auth') || 
            location.pathname.includes('/setup') ||
            location.pathname === '/') {
          return;
        }
        
        // Check if the user needs to complete profile setup
        const checkProfileSetup = async () => {
          try {
            const { supabase } = await import('@/integrations/supabase/client');
            const { data, error } = await supabase
              .from('user_profiles')
              .select('society_id, flat_number')
              .eq('id', user.id)
              .maybeSingle();
            
            if (error) {
              console.error("Error checking profile setup:", error);
              // On database errors, redirect to appropriate setup page based on role
              if (isAdmin) {
                navigate('/admin/setup', { replace: true });
              } else {
                navigate('/tenant/setup', { replace: true });
              }
              return;
            }
            
            if (!data) {
              // No profile data - redirect to appropriate setup
              if (isAdmin) {
                navigate('/admin/setup', { replace: true });
              } else {
                navigate('/tenant/setup', { replace: true });
              }
              return;
            }
            
            // For admin users, redirect to admin setup if no society is set
            if (isAdmin && !data?.society_id && !location.pathname.includes('/admin/setup')) {
              navigate('/admin/setup', { replace: true });
              return;
            }
            // For tenant users, redirect to tenant setup if no society is set
            else if (!isAdmin && !data?.society_id && !location.pathname.includes('/tenant/setup')) {
              navigate('/tenant/setup', { replace: true });
              return;
            }
          } catch (error) {
            console.error("Error checking profile setup:", error);
            
            // Fallback - on error, direct to setup pages
            if (isAdmin) {
              navigate('/admin/setup', { replace: true });
            } else {
              navigate('/tenant/setup', { replace: true });
            }
          }
        };
        
        checkProfileSetup();
      }
    }
  }, [user, loading, isAdmin, navigate, location.pathname, requireAdmin]);

  // Show nothing while checking auth state
  if (loading || !user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
