import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

type Registration = {
    classId: string;
    date: string; // YYYY-MM-DD occurrence
    uid: string; // registered user
    name?: string; // snapshot of user name at time of action
    photoURL?: string; // snapshot of user photo at time of action
    createdAt: Date;
    createdBy: string; // actor who created the registration
    createdByName?: string;
    confirmedAttendance?: boolean;
    classSnapshot?: {
        title: { en: string; he: string };
        coach: { en: string; he: string };
        startTime: string;
        endTime: string;
        level?: string;
        type?: string;
    };
};

async function requireActor(req: NextRequest) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return { error: NextResponse.json({ error: 'Missing token' }, { status: 401 }) } as const;
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
    if (!decoded) return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) } as const;
    const uid = decoded.uid;
    const userSnap = await adminDb.collection('users').doc(uid).get();
    const roles = (userSnap.data()?.roles ?? {}) as Record<string, boolean>;
    const isAdmin = !!roles.admin;
    const name = (userSnap.data()?.name as string | undefined) || (decoded.name as string | undefined) || (decoded.email as string | undefined) || 'User';
    return { uid, name, isAdmin } as const;
}

async function getUserNameSnapshot(uid: string): Promise<string | undefined> {
    const snap = await adminDb.collection('users').doc(uid).get();
    const firestoreName = (snap.data()?.name as string | undefined);
    if (firestoreName) return firestoreName;
    // Fallback to Firebase Auth profile if Firestore name is missing
    const authUser = await adminAuth.getUser(uid).catch(() => null);
    return authUser?.displayName || authUser?.email || undefined;
}

async function getUserPhotoSnapshot(uid: string): Promise<string | undefined> {
    const snap = await adminDb.collection('users').doc(uid).get();
    const firestorePhoto = (snap.data()?.photoURL as string | undefined);
    if (firestorePhoto) return firestorePhoto;
    const authUser = await adminAuth.getUser(uid).catch(() => null);
    return authUser?.photoURL || undefined;
}

function validateDateParam(date: string | null): date is string {
    return !!date && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        if (!validateDateParam(date)) {
            return NextResponse.json({ error: 'Invalid or missing date' }, { status: 400 });
        }
        // Require any authenticated user to view attendance list
        const actor = await requireActor(req);
        if ('error' in actor) return actor.error;

        const qSnap = await adminDb
            .collection('classRegistrations')
            .where('classId', '==', id)
            .where('date', '==', date)
            .get();

        const attendees = qSnap.docs.map((d) => {
            const data = d.data() as Registration;
            return { uid: data.uid, name: data.name || 'User', photoURL: data.photoURL, confirmedAttendance: !!data.confirmedAttendance };
        });

        return NextResponse.json({ attendees });
    } catch (err) {
        console.error('attendance GET error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const actor = await requireActor(req);
        if ('error' in actor) return actor.error;
        const { uid: actorUid, name: actorName, isAdmin } = actor;

        const body = (await req.json().catch(() => ({}))) as { date?: string; uid?: string };
        if (!validateDateParam(body.date ?? null)) {
            return NextResponse.json({ error: 'Invalid or missing date' }, { status: 400 });
        }

        const targetUid = body.uid || actorUid;
        if (targetUid !== actorUid && !isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const nameSnapshot = (await getUserNameSnapshot(targetUid)) || undefined;
        const photoSnapshot = (await getUserPhotoSnapshot(targetUid)) || undefined;
        const docId = `${id}_${body.date}_${targetUid}`;
        const ref = adminDb.collection('classRegistrations').doc(docId);
        const existing = await ref.get();
        if (existing.exists) {
            return NextResponse.json({ ok: true, alreadyRegistered: true });
        }
        // Snapshot class details at registration time to keep reports stable
        const classSnap = await adminDb.collection('classes').doc(id).get();
        const cls = (classSnap.data() as Record<string, unknown> | undefined) || {};
        const classSnapshot: Registration['classSnapshot'] = {
            title: {
                en: (cls as any)?.title?.['en'] ?? '',
                he: (cls as any)?.title?.['he'] ?? '',
            },
            coach: {
                en: (cls as any)?.coach?.['en'] ?? '',
                he: (cls as any)?.coach?.['he'] ?? '',
            },
            startTime: ((cls as any)?.startTime ?? '') as string,
            endTime: ((cls as any)?.endTime ?? '') as string,
            ...(typeof (cls as any)?.level !== 'undefined' ? { level: String((cls as any).level) } : {}),
            ...(typeof (cls as any)?.type !== 'undefined' ? { type: String((cls as any).type) } : {}),
        };
        const record: Registration = {
            classId: id,
            date: body.date!,
            uid: targetUid,
            name: nameSnapshot,
            photoURL: photoSnapshot,
            createdBy: actorUid,
            createdByName: actorName,
            createdAt: new Date(),
            confirmedAttendance: false,
            classSnapshot,
        };
        // Drop undefined fields to satisfy Firestore constraints
        const sanitized: Partial<Registration> = Object.fromEntries(
            Object.entries(record).filter(([, v]) => v !== undefined)
        ) as Partial<Registration>;
        await ref.set(sanitized);
        // Optional: trigger recompute hooks could be added here if needed
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('attendance POST error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const actor = await requireActor(req);
        if ('error' in actor) return actor.error;
        const { uid: actorUid, isAdmin } = actor;
        if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const body = (await req.json().catch(() => ({}))) as { date?: string; uid?: string; confirmedAttendance?: boolean };
        if (!validateDateParam(body.date ?? null) || typeof body.confirmedAttendance !== 'boolean') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }
        const { id } = await context.params;
        const targetUid = body.uid || actorUid;
        const docId = `${id}_${body.date}_${targetUid}`;
        const ref = adminDb.collection('classRegistrations').doc(docId);
        await ref.set({ confirmedAttendance: body.confirmedAttendance }, { merge: true });
        // Optional: trigger recompute hooks could be added here if needed
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('attendance PUT error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const actor = await requireActor(req);
        if ('error' in actor) return actor.error;
        const { uid: actorUid, isAdmin } = actor;

        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        const targetUid = searchParams.get('uid') || actorUid;
        if (!validateDateParam(date)) {
            return NextResponse.json({ error: 'Invalid or missing date' }, { status: 400 });
        }
        if (targetUid !== actorUid && !isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await context.params;
        const docId = `${id}_${date}_${targetUid}`;
        await adminDb.collection('classRegistrations').doc(docId).delete();
        // Optional: trigger recompute hooks could be added here if needed
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('attendance DELETE error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export const runtime = 'nodejs';


