'use client';
import styles from './MyUpcomingClasses.module.css';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import RequireAuth from '@/components/guards/RequireAuth';
import Header from '@/components/Header';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageProvider';
import AppButton from '@/components/AppButton';
import { useI18n } from '@/lib/i18n';
import ActionFooter from '@/components/ActionFooter';

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
    const { t: tAccount } = useI18n('account');
    const { t: tSchedule } = useI18n('schedule');
    const { t: tCommon } = useI18n('common');
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
        <>
            <main className='innerPageMain'>
                <h1>{tAccount('myUpcomingClasses')}</h1>
                {loading && <p>{tCommon('loading')}</p>}
                {!loading && items && items.length === 0 && <p>{tAccount('noUpcomingClasses')}</p>}
                {!loading && items && items.length > 0 && (
                    <ul className={styles.upcomingClassesList}>
                        {items.map((it) => (
                            <li key={`${it.classId}_${it.date}`} className={styles.upcomingClassItem}>
                                <Link href={`/schedule/${it.classId}?date=${it.date}`}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                        <div>{toReadable(it.date, locale)}</div>
                                        <div>{it.classSnapshot?.startTime} - {it.classSnapshot?.endTime}</div>
                                        <div>{lang === 'he' ? it.classSnapshot?.title?.he : it.classSnapshot?.title?.en}</div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
            <ActionFooter direction="row">
                <AppButton variant="secondary" href="/account">{tAccount('myAccount')}</AppButton>
                <AppButton variant="secondary" href="/schedule">{tSchedule('schedule')}</AppButton>
            </ActionFooter>
        </>
    );
}


