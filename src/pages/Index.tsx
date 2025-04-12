
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/Container';
import { 
  ArrowRight, 
  Building, 
  Users, 
  Bell, 
  ShieldCheck,
  Home,
  Sparkles 
} from 'lucide-react';

export default function Index() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them to the appropriate page
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    }
  }, [user, loading, isAdmin, navigate]);

  // If loading auth state, return nothing
  if (loading) return null;

  // If user is logged in, we'll be redirected by the useEffect above
  // Only show landing page for non-authenticated users

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        <Container maxWidth="xl" className="relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-lg opacity-70"></div>
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-4xl animate-floating relative">
                  A
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-pulse-subtle" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground/80 to-foreground/40">
              Welcome to AVA
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
              A comprehensive property management platform that connects societies,
              tenants, and administrators in one seamless experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/auth?type=tenant">
                  Tenant Login
                  <Home className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild size="lg" variant="secondary" className="group">
                <Link to="/admin/presignup-setup">
                  Admin Login
                  <ShieldCheck className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/40">
        <Container maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Society Management</h3>
              <p className="text-muted-foreground">
                Efficient tools for property administrators to manage buildings,
                amenities, notices, and maintenance requests.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Tenant Portal</h3>
              <p className="text-muted-foreground">
                User-friendly interface for tenants to submit service requests,
                pay bills, and access important community information.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Notifications</h3>
              <p className="text-muted-foreground">
                Stay informed with real-time updates, announcements, and alerts
                about your property and community events.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container maxWidth="lg">
          <div className="bg-primary-foreground p-8 md:p-12 rounded-xl border shadow-sm text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join thousands of societies and tenants already using our platform
              to streamline property management and enhance community living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link to="/auth?type=tenant">
                  <Home className="mr-2 h-4 w-4" />
                  Join as Tenant
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="group">
                <Link to="/admin/presignup-setup">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Register Your Society
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 border-t">
        <Container maxWidth="xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full mr-2 flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <span className="font-semibold">AVA Property Management</span>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AVA | All rights reserved
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
