'use client';

import type { ClassDoc } from '@/lib/types';
import AppButton from '../AppButton';
import styles from './ClassItem.module.css';
import { useModal } from '@/components/modals/useModal';
import { useI18n } from '@/lib/i18n';
import { getLocalizedLevel, getLocalizedType } from '@/lib/i18n/classFormat';

type ClassItemProps = {
    c: ClassDoc;
    handleUpdate: (values: Omit<ClassDoc, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>, id?: string) => void;
    handleDelete: (id: string) => void;
};

export default function ClassItem({ c, handleUpdate, handleDelete }: ClassItemProps) {
    const { openModal } = useModal();
    const { t: tCommon } = useI18n('common');
    const { t: tClasses } = useI18n('classes');
    const { t: tWeek } = useI18n('week');
    const localizedLevel = getLocalizedLevel(c.level, tClasses);
    const localizedType = getLocalizedType(c.type, tClasses);
    const weekdayKey = ['sunShort', 'monShort', 'tueShort', 'wedShort', 'thuShort', 'friShort', 'satShort'][c.weekday ?? 0];

    return (
        <li className={styles.classItem} key={c.id}>
            <div className={styles.classItemHeader}>
                <div className={styles.classItemTitle}>
                    {c.title.en} / {c.title.he} {' '}
                    <span className={styles.classItemCoach}>
                        ({tClasses('coach')}: {c.coach.en} / {c.coach.he})
                    </span>
                </div>
            </div>
            <div className='devider'></div>
            <div>
                <span>{localizedType}</span> · <span>{localizedLevel}</span>
            </div>
            <div>
                {c.repeated ? (
                    <span>
                        {tClasses('repeatedWeekly')}: {tWeek(weekdayKey)}
                    </span>
                ) : (
                    <span>{tClasses('eventDate')}: {c.date}</span>
                )}
            </div>
            <div>
                {c.startTime} - {c.endTime}
            </div>
            <div className={styles.classItemButtons}>
                <AppButton
                    variant="secondary"
                    onClick={() => { openModal({ id: 'editClass', props: { classId: c.id, initial: c, onSubmit: handleUpdate } }); }}
                >
                    {tCommon('edit')}
                </AppButton>
                <AppButton
                    variant="secondary"
                    onClick={() => openModal({ id: 'confirm', props: { title: 'Delete class', description: 'Are you sure you want to delete this class?', onConfirm: () => handleDelete(c.id) } })}
                >
                    {tCommon('delete')}
                </AppButton>
            </div>
        </li>
    );
}