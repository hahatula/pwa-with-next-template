// components/InstallPrompt.tsx
'use client';
import { useEffect, useState } from 'react';

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
type UADataNavigator = Navigator & { userAgentData?: { mobile?: boolean } };

export default function InstallPrompt() {
    const [deferred, setDeferred] = useState<BIP | null>(null);
    const [installed, setInstalled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const nav = navigator as UADataNavigator;
        const ua = nav.userAgent || '';
        const mobile = /android|iphone|ipad|ipod|windows phone/i.test(ua) || nav.userAgentData?.mobile === true;
        setIsMobile(Boolean(mobile));

        const onBIP = (e: Event) => { e.preventDefault(); setDeferred(e as BIP); };
        const onInstalled = () => setInstalled(true);
        window.addEventListener('beforeinstallprompt', onBIP);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onBIP);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    if (!isMobile) return null;
    if (installed || (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches)) return null;

    const isiOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (isiOS) return <p>To install: Share → Add to Home Screen</p>;

    if (!deferred) return null;
    return <button onClick={async () => { await deferred.prompt(); setDeferred(null); }}>Install app</button>;
}