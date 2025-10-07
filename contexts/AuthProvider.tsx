'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { db } from '@/lib/firebase/client-db';
import { doc, onSnapshot } from 'firebase/firestore';

type Roles = Record<string, boolean>;
type AuthContextType = { user: User | null; loading: boolean; roles: Roles; isAdmin: boolean };

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, roles: {}, isAdmin: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<Roles>({});

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    setUser(u);
    setLoading(false);
    if (u) { (await import('@/services/users')).ensureUserDoc(u); }
  }), []);

  useEffect(() => {
    if (!user) { setRoles({}); return; }
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      const data = snap.data() as { roles?: Roles } | undefined;
      setRoles(data?.roles ?? {});
    });
    return () => unsub();
  }, [user]);

  const isAdmin = useMemo(() => !!roles.admin, [roles]);

  return <AuthContext.Provider value={{ user, loading, roles, isAdmin }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);