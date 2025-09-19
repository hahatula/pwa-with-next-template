'use client';
import { signInWithEmailAndPassword, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import SocialLogin from '@/components/SocialLogin';

export default function LoginPage() {
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
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e: any) {
            setErr(e.message);
        }
    };

    return (
        <main>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign in</button>
            </form>
            <SocialLogin />
            {err && <p style={{ color: 'red' }}>{err}</p>}
        </main>
    );
}