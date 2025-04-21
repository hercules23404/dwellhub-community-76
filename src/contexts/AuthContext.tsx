
// TEMPORARY FOR DEMO — always return a dummy user and admin/tenant modes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Just return children. No real provider needed for demo
  return <>{children}</>;
}

export const useAuth = () => ({
  user: { 
    name: "Demo User", 
    email: "demo@example.com",
    id: "demo-user-123",
    created_at: "2023-04-01T12:00:00Z",
    user_metadata: {
      first_name: "Demo",
      last_name: "User",
      bio: "This is a demo user account for development purposes.",
      phone_number: "+1 (555) 123-4567"
    },
    session: { id: "dummy-session" }
  },
  session: { id: "dummy-session" },
  loading: false,
  isAdmin: true, // Always admin for demo
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  resetPassword: () => {},
});
