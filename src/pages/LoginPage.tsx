
import { LoginForm } from "@/components/auth/LoginForm";
import { Container } from "@/components/ui/Container";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-background to-secondary/30 px-4">
      <Container maxWidth="md" className="flex flex-col items-center">
        <div className="mb-8 text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">AVA</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your community property and service management platform
          </p>
        </div>
        <LoginForm />
      </Container>
    </div>
  );
}
