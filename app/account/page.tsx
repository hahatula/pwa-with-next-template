'use client';
import styles from './page.module.css';
import { useAuth } from '@/contexts/AuthProvider';
import RequireAuth from '@/components/guards/RequireAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import EnablePush from '@/components/EnablePush';
import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { useI18n } from '@/lib/i18n';
import EmailIcon from '@/components/icons/Email';
import Image from 'next/image';

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
    const photoURL = user?.photoURL || user?.providerData?.find((p) => p.photoURL)?.photoURL;
    return (
        <>
            <main className='innerPageMain'>
                <h1>{tAccount('myAccount')}</h1>
                <div className={styles.accountInfo}>
                    {photoURL && <Image className={styles.accountPhoto} src={photoURL} alt="User photo" width={100} height={100} referrerPolicy="no-referrer" />}
                    <p>{user?.displayName}</p>
                    <div className={styles.accountInfoItem}>
                        <EmailIcon />
                        <p>{user?.email}</p>
                    </div>
                </div>
                <EnablePush />
            </main>
            <footer className={styles.ctasWrapper}>
                <AppButton href="/account/my-upcoming-classes">{tAccount('myUpcomingClasses')}</AppButton>
                <AppButton variant="secondary" onClick={() => signOut(auth)}>{tCommon('logout')}</AppButton>
            </footer>
        </>
    );
}
