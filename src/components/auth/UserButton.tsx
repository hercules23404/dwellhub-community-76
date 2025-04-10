
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Settings, Bell, Building, HelpCircle, Shield } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";

export function UserButton() {
  const { isAdmin, logout: logoutAdmin } = useAdmin();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await signOut();
      logoutAdmin(); // Also clear admin state
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <Link 
        to="/auth" 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background 
                  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                  focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary 
                  text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Sign In
      </Link>
    );
  }

  // Get user's initials or first letter of email for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.user_metadata?.first_name) {
      return user.user_metadata.first_name.charAt(0).toUpperCase();
    }
    
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  // Get display name from metadata or email
  const getDisplayName = () => {
    if (!user) return "User";
    
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    
    return user.email?.split('@')[0] || "User";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full hover:scale-105 transition-transform">
          <Avatar className={`h-10 w-10 border ${isAdmin ? 'border-red-200' : ''}`}>
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback className={isAdmin ? "bg-red-500/10 text-red-700" : "bg-primary/5"}>
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {isAdmin && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <Shield className="h-2.5 w-2.5 text-white" />
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{isAdmin ? "Admin User" : getDisplayName()}</p>
              {isAdmin && (
                <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">Admin</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isAdmin ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin/dashboard">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/properties">
                <Building className="mr-2 h-4 w-4" />
                <span>Manage Properties</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/tenants">
                <User className="mr-2 h-4 w-4" />
                <span>Manage Tenants</span>
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile?tab=notifications">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile?tab=properties">
                <Building className="mr-2 h-4 w-4" />
                <span>My Properties</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem asChild>
          <Link to={isAdmin ? "/admin/dashboard" : "/profile?tab=security"}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        {!isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/profile?tab=support">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
