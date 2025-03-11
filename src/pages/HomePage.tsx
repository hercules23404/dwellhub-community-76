
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardSummary } from "@/components/home/DashboardSummary";
import { Container } from "@/components/ui/Container";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <div className="pt-20 pb-16 px-4 lg:pr-72 lg:pl-8 max-w-screen-2xl mx-auto">
        <Container maxWidth="full" padding="pt-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome to DwellHub</h1>
            <p className="text-muted-foreground max-w-3xl">
              Your dashboard for property management, community notices, and service requests.
              Check out what's happening in your community today.
            </p>
            <DashboardSummary />
          </div>
        </Container>
      </div>
    </div>
  );
}
