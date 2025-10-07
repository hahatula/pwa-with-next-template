'use client';
import styles from '../auth.module.css';
import { signInWithEmailAndPassword, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import SocialLogin from '@/components/SocialLogin';
import PitButton from '@/components/PitButton';
import PitInput from '@/components/PitInput';
import Header from '@/components/Header';
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const { user } = useAuth();
    const router = useRouter();
    const { t: tCommon } = useI18n('common');
    const { t: tAuth } = useI18n('auth');

    useEffect(() => {
        if (user) {
            router.replace('/schedule');
        }
    }, [user, router]);

    useEffect(() => {
        getRedirectResult(auth).catch(() => { console.log('no redirect result') });
    }, []);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e: unknown) {
            setErr(e instanceof Error ? e.message : String(e));
        }
    };

    return (
        <>
            <Header />
            <main className={styles.authMain}>
                <div className={styles.formWrapper}>
                    <h1>{tCommon('login')}</h1>
                    <form onSubmit={onSubmit} className={styles.form}>
                        <PitInput name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <PitInput name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <PitButton type="submit" variant="secondary">{tCommon('login')}</PitButton>
                        {err && <p style={{ color: 'fff' }}>{err}</p>}
                    </form>
                    <SocialLogin />
                    <div className={styles.linkWrapper}>
                        <p>{tAuth('noAccount')}</p>
                        <Link href="/register" className='link'>{tCommon('signup')}</Link>
                    </div>
                </div>
            </main>
        </>
    );
}