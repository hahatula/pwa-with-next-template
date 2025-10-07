'use client';

import { useEffect, useMemo, useState } from 'react';

export type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type UADataNavigator = Navigator & { userAgentData?: { mobile?: boolean } };

export type UseInstallPromptResult = {
    isMobile: boolean;
    installed: boolean;
    displayModeStandalone: boolean;
    deferred: BeforeInstallPromptEvent | null;
    noPromptHint: boolean;
    isiOS: boolean;
    hasInstallUI: boolean;
    requestInstall: (() => Promise<void>) | null;
};

export function useInstallPrompt(): UseInstallPromptResult {
    const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
    const [installed, setInstalled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [noPromptHint, setNoPromptHint] = useState(false);

    useEffect(() => {
        const nav = navigator as UADataNavigator;
        const ua = nav.userAgent || '';
        const mobileUA = /Android|iPhone|iPad|iPod|Windows Phone|Mobi/i.test(ua);
        const mobileHeuristic = (navigator.maxTouchPoints || 0) > 0 && Math.max(window.screen.width, window.screen.height) <= 1366;
        const mobile = nav.userAgentData?.mobile === true || mobileUA || mobileHeuristic;
        setIsMobile(Boolean(mobile));

        const onBIP = (e: Event) => { e.preventDefault(); setDeferred(e as BeforeInstallPromptEvent); };
        const onInstalled = () => setInstalled(true);
        window.addEventListener('beforeinstallprompt', onBIP);
        window.addEventListener('appinstalled', onInstalled);

        const t = window.setTimeout(() => setNoPromptHint(true), 2000);

        return () => {
            window.removeEventListener('beforeinstallprompt', onBIP);
            window.removeEventListener('appinstalled', onInstalled);
            window.clearTimeout(t);
        };
    }, []);

    const displayModeStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isiOS = /iphone|ipad|ipod/i.test(ua);

    const hasInstallUI = useMemo(() => {
        if (!isMobile) return false;
        if (installed) return false;
        if (displayModeStandalone) return false;
        if (isiOS) return true; // iOS guidance UI
        if (deferred) return true; // install button UI
        if (!deferred && noPromptHint) return true; // guidance when prompt didn't arrive
        return false;
    }, [isMobile, installed, displayModeStandalone, isiOS, deferred, noPromptHint]);

    const requestInstall = deferred
        ? async () => { await deferred.prompt(); setDeferred(null); }
        : null;

    return {
        isMobile,
        installed,
        displayModeStandalone,
        deferred,
        noPromptHint,
        isiOS,
        hasInstallUI,
        requestInstall,
    };
}


