
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface LoginFormProps {
  className?: string;
}

const testCredentials = {
  user: {
    email: "testuser@example.com",
    password: "password123",
  },
  admin: {
    email: "admin@example.com",
    password: "admin123",
  }
};

export function LoginForm({ className }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loginType, setLoginType] = useState<"user" | "admin">("user");
  const navigate = useNavigate();
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formType === "login") {
        if (loginType === "admin") {
          // Admin login
          if (email === testCredentials.admin.email && password === testCredentials.admin.password) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success("Admin login successful!");
            login(true);
            navigate("/admin/dashboard");
          } else {
            toast.error("Invalid admin credentials!");
          }
        } else {
          // User login
          if (email === testCredentials.user.email && password === testCredentials.user.password) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success("Successfully logged in!");
            login(false);
            navigate("/home");
          } else {
            toast.error("Invalid credentials. Try the test credentials!");
          }
        }
      } else {
        // Register - just simulate success
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast.success("Account created successfully!");
        setFormType("login");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
          {formType === "login" ? "Sign in to AVA" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {formType === "login" 
            ? "Enter your credentials to access your account" 
            : "Fill in the information to create an account"}
        </CardDescription>
      </CardHeader>
      
      {formType === "login" && (
        <Tabs defaultValue="user" className="w-full px-6" onValueChange={(value) => setLoginType(value as "user" | "admin")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">User</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 mt-4">
          {formType === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
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
                  onClick={(e) => e.preventDefault()}
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
                  : "Creating account..."}
              </span>
            ) : (
              <span>{formType === "login" 
                ? (loginType === "admin" ? "Sign in as Admin" : "Sign in") 
                : "Create account"}</span>
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
                Use demo {loginType === "admin" ? "admin" : "user"} account
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
