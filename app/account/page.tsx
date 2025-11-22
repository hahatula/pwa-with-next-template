'use client';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthProvider';
import RequireAuth from '@/components/guards/RequireAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
// import EnablePush from '@/components/EnablePush';
import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { useI18n } from '@/lib/i18n';
import EmailIcon from '@/components/icons/Email';
import * as Avatar from '@radix-ui/react-avatar';
import { getUserDisplayName, getUserPhotoURL } from '@/lib/utils/helpers-user';
import { db } from '@/lib/firebase/client-db';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useMemo } from 'react';
import ActionFooter from '@/components/ActionFooter';

export default function AccountPage() {

    return (
        <RequireAuth>
            <div className='pageLayout'>
                <Header />
                <AccountInner />
            </div>
        </RequireAuth>
    );
}

function AccountInner() {
    const { t: tCommon } = useI18n('common');
    const { t: tAccount } = useI18n('account');

    const { user } = useAuth();
    const [userData] = useDocumentData(
        user ? doc(db, 'users', user.uid) : null
    );

    const displayName = getUserDisplayName(user, userData);
    const photoURL = useMemo(
        () => getUserPhotoURL(user, userData),
        [user, userData]
    );

    return (
        <>
            <main className='innerPageMain'>
                <h1>{tAccount('myAccount')}</h1>
                <div className={styles.accountInfo}>
                    <Avatar.Root className={styles.accountPhoto}>
                        <Avatar.Image
                            src={photoURL ?? undefined}
                            alt={displayName}
                            className={styles.accountPhotoImage}
                            key={photoURL} />
                        <Avatar.Fallback delayMs={200} className={styles.accountPhotoFallback}>
                            {displayName.slice(0, 1).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <p>{displayName}</p>
                    <div className={styles.accountInfoItem}>
                        <EmailIcon />
                        <p>{user?.email}</p>
                    </div>
                </div>
                <AppButton href="/account/edit" variant="secondary">
                    {tAccount('editProfile')}
                </AppButton>
                {/* <EnablePush /> */}
            </main>
            <ActionFooter>
                <AppButton href="/account/my-upcoming-classes">{tAccount('myUpcomingClasses')}</AppButton>
                <AppButton variant="secondary" onClick={() => signOut(auth)}>{tCommon('logout')}</AppButton>
            </ActionFooter>
        </>
    );
}
