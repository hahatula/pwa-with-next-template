"use client";

import * as React from 'react';
import ClassDetailsForm from '../../forms/ClassDetails';
import { useI18n } from "@/lib/i18n";

type EditClassModalProps = {
    classId: string;
    initial?: any;
    onSubmit?: (values: any, existingId?: string) => void;
    onClose: () => void;
};

export default function EditClassModal({ classId, initial, onSubmit, onClose }: EditClassModalProps) {
    const { t: tClasses } = useI18n('classes');
    const { t: tCommon } = useI18n('common');
    
    return (
        <div>
            <h2 style={{ marginBottom: 12 }}>{classId === 'new' ? tClasses('addNewClass') : tClasses('editClass')}</h2>
            <ClassDetailsForm
                initial={initial ?? null}
                onCancel={onClose}
                onSubmit={(values) => {
                    onSubmit?.(values, classId === 'new' ? undefined : classId);
                    onClose();
                }}
            />
        </div>
    );
}


