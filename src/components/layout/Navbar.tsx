
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/UserButton";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-30 py-4 transition-all duration-300 lg:px-20 px-6",
        scrolled 
          ? "bg-white/85 backdrop-blur-md shadow-sm" 
          : "bg-transparent",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Link 
          to="/home" 
          className="font-medium text-lg transition-all hover:opacity-80 flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
            A
          </div>
          <span>AVA</span>
          <Sparkles className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-1">
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link to="/home">Home</Link>
            </Button>
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link to="/notices">Notices</Link>
            </Button>
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link to="/properties">Properties</Link>
            </Button>
            <Button variant="ghost" className="hover:bg-primary/10" asChild>
              <Link to="/services">Services</Link>
            </Button>
          </div>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
