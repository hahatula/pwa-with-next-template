import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
    const { token, title = 'Hello from PWA', body = 'This is a test push' } = await req.json();

    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    const origin = process.env.APP_URL || req.nextUrl.origin;

    try {
        const id = await adminMessaging.send({
            token,
            notification: { title, body },
            webpush: { fcmOptions: { link: origin } }
        });
        return NextResponse.json({ id });
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export const runtime = 'nodejs';