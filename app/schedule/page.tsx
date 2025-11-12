'use client';
import styles from './page.module.css';
import RequireAuth from '@/components/guards/RequireAuth';
import Header from '@/components/Header';
import Day from '@/components/Day';
import { useState } from 'react';
import AppButton from '@/components/AppButton';
import type { ClassDoc } from '@/app/admin/classes/page';
import useWeeklyClasses from '@/hooks/useWeeklyClasses';
import { toYmd } from '@/lib/utils/date';
import Loader from '@/components/Loader';
import useHorizontalSwipe from '@/hooks/useHorizontalSwipe';
import { useI18n } from '@/lib/i18n';
import ListIcon from '@/components/icons/displayStyle/List';
import GridIcon from '@/components/icons/displayStyle/Grid';
import { useLanguage } from '@/contexts/LanguageProvider';

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

    function classesForDate(day: Date): ClassDoc[] {
        const ymd = toYmd(day);
        return classesByDate[ymd] || [];
    }

    const { t: tSchedule } = useI18n('schedule');
    const { t: tWeek } = useI18n('week');
    const { lang } = useLanguage();

    const [displayStyle, setDisplayStyle] = useState<'grid' | 'list'>('grid');

    return (
        <main className='innerPageMain'>
            <h1>{tSchedule('schedule')}</h1>
            <div className={`${styles.subtitleWrapper} ${lang === 'he' ? styles.reverse : ''}`}>
                <p>{tSchedule('chooseYourClass')}</p>
                <div className={styles.displayStyleSwitcher}>
                    <AppButton variant="ghost" disabled={displayStyle === 'list'} onClick={() => setDisplayStyle('list')}><ListIcon /></AppButton>
                    <AppButton variant="ghost" disabled={displayStyle === 'grid'} onClick={() => setDisplayStyle('grid')}><GridIcon /></AppButton>
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
                    <div className={`${styles.daysGrid} ${displayStyle === 'list' ? styles.list : ''}`}>
                        {days.map((day) => (
                            <Day key={day.toISOString()} day={day} classes={classesForDate(day)} />
                        ))}
                    </div>)}
            </div>
        </main>
    );
}