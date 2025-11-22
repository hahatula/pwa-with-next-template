'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { updateName, updatePhone } from '@/services/users';
import { uploadUserAvatar, validateAvatarFile } from '@/services/storage';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client-db';
import AppButton from '@/components/AppButton';
import AppInput from '@/components/AppInput';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import RequireAuth from '@/components/guards/RequireAuth';
import Header from '@/components/Header';
import ActionFooter from '@/components/ActionFooter';
import { useEffect, useMemo } from 'react';
import styles from './edit.module.css';
import * as Avatar from '@radix-ui/react-avatar';
import { getUserDisplayName, getUserPhotoURL } from '@/lib/utils/helpers-user';

export default function EditProfilePage() {
    return (
        <RequireAuth>
            <div className='pageLayout'>
                <Header />
                <EditProfileInner />
            </div>
        </RequireAuth>
    );
}

function EditProfileInner() {
    const { t: tCommon } = useI18n('common');
    const { t: tAccount } = useI18n('account');
    const { user } = useAuth();
    const [userData] = useDocumentData(user ? doc(db, 'users', user.uid) : null);
    const router = useRouter();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    const noChanges = () => {
        // Disable if no data, or not yet initialized with DB values
        if (!userData || !initialized) return true;

        // Use same fallback logic as initialization
        const initialName = userData?.name
            || userData?.displayName
            || user?.displayName
            || user?.email?.split('@')[0]
            || '';

        return name === initialName && phone === (userData?.phone ?? '') && !avatarFile;
    }

    useEffect(() => {
        if (!user) return; // Also check for user, not just userData

        // Use the same fallback logic as getUserDisplayName
        const initialName = userData?.name
            || userData?.displayName
            || user.displayName
            || user.email?.split('@')[0]
            || '';

        setName(initialName);
        setPhone(userData?.phone ?? '');
        setInitialized(true);
    }, [user, userData]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const validation = validateAvatarFile(file);
        if (!validation.valid) {
            setError(validation.error!);
            return;
        } else {
            setAvatarFile(file);
            // Create a local preview URL
            const objectUrl = URL.createObjectURL(file);
            setAvatarPreview(objectUrl);
        }
    };

    // Clean up preview URL on unmount or when it changes
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    const currentPhotoURL = useMemo(() => {
        if (avatarPreview) return avatarPreview;
        return getUserPhotoURL(user, userData);
    }, [avatarPreview, user, userData]);

    const displayName = getUserDisplayName(user, userData);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setError('');
        try {
            if (name !== userData?.name) {
                await updateName(user.uid, name);
            }
            if (phone !== userData?.phone) {
                await updatePhone(user.uid, phone);
            }
            if (avatarFile) {
                await uploadUserAvatar(user.uid, avatarFile);
            }
            router.push('/account');
        } catch (err) {
            console.error(err);
            setError(tAccount('failedToSaveChanges'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <main className='innerPageMain'>
                <h1>{tAccount('editProfile')}</h1>
                <form onSubmit={handleSubmit} id="edit-profile-form" className={styles.editProfileForm}>
                    <div className={styles.uploadProfilePicture}>
                        <label className={styles.avatarLabel}>
                            <Avatar.Root className={styles.avatarRoot}>
                                <Avatar.Image
                                    src={currentPhotoURL ?? undefined}
                                    alt={displayName}
                                    className={styles.avatarImage}
                                />
                                <Avatar.Fallback delayMs={0} className={styles.avatarFallback}>
                                    {displayName.slice(0, 1).toUpperCase()}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <div className={styles.overlay}>{tCommon('edit')}</div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                disabled={saving}
                                className={styles.fileInput}
                            />
                        </label>
                    </div>

                    <AppInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={tAccount('yourName')}
                    />

                    <>
                        <AppInput
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={tAccount('phoneNumber')}
                        />
                        <label>{tAccount('phoneNumberNote')}</label>
                    </>



                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </form>
            </main>
            <ActionFooter direction="row">
                <AppButton variant="secondary" href="/account">{tCommon('back')}</AppButton>
                <AppButton form="edit-profile-form" type="submit" disabled={saving || noChanges()}>
                    {saving ? tCommon('saving') : tCommon('saveChanges')}
                </AppButton>
            </ActionFooter>
        </>
    );
}