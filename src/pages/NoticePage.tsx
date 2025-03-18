
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { NoticeList } from "@/components/notice/NoticeList";
import { Container } from "@/components/ui/Container";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NoticePage() {
  useEffect(() => {
    // Show a toast when the page loads to provide feedback
    toast.success("Notices loaded successfully", {
      description: "You can view all community notifications here",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <Container maxWidth="full" padding="pt-6">
            <NoticeList />
          </Container>
        </div>
      </div>
    </div>
  );
}
