
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useWireframeAuth } from "@/contexts/WireframeAuthContext";

export function TenantLayout({ children }: { children: React.ReactNode }) {
  const { user, role } = useWireframeAuth();
  const location = useLocation();

  if (!user || role !== "tenant") {
    return <Navigate to="/tenant/login" state={{ from: location }} replace />;
  }

  // Add your sidebar/header as needed
  return (
    <div className="min-h-screen flex">
      {/* Sidebar placeholder */}
      <aside className="w-44 bg-muted p-6 hidden md:block">Tenant Sidebar</aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
