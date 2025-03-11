
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { Container } from "@/components/ui/Container";

export default function PropertyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <div className="pt-20 pb-16 px-4 lg:pr-72 lg:pl-8 max-w-screen-2xl mx-auto">
        <Container maxWidth="full" padding="pt-6">
          <PropertyGrid />
        </Container>
      </div>
    </div>
  );
}
