"use client";

import * as React from 'react';
import type { ClassFormData } from '@/lib/types';

export type ModalId = 'confirm' | 'editClass';

export type ModalRegistry = {
    confirm: {
        title: string;
        description?: string;
        confirmText?: string;
        cancelText?: string;
        onConfirm?: () => void;
    };
    editClass: {
        classId: string;
        initial?: Partial<ClassFormData>;
        onSubmit?: (values: ClassFormData, id?: string) => void;
    };
};

type ActiveModal<K extends ModalId = ModalId> = { 
    id: K; 
    props: ModalRegistry[K] 
} | null;

export const ModalContext = React.createContext<{
    openModal: <K extends ModalId>(args: { id: K; props: ModalRegistry[K] }) => void;
    replaceModal: <K extends ModalId>(args: { id: K; props: ModalRegistry[K] }) => void;
    closeModal: () => void;
    active: ActiveModal;
} | null>(null);

export function useModal() {
    const ctx = React.useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within ModalProvider');
    return ctx;
}


