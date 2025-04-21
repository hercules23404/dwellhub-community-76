import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Home, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TenantLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login success
    setTimeout(() => {
      setIsLoading(false);
      navigate("/tenant/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-secondary/10 p-3 rounded-full">
            <Home className="h-8 w-8 text-secondary" />
          </div>
        </div>
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Tenant Login</CardTitle>
            <CardDescription className="text-center">
              Access your resident portal
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs"
                    type="button"
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
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
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
              <div className="text-center text-sm">
                <p>
                  Don't have an account?{" "}
                  <Link to="/auth?type=tenant" className="text-secondary hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => navigate('/tenant/dashboard')}
              >
                Quick Demo Access
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
