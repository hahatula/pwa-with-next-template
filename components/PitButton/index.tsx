"use client";

import styles from "./PitButton.module.css";
import Link from "next/link";
import React from "react";

type PitButtonCommonProps = {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "gradient";
    disabled?: boolean;
    className?: string;
    fullWidth?: boolean;
};

type PitButtonAsButtonProps = PitButtonCommonProps &
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "disabled"> & {
        href?: undefined;
        type?: "button" | "submit" | "reset";
        onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    };

type PitButtonAsLinkProps = PitButtonCommonProps &
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
        href: string;
        prefetch?: boolean;
        replace?: boolean;
        scroll?: boolean;
    };

export type PitButtonProps = PitButtonAsButtonProps | PitButtonAsLinkProps;

export default function PitButton(props: PitButtonProps) {
    const {
        children,
        variant = "primary",
        disabled = false,
        className,
        ...rest
    } = props as PitButtonProps & { [key: string]: unknown };

    const computedClassName = [
        styles.pitButton,
        styles[variant],
        disabled && styles.isDisabled,
        className
    ].filter(Boolean).join(" ");

    if ("href" in props && typeof props.href === "string") {
        const {
            href,
            target,
            rel,
            prefetch,
            replace,
            scroll,
            onClick,
            ...anchorRest
        } = props as PitButtonAsLinkProps;

        if (disabled) {
            return (
                <span
                    className={computedClassName}
                    aria-disabled="true"
                    role="link"
                    data-variant={variant}
                >
                    {children}
                </span>
            );
        }

        const safeRel = target === "_blank" ? rel ?? "noopener noreferrer" : rel;

        return (
            <Link
                href={href}
                prefetch={prefetch}
                replace={replace}
                scroll={scroll}
                className={computedClassName}
                target={target}
                rel={safeRel}
                onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
                data-variant={variant}
                {...anchorRest}
            >
                {children}
            </Link>
        );
    }

    const { type = "button", onClick, ...buttonRest } = rest as PitButtonAsButtonProps;

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={computedClassName}
            data-variant={variant}
            {...buttonRest}
        >
            {children}
        </button>
    );
}