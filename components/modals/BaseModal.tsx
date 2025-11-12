"use client";

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

type BaseModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    ariaLabel?: string;
};

export default function BaseModal({ open, onOpenChange, children, ariaLabel }: BaseModalProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(2px)',
                    }}
                />
                <Dialog.Title />
                <Dialog.Content
                    aria-label={ariaLabel}
                    style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 'min(560px, calc(100vw - 24px))',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        background: 'var(--background)', color: 'var(--foreground)',
                        boxShadow: 'var(--background) 0px 0px 20px 15px'
                    }}
                >
                    {children}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}


