
// This is now a no-op wrapper for static wireframe.
export function RequireAuth({ children }: { children: React.ReactNode; requireAdmin?: boolean }) {
  return <>{children}</>;
}
