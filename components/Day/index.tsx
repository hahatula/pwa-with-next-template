"use client";
import { useLanguage } from '@/contexts/LanguageProvider';
import { useI18n } from '@/lib/i18n';
import styles from './Day.module.css';
import type { ClassDoc } from '@/lib/types';
import DayClassItem from './DayClassItem';
import { useMemo } from 'react';

type DayProps = {
    day: Date;
    classes: ClassDoc[];
};

export default function Day({ day, classes = [] }: DayProps) {
    const { lang } = useLanguage();
    const { t: tClasses } = useI18n('classes');
    const locale = lang === 'he' ? 'he-IL' : 'en-US';

    const weekday = day.toLocaleDateString(locale, { weekday: 'short' });
    const dateStr = day.toLocaleDateString(locale, { month: 'short', day: 'numeric' });

    const today = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }, []);

    function isSameDate(a: Date, b: Date) {
        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        );
    }

    const isPast = day.getTime() < today.getTime();
    const isSaturday = day.getDay() === 6;
    const { t: tCommon } = useI18n('common');
    const className = `${styles.day} ${isSameDate(day, today) ? styles.today : ''} ${isPast ? styles.past : ''}`.trim();
    const containerStyle = isSaturday ? { gridColumn: '1 / -1' } : undefined;

    return (
        <div className={className} style={containerStyle}>
            <div className={styles.dayHeader}>
                <div className={styles.weekday}>{weekday}</div>
                <div className={styles.date}>{dateStr}</div>
            </div>
            {classes.length > 0 ? (
                <ul className={styles.dayClasses}>
                    {classes.map((c) => (
                        <DayClassItem key={c.id} day={day} {...c} />
                    ))}
                </ul>
            ) : (
                <div className={styles.dayClasses}>{(isSaturday && isSameDate(day, today)) ? tCommon('shabbatShalom') : tClasses('noClassesFound').split(' ').slice(0, 2).join(' ')}</div>
            )}
        </div>
    );
}