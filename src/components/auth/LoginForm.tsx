
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Shield, User, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  userType: string;
}

export function LoginForm({ onSwitchToSignup, userType }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"tenant" | "admin">(userType as "tenant" | "admin");
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn({ email, password });
      
      // Auth context will handle redirection based on user role
      // Admin -> '/admin/dashboard'
      // Tenant -> '/home'
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid login credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          Sign in as {loginType === "admin" ? "Admin" : "Tenant"}
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <Tabs 
        defaultValue={userType} 
        className="w-full px-6" 
        onValueChange={(value) => setLoginType(value as "tenant" | "admin")}
      >
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
              <button 
                type="button" 
                className="text-sm text-primary hover:underline"
                onClick={() => toast.info("Password reset functionality will be available soon")}
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
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
                <Loader2 className="h-4 w-4 animate-spin" />
                {loginType === "admin" ? "Signing in as admin..." : "Signing in..."}
              </span>
            ) : (
              <span>{loginType === "admin" ? "Sign in as Admin" : "Sign in as Tenant"}</span>
            )}
          </Button>
          
          <div className="text-center text-sm">
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline focus:outline-none"
                onClick={onSwitchToSignup}
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
