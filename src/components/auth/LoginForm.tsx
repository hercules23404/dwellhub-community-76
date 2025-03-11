
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

interface LoginFormProps {
  className?: string;
}

const testCredentials = {
  email: "testuser@example.com",
  password: "password123",
};

export function LoginForm({ className }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // For demo purposes, we're just checking against test credentials
      if (formType === "login") {
        if (email === testCredentials.email && password === testCredentials.password) {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          toast.success("Successfully logged in!");
          navigate("/home");
        } else {
          toast.error("Invalid credentials. Try the test credentials!");
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
    setEmail(testCredentials.email);
    setPassword(testCredentials.password);
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          {formType === "login" ? "Sign in to DwellHub" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {formType === "login" 
            ? "Enter your credentials to access your account" 
            : "Fill in the information to create an account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
                {formType === "login" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <span>{formType === "login" ? "Sign in" : "Create account"}</span>
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
                Use demo account
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
