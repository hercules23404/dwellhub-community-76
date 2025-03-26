
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  Wrench, 
  Bell,
  LogOut, 
  Menu, 
  X, 
  Shield,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout } = useAdmin();
  const navigate = useNavigate();

  // Handle sidebar hover
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // On mobile, don't close when mouse leaves if it was explicitly opened
    if (window.innerWidth >= 1024) {
      setIsOpen(false);
    }
  };

  // Close sidebar on large screens when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location]);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navigationItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Properties", path: "/admin/properties", icon: Building },
    { name: "Tenants", path: "/admin/tenants", icon: Users },
    { name: "Services", path: "/admin/services", icon: Wrench },
    { name: "Notices", path: "/admin/notices", icon: Bell },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-6 right-6 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/80 backdrop-blur-md shadow-sm border rounded-full h-10 w-10"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-sidebar shadow-lg border-l border-sidebar-border transition-all duration-300 transform lg:translate-x-[calc(100%-0.5rem)] h-full",
          (isOpen || isHovering) ? "translate-x-0 lg:translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-lg tracking-tight">AVA</h2>
              <Shield className="h-4 w-4 text-red-500" />
              <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">ADMIN</span>
            </div>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-sidebar-accent group",
                  currentPath === item.path
                    ? "bg-red-100 text-red-700"
                    : "text-sidebar-foreground hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="px-2 mt-auto">
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm bg-sidebar-accent/50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Visual indicator for hover zone on desktop */}
      <div 
        className="fixed inset-y-0 right-0 w-2 z-30 hidden lg:block cursor-pointer"
        onMouseEnter={handleMouseEnter}
      />

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
