
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Sparkles } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function AuthPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get("type") || "tenant";
  const isPreSignup = searchParams.get("presignup") === "true";

  useEffect(() => {
    if (user && !loading) {
      const redirectTo = searchParams.get("redirect");
      
      if (isAdmin || userType === "admin") {
        const checkAdminSociety = async () => {
          try {
            const { supabase } = await import('@/integrations/supabase/client');
            
            const { data: profileData } = await supabase
              .from('user_profiles')
              .select('society_id')
              .eq('id', user.id)
              .maybeSingle();
            
            const { data: societyData } = await supabase
              .from('societies')
              .select('id')
              .eq('created_by', user.id)
              .maybeSingle();
            
            if (!profileData?.society_id && !societyData?.id) {
              navigate("/admin/setup", { replace: true });
            } else {
              navigate(redirectTo || "/admin/dashboard", { replace: true });
            }
          } catch (error) {
            console.error("Error checking admin society:", error);
            navigate("/admin/setup", { replace: true });
          }
        };
        
        checkAdminSociety();
        return;
      }

      const checkTenantProfile = async () => {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          
          const { data } = await supabase
            .from('user_profiles')
            .select('society_id, flat_number')
            .eq('id', user.id)
            .maybeSingle();
          
          if (!data?.society_id || !data?.flat_number) {
            navigate("/tenant/setup", { replace: true });
          } else {
            navigate(redirectTo || "/home", { replace: true });
          }
        } catch (error) {
          console.error("Error checking tenant profile:", error);
          navigate("/tenant/setup", { replace: true });
        }
      };
      
      checkTenantProfile();
    }
  }, [user, loading, isAdmin, navigate, location.search, userType]);

  if (loading) return null;

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-background via-secondary/40 to-background px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <Container maxWidth="md" className="flex flex-col items-center relative z-10">
        <div className="mb-8 text-center space-y-2">
          <div className="flex justify-center mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-lg opacity-70"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl animate-floating relative">
              A
            </div>
            <Sparkles className="absolute top-0 right-0 h-5 w-5 text-primary animate-pulse-subtle" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">AVA</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your community property and service management platform
          </p>
          <Badge variant={userType === "admin" ? "default" : "outline"} className="mb-2">
            {userType === "admin" ? "Admin Sign In" : "Tenant Sign In"}
          </Badge>
          {isPreSignup && userType === "admin" && (
            <Badge variant="secondary" className="ml-2">
              Step 2: Complete Society Setup
            </Badge>
          )}
        </div>
        <div className="w-full max-w-md p-1 gradient-border rounded-xl">
          <AuthForm userType={userType} />
        </div>
      </Container>
    </div>
  );
}
