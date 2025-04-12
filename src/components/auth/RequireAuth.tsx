
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
        // Get the current user type (admin or tenant) from path
        const isAdminPath = location.pathname.includes('/admin');
        
        // If this is an admin path and we're using the new flow, direct to pre-signup
        if (isAdminPath && location.pathname !== '/admin/setup' && location.pathname !== '/admin/presignup-setup') {
          const authPath = `/auth?type=admin&redirect=${encodeURIComponent(location.pathname)}`;
          navigate(authPath, { replace: true });
        } else {
          // Use regular auth flow
          const authPath = isAdminPath 
            ? `/auth?type=admin&redirect=${encodeURIComponent(location.pathname)}`
            : `/auth?redirect=${encodeURIComponent(location.pathname)}`;
          
          navigate(authPath, { replace: true });
        }
      } else if (requireAdmin && !isAdmin) {
        // Unauthorized access attempt - redirect to tenant home
        toast.error("You don't have permission to access this area");
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
            
            // For admin users, check if they have created a society
            if (isAdmin) {
              const { data: societyData } = await supabase
                .from('societies')
                .select('id')
                .eq('created_by', user.id)
                .maybeSingle();
                
              // If admin has no society linked in profile and hasn't created one, redirect to setup
              if (!data?.society_id && !societyData?.id) {
                navigate('/admin/setup', { replace: true });
                return;
              }
            } 
            // For tenant users, redirect to tenant setup if no society is set
            else if (!data?.society_id) {
              navigate('/tenant/setup', { replace: true });
              return;
            }

            // Ensure tenant users can't access admin routes
            if (!isAdmin && location.pathname.includes('/admin')) {
              toast.error("You don't have permission to access admin areas");
              navigate('/home', { replace: true });
              return;
            }
            
            // Ensure admin users can't access tenant-specific setup
            if (isAdmin && location.pathname.includes('/tenant/setup')) {
              navigate('/admin/setup', { replace: true });
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
  }, [user, loading, isAdmin, navigate, location.pathname, requireAdmin, location.search]);

  // Show nothing while checking auth state
  if (loading || !user || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
