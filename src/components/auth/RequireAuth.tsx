
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function RequireAuth({ 
  children, 
  requireAdmin = false 
}: { 
  children: JSX.Element, 
  requireAdmin?: boolean 
}) {
  const { user, loading } = useAuth();
  const { isAdmin, login } = useAdmin();
  const location = useLocation();
  const [checkingAdmin, setCheckingAdmin] = useState(requireAdmin);

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access this page");
    }
  }, [user, loading]);

  // Check admin status if needed
  useEffect(() => {
    if (requireAdmin && user && !isAdmin) {
      const checkAdminStatus = async () => {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle();
            
          if (error) throw error;
          
          // If we found an admin role, update the admin context
          if (data) {
            login(true);
          } else if (location.pathname.includes('/admin')) {
            toast.error("You don't have permission to access the admin area");
            setCheckingAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        } finally {
          setCheckingAdmin(false);
        }
      };
      
      checkAdminStatus();
    } else {
      setCheckingAdmin(false);
    }
  }, [user, isAdmin, requireAdmin]);

  if (loading || checkingAdmin) {
    // While checking authentication status, show a loading indicator
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page with a return url
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // If admin access is required but user is not an admin
    return <Navigate to="/home" replace />;
  }

  return children;
}
