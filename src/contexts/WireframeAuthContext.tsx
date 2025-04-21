import React, { createContext, useContext, useState } from "react";

type UserRole = "admin" | "tenant" | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (userData: Omit<User, 'id'>) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const WireframeAuthContext = createContext<AuthContextType | undefined>(undefined);

export function WireframeAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: Omit<User, 'id'>) => {
    setUser({
      id: crypto.randomUUID(),
      ...userData
    });
  };

  const logout = () => setUser(null);

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    setUser({
      ...user,
      ...userData
    });
  };

  return (
    <WireframeAuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </WireframeAuthContext.Provider>
  );
}

export function useWireframeAuth() {
  const context = useContext(WireframeAuthContext);
  if (!context) {
    throw new Error("useWireframeAuth must be used within WireframeAuthProvider");
  }
  return context;
}
