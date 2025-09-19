'use client';
import { createUserWithEmailAndPassword, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
      if (user) {
          router.replace('/account');
      }
  }, [user, router]);
  
  useEffect(() => {
      getRedirectResult(auth).catch(()=>{console.log('no redirect result')});
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <main>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit">Create account</button>
      </form>
      {err && <p style={{color:'red'}}>{err}</p>}
    </main>
  );
}