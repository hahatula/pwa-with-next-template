"use client";
import { useEffect, useState } from 'react';
import type { ClassDoc } from '@/app/admin/classes/page';
import styles from './Day.module.css';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useI18n } from '@/lib/i18n';
import { getClassTypeIcon, getLevelIcon, getLocalizedLevel, getLocalizedType } from '@/lib/i18n/classFormat';
import { toYmd } from '@/lib/utils/date';
import { useAuth } from '@/contexts/AuthProvider';
import InfoTag from '../InfoTag';

export default function DayClassItem(props: ClassDoc & { day: Date }) {
    const c = props as ClassDoc;
    const [isBooked, setIsBooked] = useState(false);
    const { lang } = useLanguage();
    const { t: tClasses } = useI18n('classes');
    const { user } = useAuth();

    const localizedLevel = getLocalizedLevel(c.level, tClasses);
    const localizedType = getLocalizedType(c.type, tClasses);
    const dateParam = toYmd(props.day);

    useEffect(() => {
        let active = true;
        async function load() {
            if (!user) { setIsBooked(false); return; }
            try {
                const token = await user.getIdToken();
                const res = await fetch(`/api/classes/${c.id}/attendance?date=${dateParam}`, {
                    headers: { authorization: `Bearer ${token}` },
                });
                if (!active) return;
                if (!res.ok) { setIsBooked(false); return; }
                const data = await res.json();
                const attendees: Array<{ uid: string }> = Array.isArray(data.attendees) ? data.attendees : [];
                setIsBooked(attendees.some((a) => a.uid === user.uid));
            } catch {
                if (active) setIsBooked(false);
            }
        }
        load();
        return () => { active = false; };
    }, [user, c.id, dateParam]);

    const LevelIcon = getLevelIcon(c.level);
    const TypeIcon = getClassTypeIcon(c.type);

    return (
        <li className={styles.dayClass} key={c.id}>
            <Link href={`/schedule/${c.id}?date=${dateParam}`}>
                <div className={styles.dciWrapper}>
                    <div className={styles.dciTime}>
                        <p>{c.startTime} - {c.endTime}</p>{isBooked && <span className={styles.dciTimeBooked}></span>}
                    </div>
                    <div className={`${styles.dciInfoWrapper} ${lang === 'he' ? styles.reverse : ''}`}>
                        <div className={styles.dciInfo}>
                            <p className={styles.dciInfoTitle}>{lang === 'he' ? c.title.he : c.title.en}</p>
                            <p className={styles.dciInfoCoach}>{lang === 'he' ? c.coach.he : c.coach.en}</p>
                        </div>
                        <div className={`${styles.dciInfo} ${styles.dciInfoTags}`}>
                            <InfoTag icon={TypeIcon && <TypeIcon />} label={localizedType} />
                            <InfoTag icon={LevelIcon && <LevelIcon />} label={localizedLevel} />
                        </div>
                    </div>
                </div>
            </Link>
        </li>
    )
}