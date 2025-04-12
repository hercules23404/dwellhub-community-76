import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Bell, 
  Building, 
  Wrench, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Users,
  LayoutDashboard,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Sidebar() {
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navigation items for tenant users
  const tenantNavItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Notices", path: "/notices", icon: Bell },
    { name: "Properties", path: "/properties", icon: Building },
    { name: "Services", path: "/services", icon: Wrench },
    { name: "Maintenance", path: "/maintenance", icon: Wrench },
    { name: "Documents", path: "/documents", icon: FileText },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Profile", path: "/profile", icon: Settings },
  ];

  // Navigation items for admin users
  const adminNavItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Properties", path: "/admin/properties", icon: Building },
    { name: "Tenants", path: "/admin/tenants", icon: Users },
    { name: "Services", path: "/admin/services", icon: Wrench },
    { name: "Maintenance", path: "/admin/maintenance", icon: Wrench },
    { name: "Notices", path: "/admin/notices", icon: Bell },
    { name: "Users", path: "/admin/users", icon: Shield },
  ];

  // Select the appropriate navigation items based on user role
  const navItems = isAdmin ? adminNavItems : tenantNavItems;

  // Sidebar content component (used in both desktop and mobile views)
  const SidebarContent = () => (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              {isAdmin ? "Admin Portal" : "Tenant Portal"}
            </h2>
            <div className="space-y-1">
              <ul>
                {navItems.map((item) => (
                  <li key={item.path} className="mt-2">
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                        isActive(item.path)
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );

  // Mobile sidebar (sheet component)
  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg lg:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div className="fixed bottom-0 right-0 top-16 z-30 hidden w-64 border-l lg:block">
      <SidebarContent />
    </div>
  );
}
