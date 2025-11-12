import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { toYmd } from '@/lib/utils/date';

export const runtime = 'nodejs';

async function requireActor(req: NextRequest) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return { error: NextResponse.json({ error: 'Missing token' }, { status: 401 }) } as const;
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
    if (!decoded) return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) } as const;
    return { uid: decoded.uid } as const;
}

export async function GET(req: NextRequest) {
    try {
        const actor = await requireActor(req);
        if ('error' in actor) return actor.error;
        const { uid } = actor;

        const todayStr = toYmd(new Date());

        const snap = await adminDb
            .collection('classRegistrations')
            .where('uid', '==', uid)
            .where('date', '>=', todayStr)
            .orderBy('date', 'asc')
            .get();

        const items = await Promise.all(snap.docs.map(async (d) => {
            const r = d.data() as { classId: string; date: string; classSnapshot?: any };
            // Prefer snapshot stored on registration; fallback to live class doc
            let snapshot = r.classSnapshot;
            if (!snapshot) {
                const clsSnap = await adminDb.collection('classes').doc(r.classId).get();
                const cls = clsSnap.data() as any;
                snapshot = cls ? {
                    title: cls.title || { en: '', he: '' },
                    coach: cls.coach || { en: '', he: '' },
                    startTime: cls.startTime || '',
                    endTime: cls.endTime || '',
                    level: cls.level,
                    type: cls.type,
                } : undefined;
            }
            return { classId: r.classId, date: r.date, classSnapshot: snapshot };
        }));

        return NextResponse.json({ items });
    } catch (err) {
        console.error('user upcoming GET error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}


