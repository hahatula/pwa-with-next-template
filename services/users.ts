import { db } from '@/lib/firebase/client-db';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { AppLanguage } from '@/contexts/LanguageProvider';
import { ScheduleStyle } from '@/contexts/DisplayPreferencesProvider';
import { User } from 'firebase/auth';

export async function ensureUserDoc(user: User) {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    
    if (!snap.exists()) {
      // Create new user doc
      await setDoc(ref, { 
        email: user.email ?? null, 
        roles: {}, 
        displayName: user.displayName ?? null,  // Cache Google name
        photoURL: user.photoURL ?? null,         // Cache Google photo
        createdAt: serverTimestamp() 
      }, { merge: true });
    } else {
      // Update cached OAuth data if it changed (optional but recommended)
      const data = snap.data();
      if (data.displayName !== user.displayName || data.photoURL !== user.photoURL) {
        await updateDoc(ref, {
          displayName: user.displayName ?? null,
          photoURL: user.photoURL ?? null,
        });
      }
    }
  }

export async function updatePreferredLanguage(uid: string, lang: AppLanguage) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { preferredLanguage: lang });
}

export async function updatePreferredScheduleStyle(uid: string, style: ScheduleStyle) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { preferredScheduleStyle: style });
}

export async function updateName(uid: string, name: string) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { name: name });
}

export async function updatePhone(uid: string, phone: string) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { phone: phone });
}