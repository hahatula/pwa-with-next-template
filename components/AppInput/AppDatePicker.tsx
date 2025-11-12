"use client";

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import styles from './AppInput.module.css';

type AppDatePickerProps = {
    value?: string; // yyyy-mm-dd
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    dir?: 'ltr' | 'rtl';
};

function formatDateToYMD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function parseYMD(value?: string): Date | undefined {
    if (!value) return undefined;
    const [y, m, d] = value.split('-').map(Number);
    if (!y || !m || !d) return undefined;
    const dt = new Date(y, m - 1, d);
    return isNaN(dt.getTime()) ? undefined : dt;
}

export default function AppDatePicker({ value, onChange, placeholder = 'Select date', disabled, className, containerClassName, dir }: AppDatePickerProps) {
    const selected = parseYMD(value);

    const [open, setOpen] = React.useState(false);

    function handleSelect(day?: Date) {
        if (!day) return;
        const ymd = formatDateToYMD(day);
        onChange?.(ymd);
        setOpen(false);
    }

    return (
        <div className={containerClassName}>
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={[styles.appInput, styles.appSelect, className].filter(Boolean).join(' ')}
                    >
                        <span className={styles.selectValue}>{selected ? value : placeholder}</span>
                    </button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content className={styles.selectContent} sideOffset={6} align="start">
                        <div className={styles.dayPicker}>
                            <DayPicker
                                mode="single"
                                selected={selected}
                                onSelect={handleSelect}
                                weekStartsOn={0}
                                dir={dir}
                            />
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
}


