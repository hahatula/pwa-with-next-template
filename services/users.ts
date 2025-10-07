import { db } from '@/lib/firebase/client-db';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { AppLanguage } from '@/contexts/LanguageProvider';
import { auth } from '@/lib/firebase/client';

export async function ensureUserDoc(user: { uid: string; email: string | null }) {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, { email: user.email ?? null, roles: {}, createdAt: serverTimestamp() }, { merge: true });
    }
}

export async function updatePreferredLanguage(uid: string, lang: AppLanguage) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { preferredLanguage: lang });
}

export async function updateName(uid: string, name: string) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { name: name });
}

export async function updatePhone(uid: string, phone: string) {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { phone: phone });
}