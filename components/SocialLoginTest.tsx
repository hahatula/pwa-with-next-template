'use client';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useEffect } from 'react';
import AppButton from './AppButton';

// Declare Google Identity Services types
interface GoogleIdentityResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: GoogleIdentityResponse) => void }) => void;
          prompt: () => void;
          renderButton: (parent: HTMLElement | null, options: { theme: string; size: string }) => void;
        };
      };
    };
  }
}

export default function SocialLoginTest() {
  // Handle the response
  async function handleGoogleResponse(response: GoogleIdentityResponse) {
    // response.credential is the JWT token
    const credential = GoogleAuthProvider.credential(response.credential);

    // Sign in to Firebase with the credential
    await signInWithCredential(auth, credential);
  }

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      callback: handleGoogleResponse,
    });

    // Display the One Tap prompt
    window.google?.accounts.id.prompt();

    // Or render a button
    window.google?.accounts.id.renderButton(
      document.getElementById('googleButtonDiv'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  return (
    <AppButton>
      <div id="googleButtonDiv"></div>
    </AppButton>
  );
}