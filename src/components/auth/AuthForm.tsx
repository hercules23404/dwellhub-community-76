
// Simple static version, toggles between login and signup UI views (no backend)
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthFormProps {
  userType: string;
}

export function AuthForm({ userType }: AuthFormProps) {
  const [formType, setFormType] = useState<"login" | "signup">("login");

  if (formType === "login") {
    return <LoginForm onSwitchToSignup={() => setFormType("signup")} userType={userType} />;
  } else {
    return <SignupForm onSwitchToLogin={() => setFormType("login")} userType={userType} isPreSignup={false} />;
  }
}
