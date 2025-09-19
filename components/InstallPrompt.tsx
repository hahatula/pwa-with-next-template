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
    const [noPromptHint, setNoPromptHint] = useState(false); // timeout fallback

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

        // if no prompt arrives within 2s, show guidance (covers Telegram/FB/etc.)
        const t = window.setTimeout(() => setNoPromptHint(true), 2000);

        return () => {
            window.removeEventListener('beforeinstallprompt', onBIP);
            window.removeEventListener('appinstalled', onInstalled);
            window.clearTimeout(t);
        };
    }, []);

    if (!isMobile) return null;
    if (installed || (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches)) return null;

    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isiOS = /iphone|ipad|ipod/i.test(ua);

    if (isiOS) return <p>To install: open in Safari → Share → Add to Home Screen</p>;
    if (!deferred && noPromptHint) return <p>Open in your browser (⋮/… → Open in browser) to install</p>;
    if (!deferred) return null;

    return <button onClick={async () => { await deferred.prompt(); setDeferred(null); }}>Install app</button>;
}