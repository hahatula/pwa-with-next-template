"use client";

import * as React from 'react';

export type ModalId = 'confirm' | 'editClass';

export type ModalRegistry = {
    confirm: { title: string; description?: string; confirmText?: string; cancelText?: string; onConfirm?: () => void };
    editClass: { classId: string; initial?: any; onSubmit?: (values: any, id?: string) => void };
};

type ActiveModal = { id: ModalId; props: any } | null;

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


