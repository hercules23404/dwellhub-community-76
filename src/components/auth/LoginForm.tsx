import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdmin } from "@/contexts/AdminContext";
import { supabase } from "@/integrations/supabase/client";
import { Shield, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  className?: string;
}

const testCredentials = {
  user: {
    email: "tenant@example.com",
    password: "password123",
  },
  admin: {
    email: "admin@example.com",
    password: "admin123",
  }
};

export function LoginForm({ className }: LoginFormProps) {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "tenant";
  
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginType, setLoginType] = useState<"tenant" | "admin">(defaultType as "tenant" | "admin");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const { login } = useAdmin();
  const { isAdmin: authIsAdmin } = useAuth();

  useEffect(() => {
    // Update login type based on URL parameter when component loads
    const type = searchParams.get("type");
    if (type && (type === "tenant" || type === "admin")) {
      setLoginType(type as "tenant" | "admin");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formType === "login") {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          toast.error(error.message);
          setIsLoading(false);
          return;
        }
        
        // Check user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .maybeSingle();

        if (roleError) {
          console.error("Error checking role:", roleError);
        }
        
        const userRole = roleData?.role || 'tenant';
        
        // If user is trying to access admin but doesn't have admin role
        if (loginType === "admin" && userRole !== "admin") {
          await supabase.auth.signOut();
          toast.error("You don't have admin access");
          setIsLoading(false);
          return;
        }
        
        // Set admin role in context
        if (userRole === "admin") {
          login(true);
          toast.success("Admin login successful!");
          
          // Explicitly redirect admin users to setup page
          navigate("/admin/setup");
        } else {
          login(false);
          toast.success("Login successful!");
          navigate("/home");
        }
      } else {
        // Register - will redirect to society setup or society selection
        if (!firstName || !lastName || !email || !password) {
          toast.error("Please fill in all required fields");
          setIsLoading(false);
          return;
        }
        
        // Check if email already exists
        const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
          email,
          password: 'dummyPasswordThatWillFail'
        });
        
        if (existingUser?.user) {
          toast.error("An account with this email already exists");
          setIsLoading(false);
          return;
        }
        
        // Register with Supabase
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone_number: phone
            }
          }
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("An account with this email already exists");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }
        
        if (data?.user) {
          // Add user role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: loginType
            });
            
          if (roleError) {
            console.error("Error adding role:", roleError);
            toast.error("Failed to set user role");
          }
          
          // Redirect to next setup step based on role
          if (loginType === "admin") {
            toast.success("Account created! Please set up your society details");
            navigate("/admin/setup");
          } else {
            toast.success("Account created! Please complete your profile");
            navigate("/tenant/setup");
          }
        }
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    if (loginType === "admin") {
      setEmail(testCredentials.admin.email);
      setPassword(testCredentials.admin.password);
    } else {
      setEmail(testCredentials.user.email);
      setPassword(testCredentials.user.password);
    }
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          {formType === "login" 
            ? `Sign in as ${loginType === "admin" ? "Admin" : "Tenant"}` 
            : `Create ${loginType === "admin" ? "Admin" : "Tenant"} Account`}
        </CardTitle>
        <CardDescription>
          {formType === "login" 
            ? "Enter your credentials to access your account" 
            : loginType === "admin" 
              ? "Create an admin account to manage your society" 
              : "Create a tenant account to access your society"}
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue={loginType} className="w-full px-6" onValueChange={(value) => setLoginType(value as "tenant" | "admin")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tenant" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Tenant</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 mt-4">
          {formType === "register" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          )}
          {formType === "register" && (
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {formType === "login" && (
                <a 
                  href="#" 
                  className="text-sm text-primary hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info("Password reset functionality will be available soon");
                  }}
                >
                  Forgot password?
                </a>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete={formType === "login" ? "current-password" : "new-password"}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                <span className="h-4 w-4 rounded-full border-2 border-white border-opacity-25 border-t-white animate-spin" />
                {formType === "login" 
                  ? (loginType === "admin" ? "Signing in as admin..." : "Signing in...") 
                  : (loginType === "admin" ? "Creating admin account..." : "Creating tenant account...")}
              </span>
            ) : (
              <span>{formType === "login" 
                ? (loginType === "admin" ? "Sign in as Admin" : "Sign in as Tenant") 
                : (loginType === "admin" ? "Create Admin Account" : "Create Tenant Account")}</span>
            )}
          </Button>
          
          {formType === "login" && (
            <div className="w-full space-y-2">
              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Use demo {loginType === "admin" ? "admin" : "tenant"} account
              </Button>
            </div>
          )}
          
          <div className="text-center text-sm">
            {formType === "login" ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={() => setFormType("register")}
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={() => setFormType("login")}
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
