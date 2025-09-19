// components/SocialLogin.tsx
'use client';
import { auth } from '@/lib/firebase/client';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';

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
  return (
    <div>
      <button onClick={() => signIn('google')}>Continue with Google</button>
      {/* <button onClick={() => signIn('facebook')}>Continue with Facebook</button> */}
    </div>
  );
}