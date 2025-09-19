import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
    const { token, title = 'Hello from PWA', body = 'This is a test push' } = await req.json();

    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

    try {
        const id = await adminMessaging.send({
            token,
            notification: { title, body },
            webpush: {
                fcmOptions: { link: process.env.APP_URL ?? 'https://example.com' }
            }
        });
        return NextResponse.json({ id });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export const runtime = 'nodejs';