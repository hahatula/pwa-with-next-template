// components/InstallPrompt.tsx
'use client';
import styles from './InstallPrompt.module.css';
import PitButton from '@/components/PitButton';
import { useInstallPrompt } from './useInstallPrompt';
import { useI18n } from '@/lib/i18n';

export default function InstallPrompt() {
    const { isMobile, installed, displayModeStandalone, isiOS, deferred, noPromptHint, requestInstall } = useInstallPrompt();
    const { t: tHome } = useI18n('home');

    if (!isMobile) return null;
    if (installed || displayModeStandalone) return null;

    if (isiOS) return (<>
        <p>{tHome('installPrompt')}</p>
        <p className={styles.installPrompt}>{tHome('installInstructionIOS')}</p>
    </>);   
    if (!deferred && noPromptHint) return (<>
        <p>{tHome('installPrompt')}</p>
        <p className={styles.installPrompt}>{tHome('installInstructionInAppBrowser')}</p>
    </>);
    if (!deferred) return null;

    return (
        <>
            <p>{tHome('installPrompt')}</p>
            <PitButton onClick={requestInstall ?? undefined}>{tHome('installButton')}</PitButton>
        </>);
}