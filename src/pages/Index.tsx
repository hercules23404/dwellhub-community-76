
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, ShieldCheck } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-background/90">
      <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <h1 className="text-xl md:text-2xl font-bold">Society Management</h1>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl w-full text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Welcome to Society Management
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Simplifying community living and property management
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div className="flex flex-col items-center p-8 rounded-xl border bg-card text-card-foreground shadow-lg transition-all hover:shadow-xl">
            <Building className="h-20 w-20 mb-6 text-primary" />
            <h2 className="text-2xl font-bold mb-4">I'm a Tenant</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Access your society information, raise service requests, view notices and more
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link to="/auth?type=tenant">Tenant Login</Link>
            </Button>
          </div>
          
          <div className="flex flex-col items-center p-8 rounded-xl border bg-card text-card-foreground shadow-lg transition-all hover:shadow-xl">
            <ShieldCheck className="h-20 w-20 mb-6 text-primary" />
            <h2 className="text-2xl font-bold mb-4">I'm an Admin</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Manage your society, monitor service requests, create notices and oversee properties
            </p>
            <Button size="lg" className="w-full" asChild>
              <Link to="/auth?type=admin">Admin Login</Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-4 md:px-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            © 2025 Society Management. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
