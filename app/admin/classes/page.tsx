'use client';
import styles from './classes.module.css';
import RequireAdmin from '@/components/guards/RequireAdmin';
import Header from '@/components/Header';
import AppButton from '@/components/AppButton';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import Loader from '@/components/Loader';
import { useModal } from '@/components/modals/useModal';
import { useI18n } from "@/lib/i18n";
import ClassItem from '@/components/ClassItem';
import useHorizontalSwipe from '@/hooks/useHorizontalSwipe';

// Shared types for this module
type LocalizedText = { en: string; he: string };
export type ClassLevel = 'Kids' | 'Beginner' | 'All Levels' | 'Advanced';
export type ClassType = 'Gi' | 'No-Gi' | 'Open Mat' | 'MMA';

export type ClassDoc = {
    id: string;
    title: LocalizedText;
    coach: LocalizedText;
    level: ClassLevel;
    type: ClassType;
    repeated: boolean;
    active?: boolean;
    // Repeated fields
    weekday?: number; // 0-6 (Sun-Sat)
    startDate?: string; // YYYY-MM-DD (first occurrence not earlier than this)
    // Unique fields
    date?: string; // YYYY-MM-DD
    // Common time fields
    startTime: string; // HH:MM (24h)
    endTime: string;   // HH:MM (24h)
    // Audit
    createdBy?: string;
    updatedBy?: string;
    createdAt?: unknown;
    updatedAt?: unknown;
};

export default function AdminPage() {
    return (
        <RequireAdmin>
            <div className='pageLayout'>
                <Header />
                <ClassesInner />
            </div>
        </RequireAdmin>
    );
}

function ClassesInner() {
    const { t: tClasses } = useI18n('classes');
    const { t: tCommon } = useI18n('common');

    const { user } = useAuth();
    const { openModal } = useModal();

    const [classes, setClasses] = useState<ClassDoc[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'active' | 'outdated'>('active');
    const swipeHandlers = useHorizontalSwipe({
        onSwipeLeft: () => { if (tab === 'active') setTab('outdated'); },
        onSwipeRight: () => { if (tab === 'outdated') setTab('active'); },
    });


    useEffect(() => {
        let active = true;
        async function load() {
            if (!user) { setClasses(null); setLoading(false); return; }
            try {
                setLoading(true);
                const token = await user.getIdToken();
                const res = await fetch('/api/classes', {
                    method: 'GET',
                    headers: { 'authorization': `Bearer ${token}` },
                });
                if (!res.ok) { throw new Error('Failed to fetch classes'); }
                const data = await res.json();
                if (!active) return;
                setClasses((data.items || []) as ClassDoc[]);
            } catch (_e) {
                if (!active) return;
                setClasses([]);
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => { active = false; };
    }, [user]);

    const todayStr = useMemo(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = `${now.getMonth() + 1}`.padStart(2, '0');
        const d = `${now.getDate()}`.padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, []);

    const filtered = useMemo(() => {
        if (!classes) return null;
        const isActive = (c: ClassDoc) => c.active !== false;
        if (tab === 'active') {
            return classes.filter((c) => isActive(c) && (c.repeated || (!!c.date && c.date >= todayStr)));
        }
        return classes.filter((c) => !isActive(c) || (!c.repeated && !!c.date && c.date < todayStr));
    }, [classes, tab, todayStr]);

    async function handleCreate(values: Omit<ClassDoc, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) {
        if (!user) return;
        const token = await user.getIdToken();
        try {
            const res = await fetch('/api/classes', {
                method: 'POST',
                headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error('Failed to create class');
        } catch {
            console.error('Failed to create class');
        }
        await reload();
    }

    async function handleUpdate(values: Omit<ClassDoc, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>, id?: string) {
        if (!user) return;
        if (!id) throw new Error('id is required');
        try {
            const token = await user.getIdToken();
            const res = await fetch(`/api/classes/${id}`, {
                method: 'PUT',
                headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error('Failed to update class');
            await reload();
        } catch {
            console.error('Failed to update class');
        }
    }

    async function handleDelete(id: string) {
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`/api/classes/${id}`, { method: 'DELETE', headers: { 'authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error('Failed to delete class');
        await reload();
    }

    async function reload() {
        if (!user) return;
        try {
            const token = await user.getIdToken();
            const res = await fetch('/api/classes', { headers: { 'authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('reload failed');
            const data = await res.json();
            setClasses((data.items || []) as ClassDoc[]);
        } catch {
            console.error('Failed to delete class');
        }
    }

    return (
        <main className='innerPageMain'>
            <h1>{tClasses('manageClasses')}</h1>
            <AppButton onClick={() => { openModal({ id: 'editClass', props: { classId: 'new', onSubmit: handleCreate } }); }}>{tClasses('addNewClass')}</AppButton>

            <div className={styles.classesListWrapper} {...swipeHandlers}>
                <div className={styles.classesTabs}>
                    <AppButton variant={tab === 'active' ? 'activeTab' : 'inactiveTab'} onClick={() => setTab('active')}>{tClasses('active')}</AppButton>
                    <AppButton variant={tab === 'outdated' ? 'activeTab' : 'inactiveTab'} onClick={() => setTab('outdated')}>{tClasses('outdated')}</AppButton>
                </div>

                {(filtered === null || loading) && <Loader center="screen" />}
                {filtered !== null && filtered.length === 0 && <p>{tClasses('noClassesFound')}</p>}

                {filtered !== null && filtered.length > 0 && (
                    <ul className={styles.classesList}>
                        {filtered.map((c) => (
                            <ClassItem key={c.id} c={c} handleUpdate={handleUpdate} handleDelete={handleDelete} />
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}
