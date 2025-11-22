'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { db } from '@/lib/firebase/client-db';
import { doc, onSnapshot } from 'firebase/firestore';
import { updatePreferredLanguage } from '@/services/users';

export type AppLanguage = 'en' | 'he' | null;

type LanguageContextType = {
    lang: AppLanguage;
    dir: 'ltr' | 'rtl';
    loading: boolean; // true until lang is resolved
    ready?: boolean;  // alias for !loading
    setLanguage: (lang: AppLanguage) => Promise<void>;
    toggleLanguage: () => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>({
    lang: null,
    dir: 'ltr',
    loading: true,
    ready: false,
    setLanguage: async () => { },
    toggleLanguage: async () => { },
});

const LOCAL_STORAGE_KEY = 'app.lang';

function getDirection(lang: AppLanguage): 'ltr' | 'rtl' {
    return lang === 'he' ? 'rtl' : 'ltr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [lang, setLang] = useState<AppLanguage>(null);
    const ready = lang !== null;
    const unsubRef = useRef<null | (() => void)>(null);

    // Apply lang and dir to <html> dynamically on client
    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (ready) {
            document.documentElement.setAttribute('lang', lang);
        }
        // Toggle a body class to control text alignment globally without changing direction
        if (document.body) {
            document.body.classList.toggle('lang-he', lang === 'he');
        }
    }, [lang, ready]);

    // Initialize language from localStorage immediately on mount (fast path)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY) as AppLanguage | null;
        if (stored === 'en' || stored === 'he') {
            setLang(stored);
        }
    }, []);

    // If auth finished and no user and no stored lang, default to 'en'
    useEffect(() => {
        if (authLoading) return;
        if (!user && lang === null) {
            setLang('en');
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(LOCAL_STORAGE_KEY, 'en');
            }
        }
    }, [authLoading, user, lang]);

    // Subscribe to user preferredLanguage when logged in
    useEffect(() => {
        // Cleanup previous subscription if any
        if (unsubRef.current) {
            unsubRef.current();
            unsubRef.current = null;
        }

        if (!user) return;

        const ref = doc(db, 'users', user.uid);
        const unsub = onSnapshot(ref, async (snap) => {
            const data = snap.data() as { preferredLanguage?: AppLanguage } | undefined;
            const preferred = data?.preferredLanguage;

            if (preferred === 'en' || preferred === 'he') {
                setLang(preferred);
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(LOCAL_STORAGE_KEY, preferred);
                }
            } else {
                // If user has no preferredLanguage but local storage has one, persist it to Firestore
                if (typeof window !== 'undefined') {
                    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY) as AppLanguage | null;
                    if (stored === 'en' || stored === 'he') {
                        setLang(stored);
                        await updatePreferredLanguage(user.uid, stored);
                    } else {
                        // Default to English for first-time users
                        setLang('en');
                        await updatePreferredLanguage(user.uid, 'en');
                        window.localStorage.setItem(LOCAL_STORAGE_KEY, 'en');
                    }
                }
            }
        });

        unsubRef.current = unsub;

        return () => {
            unsub();
            unsubRef.current = null;
        };
    }, [user]);

    const setLanguage = useCallback(async (next: AppLanguage) => {
        setLang(next);
        if (typeof window !== 'undefined') {
            if (next === 'en' || next === 'he') {
                window.localStorage.setItem(LOCAL_STORAGE_KEY, next);
            } else {
                window.localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
        if (user && (next === 'en' || next === 'he')) {
            await updatePreferredLanguage(user.uid, next);
        }
    }, [user]);

    const toggleLanguage = useCallback(async () => {
        const next = lang === 'en' ? 'he' : 'en';
        await setLanguage(next);
    }, [lang, setLanguage]);

    const dir = useMemo(() => getDirection(lang), [lang]);

    const value = useMemo<LanguageContextType>(() => ({ lang, dir, loading: !ready, ready, setLanguage, toggleLanguage }), [dir, lang, ready, setLanguage, toggleLanguage]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);


