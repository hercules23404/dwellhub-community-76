
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardSummary } from "@/components/home/DashboardSummary";
import { Container } from "@/components/ui/Container";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <div className="pt-20 pb-16 px-4 lg:pr-72 lg:pl-8 max-w-screen-2xl mx-auto">
        <Container maxWidth="full" padding="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">Welcome to AVA</h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse-subtle" />
            </div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-lg opacity-70"></div>
              <p className="relative bg-background/80 rounded-lg p-4 text-muted-foreground max-w-3xl">
                Your dashboard for property management, community notices, and service requests.
                Check out what's happening in your community today.
              </p>
            </div>
            <DashboardSummary />
          </div>
        </Container>
      </div>
    </div>
  );
}
