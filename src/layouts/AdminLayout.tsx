
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWireframeAuth } from "@/contexts/WireframeAuthContext";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = useWireframeAuth();
  const location = useLocation();

  if (!user || role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Add your sidebar/header as needed
  return (
    <div className="min-h-screen flex">
      {/* Sidebar placeholder */}
      <aside className="w-52 bg-muted p-6 hidden md:block">Admin Sidebar</aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
