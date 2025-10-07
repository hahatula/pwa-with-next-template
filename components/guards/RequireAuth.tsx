'use client';
import { useAuth } from '../../contexts/AuthProvider';
import { redirect } from 'next/navigation';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) {
    return redirect('/login');
  }
  return <>{children}</>;
}