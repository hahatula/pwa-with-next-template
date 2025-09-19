// components/InstallPrompt.tsx
'use client';
import { useEffect, useState } from 'react';

// narrowed type of the beforeinstallprompt event
type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
type UADataNavigator = Navigator & { userAgentData?: { mobile?: boolean } };

export default function InstallPrompt() {
    const [deferred, setDeferred] = useState<BIP | null>(null);
    const [installed, setInstalled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const nav = navigator as UADataNavigator;
        const ua = nav.userAgent || '';
        const mobileUA = /Android|iPhone|iPad|iPod|Windows Phone|Mobi/i.test(ua);
        const mobileHeuristic = (navigator.maxTouchPoints || 0) > 0 && Math.max(window.screen.width, window.screen.height) <= 1366;
        const mobile = nav.userAgentData?.mobile === true || mobileUA || mobileHeuristic;
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

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isiOS = /iphone|ipad|ipod/i.test(ua);
    const isInApp = /(FBAN|FBAV|Instagram|Line|MicroMessenger|WeChat|Snapchat|Twitter|Telegram|Pinterest)/i.test(ua);
    console.log('isiOS', isiOS);
    console.log('isInApp', isInApp);
    console.log('deferred', deferred);

    if (isiOS) return <p>To install: open in Safari → Share → Add to Home Screen</p>;
    if (isInApp && !deferred) return <p>Open in Chrome to install (menu → Open in browser)</p>;
    if (!deferred) {
        // Covers Telegram/other in‑app browsers where no prompt exists
        if (isInApp) return <p>Open in your browser (⋮/… → Open in browser) to install</p>;
        // Mobile browser but prompt not ready yet
        return null;
      }

    return <button onClick={async () => { await deferred.prompt(); setDeferred(null); }}>Install app</button>;
}