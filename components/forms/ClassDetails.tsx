import styles from './forms.module.css';
import { useState } from "react";
import AppButton from "../AppButton";
import AppInput from "../AppInput";
import { levels, types, levelKey, typeKey, weekdays, weekdayKey } from "@/lib/values/dropdowns";
import { useI18n } from "@/lib/i18n";
import type { ClassLevel, ClassType, ClassFormData } from "@/lib/types";

type ClassFormProps = {
    initial: Partial<ReturnType<typeof createEmptyClass>> | null;
    onCancel: () => void;
    onSubmit: (values: ClassFormData) => void;
};

function getTodayLocalDateString() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function createEmptyClass() {
    return {
        id: '',
        title: { en: '', he: '' },
        coach: { en: '', he: '' },
        level: 'All Levels' as ClassLevel,
        type: 'Gi' as ClassType,
        repeated: true,
        active: true,
        weekday: 0,
        startDate: getTodayLocalDateString(),
        date: '',
        startTime: '19:00',
        endTime: '20:00',
        createdBy: undefined as string | undefined,
        updatedBy: undefined as string | undefined,
        createdAt: undefined as unknown,
        updatedAt: undefined as unknown,
    };
}

export default function ClassDetailsForm({ initial, onCancel, onSubmit }: ClassFormProps) {
    const { t: tClasses } = useI18n('classes');
    const { t: tCommon } = useI18n('common');
    const { t: tWeek } = useI18n('week');

    const empty = createEmptyClass();
    type FormState = ReturnType<typeof createEmptyClass>;
    const [form, setForm] = useState<FormState>(initial ? { ...empty, ...initial } : empty);

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev: FormState) => ({ ...prev, [key]: value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Basic validation
        if (!form.title.en || !form.title.he) return;
        if (!form.coach.en || !form.coach.he) return;
        if (form.repeated) {
            // weekday must be 0-6; startDate optional
            if (form.weekday == null) return;
        } else {
            if (!form.date) return;
        }
        if (!form.startTime || !form.endTime) return;

        const toSave = {
            title: form.title,
            coach: form.coach,
            level: form.level,
            type: form.type,
            repeated: form.repeated,
            active: form.active ?? true,
            weekday: form.repeated ? form.weekday : undefined,
            startDate: form.repeated ? form.startDate || undefined : undefined,
            date: !form.repeated ? form.date : undefined,
            startTime: form.startTime,
            endTime: form.endTime,
        } as const;
        onSubmit(toSave);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.classDetailsFormGrid} >
                <div>
                    <label>{tClasses('title')} (EN)*
                        <AppInput
                            type="text"
                            value={form.title.en}
                            onChange={(e) => update('title', { ...form.title, en: e.target.value })}
                            lang="en"
                            dir="ltr"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>{tClasses('title')} (HE)*
                        <AppInput
                            type="text"
                            value={form.title.he}
                            onChange={(e) => update('title', { ...form.title, he: e.target.value })}
                            lang="he"
                            dir="rtl"
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>{tClasses('coach')} (EN)*
                        <AppInput
                            type="text"
                            value={form.coach.en}
                            onChange={(e) => update('coach', { ...form.coach, en: e.target.value })}
                            lang="en"
                            dir="ltr"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>{tClasses('coach')} (HE)*
                        <AppInput
                            type="text"
                            value={form.coach.he}
                            onChange={(e) => update('coach', { ...form.coach, he: e.target.value })}
                            lang="he"
                            dir="rtl"
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>{tClasses('level')}
                        <AppInput
                            value={form.level}
                            onChange={(e) => update('level', e.target.value as typeof form.level)}
                            style={{ width: '100%', marginTop: 4 }}
                        >
                            {levels.map((lvl) => (
                                <option key={lvl} value={lvl}>{tClasses(levelKey[lvl])}</option>
                            ))}
                        </AppInput>
                    </label>
                </div>
                <div>
                    <label>{tClasses('type')}
                        <AppInput
                            value={form.type}
                            onChange={(e) => update('type', e.target.value as typeof form.type)}
                            style={{ width: '100%', marginTop: 4 }}
                        >
                            {types.map((t) => (
                                <option key={t} value={t}>{tClasses(typeKey[t])}</option>
                            ))}
                        </AppInput>
                    </label>
                </div>

                <div className={styles.classDetailsCheckboxRow} >
                    <label className={styles.classDetailsCheckboxLabel} >
                        <AppInput
                            type="checkbox"
                            checked={form.repeated}
                            onChange={(e) => update('repeated', (e.target as HTMLInputElement).checked)}
                        />
                        {tClasses('repeatedWeekly')}
                    </label>
                    <label className={styles.classDetailsCheckboxLabel} >
                        <AppInput
                            type="checkbox"
                            checked={form.active ?? true}
                            onChange={(e) => update('active', (e.target as HTMLInputElement).checked)}
                        />
                        {tClasses('active')}
                    </label>
                </div>

                {form.repeated ? (
                    <>
                        <div>
                            <label>{tClasses('startDate')}
                                <AppInput
                                    type="date"
                                    value={form.startDate || ''}
                                    onChange={(e) => update('startDate', e.target.value)}
                                />
                            </label>
                        </div>
                        <div>
                            <label>{tClasses('weekday')}
                                <AppInput
                                    value={form.weekday}
                                    onChange={(e) => update('weekday', Number(e.target.value))}
                                    style={{ width: '100%', marginTop: 4 }}
                                >
                                    {weekdays.map((w, i) => (
                                        <option key={w} value={i}>{tWeek(weekdayKey[w as keyof typeof weekdayKey])}</option>
                                    ))}
                                </AppInput>
                            </label>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label>{tClasses('eventDate')}*
                                <AppInput
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => update('date', e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div />
                    </>
                )}

                <div>
                    <label>{tClasses('startTime')}
                        <AppInput
                            type="time"
                            value={form.startTime}
                            onChange={(e) => update('startTime', e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>{tClasses('endTime')}
                        <AppInput
                            type="time"
                            value={form.endTime}
                            onChange={(e) => update('endTime', e.target.value)}
                            required
                        />
                    </label>
                </div>
            </div>

            <div className={styles.formActions} >
                <AppButton variant="secondary" type="button" onClick={onCancel}>{tCommon('cancel')}</AppButton>
                <AppButton type="submit">{tCommon('save')}</AppButton>
            </div>
        </form>
    );
}