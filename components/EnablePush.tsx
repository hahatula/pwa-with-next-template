'use client';
import { useEffect, useState } from 'react';
import { ensureFCMToken, listenForeground } from '@/lib/firebase/push';

export default function EnablePush() {
    const [token, setToken] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        const unsubPromise = listenForeground((p) => {
            console.log('Foreground message:', p);
            setStatus(`Foreground: ${p?.notification?.title ?? 'Notification'}`);
        });
        return () => { unsubPromise.then((unsub) => unsub()); };
    }, []);

    const enable = async () => {
        setStatus('Requesting permission...');
        const t = await ensureFCMToken();
        setToken(t);
        if (!t) { setStatus('Permission denied or unsupported.'); return; }
        setStatus('Token acquired.');
    };

    const sendTest = async () => {
        if (!token) return;
        setStatus('Sending test...');
        const resp = await fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
        setStatus(resp.ok ? 'Sent!' : 'Failed to send');
    };

    return (
        <section>
            <h2>Push Notifications</h2>
            <button onClick={enable}>Enable Notifications</button>
            {token && (
                <>
                    <p style={{ fontSize: 12, wordBreak: 'break-all' }}>Token: {token}</p>
                    <button onClick={sendTest}>Send Test Notification</button>
                </>
            )}
            {status && <p>{status}</p>}
        </section>
    );
}   