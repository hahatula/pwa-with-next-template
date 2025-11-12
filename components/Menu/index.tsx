import styles from "./Menu.module.css";
import { useAuth } from "@/contexts/AuthProvider";
import AppButton from "../AppButton";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

export default function Menu({ onClose }: { onClose: () => void }) {
    const { t: tAccount } = useI18n('account');
    const { t: tSchedule } = useI18n('schedule');
    const { isAdmin } = useAuth();
    return (
        <>
            <nav className={styles.menu}>
                <div className={styles.logoWrap}>
                    <Image
                        className={styles.logo}
                        src="/logo.png"
                        alt="Pitbull BJJ Team logo"
                        fill
                        priority
                        sizes="100vw"
                    />
                </div>
                <AppButton variant="gradient" className={styles.menuToggle} onClick={onClose}>X</AppButton>
                <div className={styles.menuList}>
                    <AppButton variant="primary" href="/account/my-upcoming-classes">{tAccount('myUpcomingClasses')}</AppButton>
                    <AppButton variant="secondary" href="/schedule">{tSchedule('schedule')}</AppButton>
                    <AppButton variant="secondary" href="/account">{tAccount('myAccount')}</AppButton>
                </div>
                {isAdmin && <ul className={styles.menuList + ' ' + styles.menuListAdmin}>
                    <AppButton variant="primary" href="/admin">{tAccount('adminWorkspace')}</AppButton>
                </ul>}
            </nav>
        </>
    );
}