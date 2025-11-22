import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminStorage } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

async function requireActor(req: NextRequest) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return { error: NextResponse.json({ error: 'Missing token' }, { status: 401 }) } as const;
    const decoded = await adminAuth.verifyIdToken(token).catch(() => null);
    if (!decoded) return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) } as const;
    return { uid: decoded.uid } as const;
}

export async function DELETE(req: NextRequest) {
    try {
        const actor = await requireActor(req);
        if ('error' in actor) return actor.error;
        const { uid } = actor;

        const body = await req.json();
        const { oldPhotoURL } = body;

        if (!oldPhotoURL) {
            return NextResponse.json({ success: true });
        }

        // Validate that we are deleting a file from the user's own avatar folder
        let path: string | undefined;
        try {
            const url = new URL(oldPhotoURL);
            // Firebase Storage URLs format: .../o/path%2Fto%2Ffile?alt=...
            if (url.pathname.includes('/o/')) {
                path = decodeURIComponent(url.pathname.split('/o/')[1]?.split('?')[0]);
            }
        } catch (e) {
            console.warn('Invalid URL:', e);
        }

        // Security Check: Ensure path starts with avatars/{uid}/
        if (!path || !path.startsWith(`avatars/${uid}/`)) {
            console.warn(`User ${uid} attempted to delete unauthorized path: ${path}`);
            // Return success to client to avoid UI errors, but log the attempt
            return NextResponse.json({ success: true, warning: 'Unauthorized path' });
        }

        try {
            await adminStorage.bucket().file(path).delete();
        } catch (storageError: unknown) {
            // Ignore if file doesn't exist (404)
            if ((storageError as { code?: number }).code !== 404) {
                console.error('Storage delete error:', storageError);
            }
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Avatar delete error:', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
