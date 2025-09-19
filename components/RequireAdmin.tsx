'use client';
import { useAuth } from './AuthProvider';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be signed in.</p>;
  if (!isAdmin) return <p>Admins only.</p>;
  return <>{children}</>;
}