// components/SocialLogin.tsx
'use client';
import { auth } from '@/lib/firebase/client';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import AppButton from './AppButton';
import { useI18n } from '@/lib/i18n';

async function signIn(provider: 'google' | 'facebook') {
  const prov = provider === 'google' ? new GoogleAuthProvider() : new FacebookAuthProvider();
  try {
    await signInWithPopup(auth, prov);
  } catch {
    // Popups can fail in installed PWAs/iOS; fallback to redirect
    await signInWithRedirect(auth, prov);
  }
}

export default function SocialLogin() {
  const { t: tAuth } = useI18n('auth');
  return (
    <div>
      <AppButton onClick={() => signIn('google')} variant="secondary">{tAuth('withGoogle')}</AppButton>
    </div>
  );
}