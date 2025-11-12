'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import RequireAuth from '@/components/guards/RequireAuth';
import { useAuth } from '@/contexts/AuthProvider';
import type { ClassDoc } from '@/app/admin/classes/page';
import AppButton from '@/components/AppButton';
import { useLanguage } from '@/contexts/LanguageProvider';
import * as Avatar from '@radix-ui/react-avatar';
import { useI18n } from '@/lib/i18n';
import Loader from '@/components/Loader';
import styles from './page.module.css';
import { getLocalizedLevel, getLocalizedType, getClassTypeIcon, getLevelIcon, } from '@/lib/i18n/classFormat';
import InfoTag from '@/components/InfoTag';


type Attendee = { uid: string; name?: string; photoURL?: string };

export default function ScheduleClassPage() {
    return (
        <RequireAuth>
            <div className='pageLayout'>
                <Header />
                <ScheduleClassInner />
            </div>
        </RequireAuth>
    );
}

function ScheduleClassInner() {
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const { lang } = useLanguage();
    const { t: tSchedule } = useI18n('schedule');
    const { t: tCommon } = useI18n('common');
    const { t: tClasses } = useI18n('classes');
    const { t: tWeek } = useI18n('week');
    const classId = params?.id as string;
    const date = searchParams.get('date') || '';

    const [classEntity, setClassEntity] = useState<ClassDoc | null>(null);
    const [attendees, setAttendees] = useState<Attendee[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const isBooked = useMemo(() => {
        if (!user || !attendees) return false;
        return attendees.some((a) => a.uid === user.uid);
    }, [attendees, user]);

    const localizedLevel = getLocalizedLevel(classEntity?.level ?? 'All Levels', tClasses);
    const localizedType = getLocalizedType(classEntity?.type ?? 'Gi', tClasses);
    const weekdayKey = ['sunShort', 'monShort', 'tueShort', 'wedShort', 'thuShort', 'friShort', 'satShort'][classEntity?.weekday ?? 0];

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                setLoading(true);
                // class details
                const res = await fetch(`/api/classes/${classId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (active) setClassEntity(data as ClassDoc);
                } else if (active) {
                    setClassEntity(null);
                }
                // attendees
                if (user && date) {
                    const token = await user.getIdToken();
                    const ar = await fetch(`/api/classes/${classId}/attendance?date=${date}`, { headers: { authorization: `Bearer ${token}` } });
                    if (ar.ok) {
                        const data = await ar.json();
                        if (active) setAttendees((data.attendees || []) as Attendee[]);
                    } else if (active) {
                        setAttendees([]);
                    }
                } else {
                    if (active) setAttendees([]);
                }
            } finally {
                if (active) setLoading(false);
            }
        }
        if (classId) load();
        return () => { active = false; };
    }, [classId, user, date]);

    async function handleSignUp() {
        if (!user || !date) return;
        try {
            setSaving(true);
            const token = await user.getIdToken();
            const res = await fetch(`/api/classes/${classId}/attendance`, {
                method: 'POST',
                headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
                body: JSON.stringify({ date }),
            });
            if (res.ok) {
                // refresh attendees
                const ar = await fetch(`/api/classes/${classId}/attendance?date=${date}`, { headers: { authorization: `Bearer ${token}` } });
                if (ar.ok) {
                    const data = await ar.json();
                    setAttendees((data.attendees || []) as Attendee[]);
                }
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleCancel() {
        if (!user || !date) return;
        try {
            setSaving(true);
            const token = await user.getIdToken();
            const res = await fetch(`/api/classes/${classId}/attendance?date=${date}`, {
                method: 'DELETE',
                headers: { authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                // refresh attendees
                const ar = await fetch(`/api/classes/${classId}/attendance?date=${date}`, { headers: { authorization: `Bearer ${token}` } });
                if (ar.ok) {
                    const data = await ar.json();
                    setAttendees((data.attendees || []) as Attendee[]);
                }
            }
        } finally {
            setSaving(false);
        }
    }

    if (!date) {
        return (
            <main className='innerPageMain'>
                <h1>Class</h1>
                <p>Missing date. Please navigate from schedule.</p>
            </main>
        );
    }

    const LevelIcon = getLevelIcon(classEntity?.level ?? 'All Levels');
    const TypeIcon = getClassTypeIcon(classEntity?.type ?? 'Gi');

    return (
        <main className='innerPageMain'>
            <div className={styles.classInfo}>

                <div className={styles.classInfoTime}>
                    <p>{date} ({tWeek(weekdayKey)})</p>
                    <p>{classEntity?.startTime} - {classEntity?.endTime}</p>
                </div>

                <div className={styles.infoTags}>
                    <InfoTag icon={TypeIcon && <TypeIcon />} label={localizedType} /> ·{' '}
                    <InfoTag icon={LevelIcon && <LevelIcon />} label={localizedLevel} />
                </div>
                <div className={styles.classItemHeader}>
                    <h1 className={styles.classItemTitle}>
                        {lang === 'he' ? classEntity?.title.he : classEntity?.title.en} {' '}
                        <span className={styles.classItemCoach}>
                            ({tClasses('coach')}: {lang === 'he' ? classEntity?.coach.he : classEntity?.coach.en})
                        </span>
                    </h1>
                </div>

                <div className={styles.classInfoButtons}>
                    {!isBooked ? (
                        <AppButton type="button" onClick={handleSignUp} disabled={saving}>{tCommon('signup')}</AppButton>
                    ) : (
                        <>
                            <p>{tSchedule('youAreSignedUp')}</p>
                            <AppButton type="button" variant="secondary" onClick={handleCancel} disabled={saving}>{tCommon('cancel')}</AppButton>
                        </>
                    )}
                </div>
            </div>
            <section className={styles.participantsSection}>

                {loading && <Loader center="screen" />}
                {!loading && attendees && attendees.length === 0 && <p>{tSchedule('noParticipantsYet')}</p>}
                {!loading && attendees && attendees.length > 0 && (
                    <>
                        <h2>{tSchedule('participants')}</h2>
                        <ul className={styles.participantsList}>
                            {attendees.map((a) => (
                                <li key={a.uid} className={styles.participantItem}>
                                    <Avatar.Root className={styles.participantAvatar}>
                                        <Avatar.Image src={a.photoURL} alt={a.name || a.uid} className={styles.participantImage} />
                                        <Avatar.Fallback delayMs={200} className={styles.participantFallback}>
                                            {(a.name || a.uid).slice(0, 1).toUpperCase()}
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                    <span>{a.name || a.uid}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </section>
        </main>
    );
}


