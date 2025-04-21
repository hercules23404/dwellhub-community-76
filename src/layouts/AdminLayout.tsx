
import React from "react";
// TEMP: Remove ALL guards for Dev Preview
export function AdminLayout({ children }: { children: React.ReactNode }) {
  // No sidebar guard, just layout
  return (
    <div className="min-h-screen flex">
      <aside className="w-52 bg-muted p-6 hidden md:block">Admin Sidebar</aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
