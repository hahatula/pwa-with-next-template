'use client';
import { useAuth } from '../../contexts/AuthProvider';
import { redirect } from 'next/navigation';
import Loader from '../Loader';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader center="screen" />;
  if (!user) {
    return redirect('/login');
  }
  return <>{children}</>;
}