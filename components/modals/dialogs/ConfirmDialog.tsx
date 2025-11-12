"use client";

import * as React from 'react';
import AppButton from '../../AppButton';

type ConfirmDialogProps = {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onClose: () => void;
};

export default function ConfirmDialog({ title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onClose }: ConfirmDialogProps) {
    return (
        <div style={{ display: 'grid', gap: 12 }}>
            <h2 style={{ margin: 0 }}>{title}</h2>
            {description && <p style={{ margin: 0 }}>{description}</p>}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <AppButton variant="secondary" type="button" onClick={onClose}>{cancelText}</AppButton>
                <AppButton type="button" onClick={() => { onConfirm?.(); onClose(); }}>{confirmText}</AppButton>
            </div>
        </div>
    );
}


