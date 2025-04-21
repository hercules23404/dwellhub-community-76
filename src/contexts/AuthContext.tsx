
// TEMPORARY FOR DEMO — always return a dummy user and admin/tenant modes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Just return children. No real provider needed for demo
  return <>{children}</>;
}

export const useAuth = () => ({
  user: { name: "Demo User", email: "demo@example.com" },
  session: { id: "dummy-session" },
  loading: false,
  isAdmin: true, // Always admin for demo
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  resetPassword: () => {},
});
