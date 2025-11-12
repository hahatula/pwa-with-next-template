'use client';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import RequireAuth from '@/components/guards/RequireAuth';
import Header from '@/components/Header';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageProvider';
import AppButton from '@/components/AppButton';

type UpcomingItem = {
    classId: string;
    date: string; // YYYY-MM-DD
    classSnapshot?: {
        title: { en: string; he: string };
        coach: { en: string; he: string };
        startTime: string;
        endTime: string;
    };
};

export default function MyUpcomingClassesPage() {
    return (
        <RequireAuth>
            <div className='pageLayout'>
                <Header />
                <MyClassesInner />
            </div>
        </RequireAuth>
    );
}

function toReadable(dateStr: string, locale: string) {
    const [y, m, d] = dateStr.split('-').map((v) => parseInt(v, 10));
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
}

function MyClassesInner() {
    const { user } = useAuth();
    const { lang } = useLanguage();
    const locale = lang === 'he' ? 'he-IL' : 'en-US';
    const [items, setItems] = useState<UpcomingItem[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        async function load() {
            if (!user) { setItems([]); setLoading(false); return; }
            try {
                setLoading(true);
                const token = await user.getIdToken();
                const res = await fetch('/api/user/upcoming', { headers: { authorization: `Bearer ${token}` } });
                if (!active) return;
                if (!res.ok) { setItems([]); return; }
                const data = await res.json();
                setItems((data.items || []) as UpcomingItem[]);
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [user]);

    return (
        <main className='innerPageMain'>
            <h1>My upcoming classes</h1>
            {loading && <p>Loading...</p>}
            {!loading && items && items.length === 0 && <p>No upcoming classes</p>}
            {!loading && items && items.length > 0 && (
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map((it) => (
                        <li key={`${it.classId}_${it.date}`}>
                            <Link href={`/schedule/${it.classId}?date=${it.date}`}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ minWidth: 120 }}>{toReadable(it.date, locale)}</div>
                                    <div style={{ minWidth: 120 }}>{it.classSnapshot?.startTime} - {it.classSnapshot?.endTime}</div>
                                    <div>{lang === 'he' ? it.classSnapshot?.title?.he : it.classSnapshot?.title?.en}</div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <AppButton href="/account">Back to account</AppButton>
            <AppButton href="/schedule">Back to schedule</AppButton>
        </main>
    );
}


