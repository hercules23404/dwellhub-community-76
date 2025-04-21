import { useState, useEffect } from "react";
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
import { SocietyFormData } from "@/components/admin/SocietySetupForm";

// Define session storage keys
const SOCIETY_FORM_DATA_KEY = "ava_presignup_society_data";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  userType: string;
  isPreSignup?: boolean;
}

export function SignupForm({ onSwitchToLogin, userType, isPreSignup = false }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Load society data if this is part of the pre-signup flow
  const [societyData, setSocietyData] = useState<SocietyFormData | null>(null);

  useEffect(() => {
    if (isPreSignup) {
      const savedData = sessionStorage.getItem(SOCIETY_FORM_DATA_KEY);
      if (savedData) {
        setSocietyData(JSON.parse(savedData));
      } else {
        // If we're in pre-signup flow but no data is found, redirect back to society setup
        toast.error("Society data not found. Please set up your society first.");
        navigate("/admin/presignup-setup");
      }
    }
  }, [isPreSignup, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For wireframe, just simulate sign up - don't pass arguments to signUp()
      signUp();

      // Just simulate success for the wireframe
      toast.success("Account created successfully!");
      
      // Simply redirect to login page after signup
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold">
          Create {userType === "admin" ? "Admin" : "Tenant"} Account
        </CardTitle>
        <CardDescription>
          {userType === "admin" 
            ? "Create an admin account to manage your society" 
            : "Create a tenant account to access your society"}
        </CardDescription>
      </CardHeader>
      
      {!isPreSignup && (
        <Tabs defaultValue={userType} className="w-full px-6" onValueChange={() => {/* Read-only in signup mode */}}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tenant" className="flex items-center gap-2" disabled={isPreSignup}>
              <User className="h-4 w-4" />
              <span>Tenant</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2" disabled={isPreSignup}>
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 mt-4">
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

          <div className="space-y-2">
            <Label htmlFor="phoneSignup">Phone Number</Label>
            <Input
              id="phoneSignup"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emailSignup">Email</Label>
            <Input
              id="emailSignup"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="passwordSignup">Password</Label>
            <Input
              id="passwordSignup"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isPreSignup ? "Creating Account & Society..." : "Creating Account..."}
              </span>
            ) : (
              <span>{isPreSignup ? "Complete Setup" : "Create Account"}</span>
            )}
          </Button>
          
          {!isPreSignup && (
            <div className="text-center text-sm">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline focus:outline-none"
                  onClick={onSwitchToLogin}
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
