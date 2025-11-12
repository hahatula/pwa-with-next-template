import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import type { ClassLevel, ClassType } from '@/lib/types';

type LocalizedText = { en: string; he: string };

type ClassInput = {
    title: LocalizedText;
    coach: LocalizedText;
    level: ClassLevel;
    type: ClassType;
    repeated: boolean;
    weekday?: number;
    startDate?: string;
    date?: string;
    startTime: string;
    endTime: string;
    active?: boolean;
};

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

export async function GET() {
    try {
        const snap = await adminDb.collection('classes').get();
        const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
        return NextResponse.json({ items });
    } catch (err) {
        console.error('classes GET error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const adminCheck = await requireAdmin(req);
        if ('error' in adminCheck) return adminCheck.error;
        const { actor } = adminCheck;

        const body = (await req.json().catch(() => ({}))) as Partial<ClassInput>;
        if (!body || !body.title || !body.coach || !body.level || !body.type || typeof body.repeated !== 'boolean' || !body.startTime || !body.endTime) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }
        if (body.repeated) {
            if (typeof body.weekday !== 'number') {
                return NextResponse.json({ error: 'weekday required for repeated' }, { status: 400 });
            }
        } else {
            if (!body.date) {
                return NextResponse.json({ error: 'date required for unique' }, { status: 400 });
            }
        }

        const base: Record<string, unknown> = {
            title: body.title,
            coach: body.coach,
            level: body.level,
            type: body.type,
            repeated: body.repeated,
            // only include relevant date fields
            weekday: body.repeated ? body.weekday : undefined,
            startDate: body.repeated ? (body.startDate || undefined) : undefined,
            date: !body.repeated ? body.date : undefined,
            startTime: body.startTime,
            endTime: body.endTime,
            active: body.active ?? true,
            createdBy: actor,
            updatedBy: actor,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const toSave = clean(base);
        const ref = await adminDb.collection('classes').add(toSave);
        return NextResponse.json({ id: ref.id });
    } catch (err) {
        console.error('classes POST error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

export const runtime = 'nodejs';


