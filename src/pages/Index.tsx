
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";
import { Building, Bell, Wrench, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl"></div>
        </div>
        
        <Container className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                A
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-primary">AVA</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Simplify your property and community management with our elegant, intuitive platform
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate("/login")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <Container className="px-4 md:px-8">
          <div className="text-center mb-16 space-y-3 animate-fade-up">
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the key features that make AVA the perfect solution for property and community management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative flex flex-col items-center text-center p-8 rounded-xl border bg-background/80 backdrop-blur-sm hover-scale">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Property Management</h3>
                <p className="text-muted-foreground">
                  Browse, list, and manage properties with our intuitive interface. 
                  Filter by various criteria to find your perfect match.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative flex flex-col items-center text-center p-8 rounded-xl border bg-background/80 backdrop-blur-sm hover-scale">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Notices</h3>
                <p className="text-muted-foreground">
                  Stay updated with community announcements, events, and important information 
                  through our notice board system.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative flex flex-col items-center text-center p-8 rounded-xl border bg-background/80 backdrop-blur-sm hover-scale">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
                  <Wrench className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Service Requests</h3>
                <p className="text-muted-foreground">
                  Easily request maintenance services, schedule appointments, and track 
                  the status of your service requests.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="animate-fade-up"
            >
              Start Using AVA
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary/30">
        <Container className="px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <h2 className="text-xl font-semibold">AVA</h2>
              <p className="text-muted-foreground">Your community management solution</p>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <Button variant="ghost" size="sm" asChild>
                <a href="#">Terms of Service</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#">Privacy Policy</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#">Contact Us</a>
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} AVA. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
}
