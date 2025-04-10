
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
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only display toast for intentional actions
        if (event === 'SIGNED_IN' && !loading) {
          toast.success("Successfully signed in");
        } else if (event === 'SIGNED_OUT' && !loading) {
          toast.success("Successfully signed out");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      // First, check if a user with this email already exists
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummyPasswordThatWillFail' // This will fail if the email exists or not
      });
      
      // If the response contains a user, it means the email exists (even though the password was wrong)
      if (existingUser?.user) {
        toast.error("An account with this email already exists. Please log in instead.");
        throw new Error("Email already exists");
      }
      
      // If we get here, the email doesn't exist, so proceed with signup
      const { error } = await supabase.auth.signUp({
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
        if (error.message.includes("User already registered")) {
          toast.error("An account with this email already exists. Please log in instead.");
        } else {
          throw error;
        }
      } else {
        toast.success("Registration successful! Please check your email to verify your account.");
      }
    } catch (error: any) {
      if (error.message !== "Email already exists") {
        toast.error(error.message || "An error occurred during sign up");
      }
      throw error;
    }
  };

  // Sign in function
  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
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
