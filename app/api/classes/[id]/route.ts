import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

function clean<T extends Record<string, unknown>>(obj: T): T {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined) out[k] = v;
    }
    return out as T;
}

async function requireAdmin(req: NextRequest) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return { error: NextResponse.json({ error: 'Missing token' }, { status: 401 }) } as const;
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
    if (!decoded) return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) } as const;
    const uid = decoded.uid;
    const userSnap = await adminDb.collection('users').doc(uid).get();
    const roles = (userSnap.data()?.roles ?? {}) as Record<string, boolean>;
    if (!roles.admin) return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) } as const;
    const actor = (userSnap.data()?.name as string | undefined) || (decoded.name as string | undefined) || (decoded.email as string | undefined) || 'Unknown admin';
    return { uid, actor } as const;
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const docRef = adminDb.collection('classes').doc(id);
        const snap = await docRef.get();
        if (!snap.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ id: snap.id, ...(snap.data() as Record<string, unknown>) });
    } catch (err) {
        console.error('classes [id] GET error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const adminCheck = await requireAdmin(req);
        if ('error' in adminCheck) return adminCheck.error;
        const { actor } = adminCheck;

        const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
        if (!body) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

        const toUpdate = clean({
            ...body,
            updatedBy: actor,
            updatedAt: new Date(),
        });

        const { id } = await context.params;
        await adminDb.collection('classes').doc(id).set(toUpdate, { merge: true });
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('classes [id] PUT error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const adminCheck = await requireAdmin(req);
        if ('error' in adminCheck) return adminCheck.error;

        const { id } = await context.params;
        await adminDb.collection('classes').doc(id).delete();
        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('classes [id] DELETE error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export const runtime = 'nodejs';
