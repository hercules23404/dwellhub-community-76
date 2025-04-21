
import React, { createContext, useContext, useState } from "react";
import { useWireframeAuth } from "./WireframeAuthContext";

interface AdminContextType {
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { role } = useWireframeAuth();
  const isAdmin = role === "admin";

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  
  return context;
}
