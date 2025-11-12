"use client";

import { useEffect, useMemo, useState } from 'react';
import type { ClassDoc } from '@/lib/types';
import { useAuth } from '@/contexts/AuthProvider';
import { toYmd } from '@/lib/utils/date';

export type WeeklyClasses = {
    days: Date[];
    classesByDate: Record<string, ClassDoc[]>; // key: YYYY-MM-DD
    loading: boolean;
    error?: string;
};
function startOfSundayWeek(base: Date, weekOffset: 0 | 1): Date {
    const dayOfWeek = base.getDay(); // 0=Sun
    return new Date(base.getFullYear(), base.getMonth(), base.getDate() - dayOfWeek + weekOffset * 7);
}

export function useWeeklyClasses(weekOffset: 0 | 1 = 0): WeeklyClasses {
    const { user } = useAuth();
    const [classes, setClasses] = useState<ClassDoc[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                setError(undefined);
                const headers: Record<string, string> = {};
                if (user) {
                    const token = await user.getIdToken();
                    headers['authorization'] = `Bearer ${token}`;
                }
                const res = await fetch('/api/classes', { headers });
                if (!res.ok) throw new Error('Failed to fetch classes');
                const data = await res.json();
                if (!active) return;
                setClasses((data.items || []) as ClassDoc[]);
            } catch (e) {
                if (!active) return;
                setClasses([]);
                setError('Failed to load classes');
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [user]);

    const result = useMemo<WeeklyClasses>(() => {
        const today = new Date();
        const sunday = startOfSundayWeek(new Date(today.getFullYear(), today.getMonth(), today.getDate()), weekOffset);
        const days: Date[] = [];
        // Always include Sunday-Friday
        for (let i = 0; i < 6; i++) {
            days.push(new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i));
        }
        // Compute candidate Saturday
        const saturday = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 6);

        const classesByDate: Record<string, ClassDoc[]> = {};
        for (const d of days) {
            classesByDate[toYmd(d)] = [];
        }

        if (classes && classes.length > 0) {
            for (const c of classes) {
                if (c.active === false) continue;
                if (c.repeated) {
                    for (const d of days) {
                        const ymd = toYmd(d);
                        const dow = d.getDay();
                        const onOrAfterStart = !c.startDate || ymd >= c.startDate;
                        if (typeof c.weekday === 'number' && c.weekday === dow && onOrAfterStart) {
                            classesByDate[ymd].push(c);
                        }
                    }
                } else if (c.date) {
                    if (classesByDate[c.date]) {
                        classesByDate[c.date].push(c);
                    }
                }
            }
        }

        // Determine if Saturday should be included
        const saturdayYmd = toYmd(saturday);
        let saturdayClasses: ClassDoc[] = [];
        if (classes && classes.length > 0) {
            for (const c of classes) {
                if (c.active === false) continue;
                if (c.repeated) {
                    const dow = 6; // Saturday
                    const onOrAfterStart = !c.startDate || saturdayYmd >= c.startDate;
                    if (typeof c.weekday === 'number' && c.weekday === dow && onOrAfterStart) {
                        saturdayClasses.push(c);
                    }
                } else if (c.date === saturdayYmd) {
                    saturdayClasses.push(c);
                }
            }
        }

        const isTodaySaturday = weekOffset === 0 && today.getFullYear() === saturday.getFullYear() && today.getMonth() === saturday.getMonth() && today.getDate() === saturday.getDate();
        const shouldIncludeSaturday = saturdayClasses.length > 0 || isTodaySaturday;
        if (shouldIncludeSaturday) {
            days.push(saturday);
            classesByDate[saturdayYmd] = saturdayClasses;
        }

        for (const key of Object.keys(classesByDate)) {
            classesByDate[key].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
        }

        return { days, classesByDate, loading, error };
    }, [weekOffset, classes, loading, error]);
    return result;
}

export default useWeeklyClasses;


