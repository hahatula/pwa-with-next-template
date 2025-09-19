import { db } from '@/lib/firebase/client-db';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function ensureUserDoc(user: { uid: string; email: string | null }) {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, { email: user.email ?? null, roles: {}, createdAt: serverTimestamp() }, { merge: true });
    }
}
