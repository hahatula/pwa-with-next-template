'use client';
import styles from './page.module.css';
import RequireAuth from '@/components/guards/RequireAuth';
import Header from '@/components/Header';
import Day from '@/components/Day';
import { useRef, useEffect, useState } from 'react';
import AppButton from '@/components/AppButton';
import type { ClassDoc } from '@/lib/types';
import useWeeklyClasses from '@/hooks/useWeeklyClasses';
import { toYmd } from '@/lib/utils/date';
import Loader from '@/components/Loader';
import useHorizontalSwipe from '@/hooks/useHorizontalSwipe';
import { useI18n } from '@/lib/i18n';
import ListIcon from '@/components/icons/displayStyle/List';
import GridIcon from '@/components/icons/displayStyle/Grid';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useScheduleStyle } from '@/contexts/DisplayPreferencesProvider';

export default function SchedulePage() {
    return (
        <RequireAuth>
            <div className='pageLayout'>
                <Header />
                <ScheduleInner />
            </div>
        </RequireAuth>
    );
}

function ScheduleInner() {
    const [weekOffset, setWeekOffset] = useState<0 | 1>(0); // 0 = current week, 1 = next week
    const { days, classesByDate, loading } = useWeeklyClasses(weekOffset);
    const swipeHandlers = useHorizontalSwipe({
        onSwipeLeft: () => { if (weekOffset === 0) setWeekOffset(1); },
        onSwipeRight: () => { if (weekOffset === 1) setWeekOffset(0); },
    });

    // Add refs for today's element
    const todayRef = useRef<HTMLDivElement>(null);
    const hasScrolled = useRef(false);

    // Add useEffect to scroll to today
    useEffect(() => {
        if (!loading && todayRef.current && !hasScrolled.current && weekOffset === 0) {
            todayRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            hasScrolled.current = true;
        }
    }, [loading, weekOffset]);

    function classesForDate(day: Date): ClassDoc[] {
        const ymd = toYmd(day);
        return classesByDate[ymd] || [];
    }

    // Helper to check if day is today
    function isToday(day: Date): boolean {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return (
            day.getFullYear() === today.getFullYear() &&
            day.getMonth() === today.getMonth() &&
            day.getDate() === today.getDate()
        );
    }

    const { t: tSchedule } = useI18n('schedule');
    const { t: tWeek } = useI18n('week');
    const { lang } = useLanguage();
    const { scheduleStyle, setScheduleStylePreference } = useScheduleStyle();

    return (
        <main className='innerPageMain'>
            <h1>{tSchedule('schedule')}</h1>
            <div className={`${styles.subtitleWrapper} ${lang === 'he' ? styles.reverse : ''}`}>
                <p>{tSchedule('chooseYourClass')}</p>
                <div className={styles.displayStyleSwitcher}>
                    <AppButton variant="ghost" disabled={scheduleStyle === 'list'} onClick={() => setScheduleStylePreference('list')}><ListIcon /></AppButton>
                    <AppButton variant="ghost" disabled={scheduleStyle === 'grid'} onClick={() => setScheduleStylePreference('grid')}><GridIcon /></AppButton>
                </div>
            </div>
            <div
                className={styles.scheduleWrapper}
                {...swipeHandlers}
            >
                <div className={styles.tabs}>
                    <AppButton
                        type="button"
                        variant={weekOffset === 0 ? 'activeTab' : 'inactiveTab'}
                        onClick={() => setWeekOffset(0)}
                    >
                        {tWeek('currentWeek')}
                    </AppButton>
                    <AppButton
                        variant={weekOffset === 1 ? 'activeTab' : 'inactiveTab'}
                        type="button"
                        onClick={() => setWeekOffset(1)}
                    >
                        {tWeek('nextWeek')}
                    </AppButton>
                </div>
                {loading ? <Loader center="screen" /> : (
                    <div className={`${styles.daysGrid} ${scheduleStyle === 'list' ? styles.list : ''}`}>
                        {days.map((day) => (
                            <Day key={day.toISOString()}
                                day={day}
                                classes={classesForDate(day)}
                                ref={isToday(day) ? todayRef : undefined} />
                        ))}
                    </div>)}
            </div>
        </main>
    );
}