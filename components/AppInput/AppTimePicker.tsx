"use client";

import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './AppInput.module.css';

type AppTimePickerProps = {
    value?: string; // HH:mm
    onChange?: (value: string) => void;
    stepMinutes?: number; // default 15
    start?: string; // inclusive, HH:mm
    end?: string;   // inclusive, HH:mm
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
};

function toMinutes(hhmm: string): number {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}

function fromMinutes(total: number): string {
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function AppTimePicker({ value, onChange, stepMinutes = 15, start = '06:00', end = '23:00', placeholder = 'Select time', disabled, className, containerClassName }: AppTimePickerProps) {
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    const options: string[] = [];
    for (let t = startMin; t <= endMin; t += stepMinutes) {
        options.push(fromMinutes(t));
    }

    return (
        <div className={containerClassName}>
            <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
                <Select.Trigger className={[styles.appInput, styles.appSelect, className].filter(Boolean).join(' ')} aria-label="Time">
                    <span className={styles.selectValue}>
                        <Select.Value placeholder={placeholder} />
                    </span>
                    <Select.Icon className={styles.selectChevron}>▾</Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                    <Select.Content className={styles.selectContent} position="popper" sideOffset={6} align="start">
                        <Select.Viewport className={styles.selectViewport}>
                            {options.map((opt) => (
                                <Select.Item key={opt} value={opt} className={styles.selectItem}>
                                    <Select.ItemText>{opt}</Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
}


