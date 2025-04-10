
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold">AVA Property Management</h1>
        </div>
        
        <div>
          {user ? (
            <Button asChild>
              <Link to="/home">Dashboard</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center p-4 md:p-8 space-y-12">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Modern Property Management
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Effortlessly manage properties, tenants, and services all in one place
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
          <div className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow">
            <h2 className="text-xl font-bold mb-2">For Tenants</h2>
            <p className="text-muted-foreground mb-6">
              Easily submit maintenance requests, pay rent, and communicate with management.
            </p>
            <Button asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
          
          <div className="flex flex-col items-center p-6 rounded-lg border bg-card text-card-foreground shadow">
            <h2 className="text-xl font-bold mb-2">For Property Managers</h2>
            <p className="text-muted-foreground mb-6">
              Streamline operations, track maintenance, and manage tenant communications.
            </p>
            <Button asChild>
              <Link to="/auth?type=manager">Sign Up</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-4 md:px-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 AVA Property Management. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
