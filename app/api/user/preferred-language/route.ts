import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

// an example of a secureserver route that can be used to update data
// when directly updating firebase firestore data is not possible
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        if (!token) {
            return NextResponse.json({ error: 'Missing token' }, { status: 401 });
        }

        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;

        const { lang } = await req.json().catch(() => ({}));
        if (lang !== 'en' && lang !== 'he') {
            return NextResponse.json({ error: 'Invalid lang' }, { status: 400 });
        }

        await adminDb.collection('users').doc(uid).set({ preferredLanguage: lang }, { merge: true });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('preferred-language error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export const runtime = 'nodejs';


