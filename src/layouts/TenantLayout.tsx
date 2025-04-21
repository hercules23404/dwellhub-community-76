
import React from "react";
// TEMP: Remove ALL guards for Dev Preview
export function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-44 bg-muted p-6 hidden md:block">Tenant Sidebar</aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
