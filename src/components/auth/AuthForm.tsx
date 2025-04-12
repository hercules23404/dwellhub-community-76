
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthFormProps {
  userType: string;
}

export function AuthForm({ userType }: AuthFormProps) {
  const [searchParams] = useSearchParams();
  const isPreSignup = searchParams.get("presignup") === "true";
  const [formType, setFormType] = useState<"login" | "signup">(isPreSignup ? "signup" : "login");

  // If this is a pre-signup flow, force signup mode
  useEffect(() => {
    if (isPreSignup) {
      setFormType("signup");
    }
  }, [isPreSignup]);

  if (formType === "login") {
    return <LoginForm onSwitchToSignup={() => setFormType("signup")} userType={userType} />;
  } else {
    return <SignupForm onSwitchToLogin={() => setFormType("login")} userType={userType} isPreSignup={isPreSignup} />;
  }
}
