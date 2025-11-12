"use client";

import * as React from 'react';
import * as Select from '@radix-ui/react-select';
import styles from './AppInput.module.css';
import AppDatePicker from './AppDatePicker';
import AppTimePicker from './AppTimePicker';

type AppInputChangeEvent = React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>;

type AppInputProps = (
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> &
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
        type?: React.HTMLInputTypeAttribute | 'select';
        onChange?: (e: AppInputChangeEvent) => void;
        containerClassName?: string;
        showPasswordToggle?: boolean;
        children?: React.ReactNode;
    }
);

export default function AppInput(props: AppInputProps) {
    const {
        type,
        className,
        containerClassName,
        showPasswordToggle,
        children,
        onChange,
        ...rest
    } = props;

    const isSelect = type === 'select' || (!!children && !type);

    function cx(...parts: Array<string | undefined | false>) {
        return parts.filter(Boolean).join(' ');
    }

    if (isSelect) {
        const selectProps = rest as React.SelectHTMLAttributes<HTMLSelectElement>;
        const optionNodes = React.Children.toArray(children);
        const options = optionNodes
            .map((child) => {
                if (!React.isValidElement(child)) return null;
                const props = child.props as any;
                const value = props?.value ?? '';
                const disabled = !!props?.disabled;
                const label = props?.children ?? String(value);
                return { value: String(value), label, disabled };
            })
            .filter(Boolean) as Array<{ value: string; label: React.ReactNode; disabled: boolean }>;

        const handleValueChange = (val: string) => {
            if (!onChange) return;
            const syntheticEvent = {
                target: { value: val },
                currentTarget: { value: val },
            } as unknown as React.ChangeEvent<HTMLSelectElement>;
            (onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void)(syntheticEvent);
        };

        const value = selectProps.value != null ? String(selectProps.value) : undefined;
        const defaultValue = selectProps.defaultValue != null ? String(selectProps.defaultValue as any) : undefined;

        const placeholder = (rest as any)?.placeholder as string | undefined;
        return (
            <div className={cx(styles.selectWrapper, containerClassName)}>
                <Select.Root
                    value={value}
                    defaultValue={defaultValue}
                    onValueChange={handleValueChange}
                    disabled={!!selectProps.disabled}
                >
                    <Select.Trigger
                        className={cx(styles.appInput, styles.appSelect, className)}
                        aria-label={selectProps['aria-label'] || selectProps.name}
                    >
                        <p className={styles.selectValue}>
                            <Select.Value placeholder={placeholder} />
                        </p>
                        <Select.Icon className={styles.selectChevron}>
                            ▾
                        </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Content className={styles.selectContent} position="popper" sideOffset={6} align="start">
                            <Select.Viewport className={styles.selectViewport}>
                                {options.map((opt) => (
                                    <Select.Item
                                        key={opt.value}
                                        value={opt.value}
                                        disabled={opt.disabled}
                                        className={styles.selectItem}
                                    >
                                        <Select.ItemText>{opt.label}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Viewport>
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </div>
        );
    }

    if (type === 'checkbox') {
        const inputProps = rest as React.InputHTMLAttributes<HTMLInputElement>;
        return (
            <input
                type="checkbox"
                className={cx(styles.appCheckbox, className)}
                onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
                {...inputProps}
            />
        );
    }

    // Custom date picker using Radix Popover + DayPicker
    if (type === 'date') {
        const inputProps = rest as React.InputHTMLAttributes<HTMLInputElement>;
        const handleChange = (val: string) => {
            if (!onChange) return;
            const syntheticEvent = {
                target: { value: val },
                currentTarget: { value: val },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(syntheticEvent);
        };

        return (
            <div className={cx(styles.fieldWrapper, containerClassName)}>
                <AppDatePicker
                    value={(inputProps.value as string | undefined) ?? (inputProps.defaultValue as string | undefined)}
                    onChange={handleChange}
                    placeholder={inputProps.placeholder as string | undefined}
                    disabled={!!inputProps.disabled}
                    className={className}
                    dir={inputProps.dir as 'ltr' | 'rtl' | undefined}
                />
            </div>
        );
    }

    // Custom time picker using Radix Select
    if (type === 'time') {
        const inputProps = rest as React.InputHTMLAttributes<HTMLInputElement>;
        const stepAttr = inputProps.step as number | string | undefined;
        const stepSeconds = typeof stepAttr === 'number' ? stepAttr : stepAttr ? Number(stepAttr) : undefined;
        const stepMinutes = stepSeconds != null && !Number.isNaN(stepSeconds) ? Math.max(1, Math.round(stepSeconds / 60)) : 15;

        const handleChange = (val: string) => {
            if (!onChange) return;
            const syntheticEvent = {
                target: { value: val },
                currentTarget: { value: val },
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(syntheticEvent);
        };

        return (
            <div className={cx(styles.fieldWrapper, containerClassName)}>
                <AppTimePicker
                    value={(inputProps.value as string | undefined) ?? (inputProps.defaultValue as string | undefined)}
                    onChange={handleChange}
                    stepMinutes={stepMinutes}
                    placeholder={inputProps.placeholder as string | undefined}
                    disabled={!!inputProps.disabled}
                    className={className}
                />
            </div>
        );
    }

    const inputProps = rest as React.InputHTMLAttributes<HTMLInputElement>;
    const isPassword = type === 'password';
    const [show, setShow] = React.useState(false);
    const effectiveType = isPassword && showPasswordToggle ? (show ? 'text' : 'password') : type;

    return (
        <div className={cx(styles.fieldWrapper, containerClassName)}>
            <input
                {...inputProps}
                type={effectiveType}
                className={cx(
                    styles.appInput,
                    isPassword ? styles.appPassword : undefined,
                    type === 'date' ? styles.appDate : undefined,
                    type === 'time' ? styles.appTime : undefined,
                    type === 'number' ? styles.appNumber : undefined,
                    type === 'email' ? styles.appEmail : undefined,
                    type === 'tel' ? styles.appTel : undefined,
                    type === 'url' ? styles.appUrl : undefined,
                    type === 'search' ? styles.appSearch : undefined,
                    !type || type === 'text' ? styles.appText : undefined,
                    className
                )}
                onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            />

            {isPassword && showPasswordToggle && (
                <button
                    type="button"
                    className={styles.toggleButton}
                    aria-label={show ? 'Hide password' : 'Show password'}
                    onClick={() => setShow((s) => !s)}
                >
                    {show ? 'Hide' : 'Show'}
                </button>
            )}
        </div>
    );
}