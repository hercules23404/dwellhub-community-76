
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Bell, Building, Wrench, LogOut, Menu, X } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

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

  const navigationItems = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Notices", path: "/notices", icon: Bell },
    { name: "Properties", path: "/properties", icon: Building },
    { name: "Services", path: "/services", icon: Wrench },
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
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-64 bg-sidebar shadow-lg border-l border-sidebar-border transition-transform-300 transform lg:translate-x-0 h-full",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        <div className="flex flex-col h-full py-6">
          <div className="px-4 mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <h2 className="font-medium text-lg tracking-tight">AVA</h2>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all-200 hover:bg-sidebar-accent group",
                  currentPath === item.path
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="px-2 mt-auto">
            <Button variant="outline" className="w-full justify-start text-sm bg-sidebar-accent/50">
              <LogOut className="mr-3 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

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
