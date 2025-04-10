
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define schemas for form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  firstName: z.string().min(2, { message: "First name is required." }),
  lastName: z.string().min(2, { message: "Last name is required." }),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  tenantStatus: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthForm() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/home";
  const defaultTab = searchParams.get("tab") || "login";
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab === "register" ? "register" : "login");
  const [step, setStep] = useState(1);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      bio: "",
      tenantStatus: "tenant",
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn({
        email: data.email,
        password: data.password,
      });
      navigate(redirectTo);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration form submission step 1
  const onRegisterStep1Submit = () => {
    // Validate only email and password fields
    const { email, password } = registerForm.getValues();
    const isValid = email && password && 
      email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && 
      password.length >= 6;
    
    if (isValid) {
      setStep(2);
    } else {
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        registerForm.setError("email", { 
          type: "manual", 
          message: "Please enter a valid email address." 
        });
      }
      
      if (!password || password.length < 6) {
        registerForm.setError("password", { 
          type: "manual", 
          message: "Password must be at least 6 characters." 
        });
      }
    }
  };

  // Handle registration form submission step 2
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber || undefined,
        bio: data.bio || undefined,
        tenantStatus: data.tenantStatus || 'tenant'
      });
      // Note: Normally we'd navigate to the home page here, but with Supabase email confirmation
      // we may want to show a "check your email" message instead
      navigate("/auth", { state: { message: "Please check your email to confirm your account." } });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Sign In</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => setActiveTab("register")}
              >
                Register
              </Button>
            </p>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              {step === 1 
                ? "Enter your email and create a password" 
                : "Complete your profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                {step === 1 ? (
                  <>
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      className="w-full" 
                      onClick={onRegisterStep1Submit}
                      disabled={isLoading}
                    >
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="tenantStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>I am a</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tenant">Tenant</SelectItem>
                              <SelectItem value="property_owner">Property Owner</SelectItem>
                              <SelectItem value="property_manager">Property Manager</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio (optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a little about yourself" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-2">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0" 
                onClick={() => setActiveTab("login")}
              >
                Sign In
              </Button>
            </p>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
