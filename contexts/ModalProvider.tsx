"use client";

import * as React from 'react';
import BaseModal from '../components/modals/BaseModal';
import { ModalContext, ModalId, ModalRegistry } from '../components/modals/useModal';
import ConfirmDialog from '../components/modals/dialogs/ConfirmDialog';
import EditClassModal from '../components/modals/dialogs/EditClassModal';

type ActiveModal = { id: ModalId; props: any } | null;

export default function ModalProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = React.useState<ActiveModal>(null);

    const openModal = React.useCallback(<K extends ModalId>(args: { id: K; props: ModalRegistry[K] }) => {
        setActive(args);
    }, []);

    const replaceModal = openModal;

    const closeModal = React.useCallback(() => setActive(null), []);

    return (
        <ModalContext.Provider value={{ openModal, replaceModal, closeModal, active }}>
            {children}
            {active && (
                <BaseModal open={true} onOpenChange={(o) => (!o ? closeModal() : null)}>
                    {active.id === 'confirm' && (
                        <ConfirmDialog {...active.props} onClose={closeModal} />
                    )}
                    {active.id === 'editClass' && (
                        <EditClassModal {...active.props} onClose={closeModal} />
                    )}
                </BaseModal>
            )}
        </ModalContext.Provider>
    );
}


