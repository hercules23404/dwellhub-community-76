
// Wireframe-only: no context needed, so export a stub
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
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
