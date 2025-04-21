
import React, { createContext, useContext, useState } from "react";

type UserRole = "admin" | "tenant" | null;

interface AuthContextType {
  user: null | { email: string; role: UserRole };
  role: UserRole;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
}

const WireframeAuthContext = createContext<AuthContextType | undefined>(undefined);

export function WireframeAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null | { email: string; role: UserRole }>(null);

  const login = (role: UserRole, email = "user@example.com") => {
    setUser({ email, role });
  };

  const logout = () => setUser(null);

  return (
    <WireframeAuthContext.Provider value={{ user, role: user?.role ?? null, login, logout }}>
      {children}
    </WireframeAuthContext.Provider>
  );
}

export function useWireframeAuth() {
  const context = useContext(WireframeAuthContext);
  if (!context) throw new Error("useWireframeAuth must be used within WireframeAuthProvider");
  return context;
}
