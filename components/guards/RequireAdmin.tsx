'use client';
import { useAuth } from '@/contexts/AuthProvider';
import { redirect } from 'next/navigation';
import Loader from '../Loader';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader center="screen" />;
  if (!user) {
    return redirect('/login');
  }
  if (!isAdmin) return <p>Admins only.</p>;
  return <>{children}</>;
}