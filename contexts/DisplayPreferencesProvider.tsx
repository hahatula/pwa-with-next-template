'use client';

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { db } from '@/lib/firebase/client-db';
import { doc, onSnapshot } from 'firebase/firestore';
import { updatePreferredScheduleStyle } from '@/services/users';

export type ScheduleStyle = 'list' | 'grid' | null;

type ScheduleStyleContextType = {
    scheduleStyle: ScheduleStyle;
    loading: boolean; // true until schedule style is resolved
    ready?: boolean;  // alias for !loading
    setScheduleStylePreference: (next: ScheduleStyle) => Promise<void>;
    toggleScheduleStyle: () => Promise<void>;
};

const ScheduleStyleContext = createContext<ScheduleStyleContextType>({
    scheduleStyle: null,
    loading: true,
    ready: false,
    setScheduleStylePreference: async () => { },
    toggleScheduleStyle: async () => { },
});

const LOCAL_STORAGE_KEY = 'schedule.style';


export function DisplayPreferencesProvider({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const [scheduleStyle, setScheduleStyle] = useState<ScheduleStyle>(null);
    const ready = scheduleStyle !== null;
    const unsubRef = useRef<null | (() => void)>(null);


    // Initialize schedule style from localStorage immediately on mount (fast path)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY) as ScheduleStyle | null;
        if (stored === 'list' || stored === 'grid') {
            setScheduleStyle(stored);
        }
    }, []);

    // If auth finished and no user and no stored schedule style, default to 'grid'
    useEffect(() => {
        if (authLoading) return;
        if (!user && scheduleStyle === null) {
            setScheduleStyle('grid');
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(LOCAL_STORAGE_KEY, 'grid');
            }
        }
    }, [authLoading, user, scheduleStyle]);

    // Subscribe to user preferred schedule style when logged in
    useEffect(() => {
        // Cleanup previous subscription if any
        if (unsubRef.current) {
            unsubRef.current();
            unsubRef.current = null;
        }

        if (!user) return;

        const ref = doc(db, 'users', user.uid);
        const unsub = onSnapshot(ref, async (snap) => {
            const data = snap.data() as { preferredScheduleStyle?: ScheduleStyle } | undefined;
            const preferred = data?.preferredScheduleStyle;

            if (preferred === 'list' || preferred === 'grid') {
                setScheduleStyle(preferred);
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(LOCAL_STORAGE_KEY, preferred);
                }
            } else {
                // If user has no preferred schedule style but local storage has one, persist it to Firestore
                if (typeof window !== 'undefined') {
                    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY) as ScheduleStyle | null;
                    if (stored === 'list' || stored === 'grid') {
                        setScheduleStyle(stored);
                        await updatePreferredScheduleStyle(user.uid, stored);
                    } else {
                        // Default to grid for first-time users
                        setScheduleStyle('grid');
                        await updatePreferredScheduleStyle(user.uid, 'grid');
                        window.localStorage.setItem(LOCAL_STORAGE_KEY, 'grid');
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

    const setScheduleStylePreference = useCallback(async (next: ScheduleStyle) => {
        setScheduleStyle(next);
        if (typeof window !== 'undefined') {
            if (next === 'list' || next === 'grid') {
                window.localStorage.setItem(LOCAL_STORAGE_KEY, next);
            } else {
                window.localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        }
        if (user && (next === 'list' || next === 'grid')) {
            await updatePreferredScheduleStyle(user.uid, next);
        }
    }, [user]);

    const toggleScheduleStyle = useCallback(async () => {
        const next = scheduleStyle === 'list' ? 'grid' : 'list';
        await setScheduleStylePreference(next);
    }, [scheduleStyle, setScheduleStylePreference]);


    const value = useMemo<ScheduleStyleContextType>(() => ({ scheduleStyle, loading: !ready, ready, setScheduleStylePreference, toggleScheduleStyle }), [scheduleStyle, ready, setScheduleStylePreference, toggleScheduleStyle]);

    return (
        <ScheduleStyleContext.Provider value={value}>
            {children}
        </ScheduleStyleContext.Provider>
    );
}

export const useScheduleStyle = () => useContext(ScheduleStyleContext);


