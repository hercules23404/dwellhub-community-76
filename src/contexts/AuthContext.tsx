import { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
    bio?: string;
    tenantStatus?: string;
    phoneNumber?: string;
  }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only display toast for intentional actions
        if (event === 'SIGNED_IN' && !loading) {
          toast.success("Successfully signed in");
          // Check user role on sign in
          if (session?.user?.id) {
            await checkUserRole(session.user.id);
          }
        } else if (event === 'SIGNED_OUT' && !loading) {
          toast.success("Successfully signed out");
          setIsAdmin(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Check user role on initial load
      if (session?.user?.id) {
        await checkUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to check if user is admin
  const checkUserRole = async (userId: string) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      
      const isUserAdmin = data?.role === 'admin';
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error("Error checking user role:", error);
      setIsAdmin(false);
      return false;
    }
  };

  // Sign up function with expanded profile data
  const signUp = async ({ 
    email, 
    password, 
    firstName, 
    lastName,
    bio,
    tenantStatus,
    phoneNumber
  }: { 
    email: string; 
    password: string;
    firstName: string;
    lastName: string;
    bio?: string;
    tenantStatus?: string;
    phoneNumber?: string;
  }) => {
    try {
      const isAdminSignup = tenantStatus === 'admin';
      
      // First, create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            bio: bio || '',
            tenant_status: tenantStatus || 'tenant',
            phone_number: phoneNumber || ''
          },
        },
      });

      if (error) {
        // Check for duplicate email error
        if (error.message.includes("User already registered") || error.message.includes("already exists")) {
          toast.error("An account with this email already exists. Please log in instead.");
        } else {
          throw error;
        }
        return;
      }
      
      if (!data.user) {
        throw new Error("Failed to create user");
      }
      
      console.log("User signup successful, creating profile...", data.user);

      // Create user profile in the database
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          bio: bio || null,
          phone_number: phoneNumber || null
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }

      // Create user role entry
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: isAdminSignup ? 'admin' : 'tenant'
        });

      if (roleError) {
        console.error("Role assignment error:", roleError);
        throw roleError;
      }

      if (data.session) {
        // If auto sign-in occurred, update our state
        setSession(data.session);
        setUser(data.user);
        
        // For admin signup, ensure the admin role is set
        if (isAdminSignup) {
          await checkUserRole(data.user.id);
        }
      }

    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "An error occurred during sign up");
      throw error;
    }
  };

  // Sign in function - updated to match the Promise<void> return type
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      setSession(data.session);
      setUser(data.user);
      
      // Check if user is admin after login
      if (data.user) {
        await checkUserRole(data.user.id);
      }
      
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
      throw error;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAdmin(false);
      setUser(null);
      setSession(null);
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Password reset link sent to your email");
    } catch (error: any) {
      toast.error(error.message || "Error sending reset link");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
