
// Static wireframe-only: no auth context needed!
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
// Static/dummy frontend hook for compatibility; always returns "signed out"
export const useAuth = () => ({
  user: null,
  session: null,
  loading: false,
  isAdmin: false,
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  resetPassword: () => {},
});
