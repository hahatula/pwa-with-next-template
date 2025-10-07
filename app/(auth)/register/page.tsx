'use client';
import styles from '../auth.module.css';
import { createUserWithEmailAndPassword, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthProvider';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import Header from '@/components/Header';
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import SocialLogin from '@/components/SocialLogin';

export default function RegisterPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const { t: tCommon } = useI18n('common');
  const { t: tAuth } = useI18n('auth');

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user, router]);

  useEffect(() => {
    getRedirectResult(auth).catch(() => { console.log('no redirect result') });
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <>
      <Header />
      <main className={styles.authMain}>
        <div className={styles.formWrapper}>
          <h1>{tCommon('signup')}</h1>
          <form onSubmit={onSubmit} className={styles.form}>
            <AppInput name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <AppInput name="password" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <AppButton type="submit" variant="secondary">{tCommon('createAccount')}</AppButton>
            {err && <p style={{ color: 'fff' }}>{err}</p>}
          </form>
          <SocialLogin />
          <div className={styles.linkWrapper}>
            <p>{tAuth('haveAccount')}</p>
            <Link href="/login" className='link'>{tCommon('login')}</Link>
          </div>
        </div>
      </main>
    </>
  );
}